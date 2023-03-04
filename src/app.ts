import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import useragent from 'express-useragent';
import helmet from 'helmet';

import { ENABLE_ENCRYPTION, NON_ENCRYPTION_ENDPOINTS, PATH, SERVER_IPS, StatusCode } from './config';
import { ApiError, BadRequestError, CorsError, InternalError, NotFoundError } from './core/ApiError';

import Controller from './interfaces/controller.interface';
import { EncryptionAndDecryption } from './core/Encryption&Decryption';
import { DB_ENVIRONMENT } from './database/database.config';
import moment from 'moment';
import { CacheMiddleware } from './middlewares/cache.middleware';

class App {
  public app: express.Application;
  public port: any;

  private cacheMiddleware = new CacheMiddleware();

  private CORS_ALLOWED_ENDPOINTS = [...SERVER_IPS.LOCAL, ...SERVER_IPS.DEV, ...SERVER_IPS.UAT, ...SERVER_IPS.PROD];

  constructor(controllers: Controller[], port: any) {
    this.app = express();
    this.port = port;

    this.initializeRedis();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeRedis() {
    this.cacheMiddleware.createRedisServer();
  }

  private initializeMiddlewares() {
    this.app.use((_, res, next) => {
      res.set('start', `${Date.now()}`);
      next();
    });

    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req: Request, _: Response, next: NextFunction) => {
      req.headers.origin = req.headers.origin || req.headers.host;
      next();
    });

    const corsOptions: any = {
      origin: (origin: any, callback: Function) => {
        !origin || this.CORS_ALLOWED_ENDPOINTS.indexOf(origin) !== -1 ? callback(null, true) : callback(new CorsError());
      },
    };
    this.app.use(cors(corsOptions));

    this.app.use(helmet());
    this.app.use(useragent.express());

    this.app.use((req, res, next) => {
      if (ENABLE_ENCRYPTION === true && req.method === "POST" && !NON_ENCRYPTION_ENDPOINTS.includes(req.url) && !req.headers['content-type']?.includes('multipart/form-data')) {
        const result = EncryptionAndDecryption.decryption(req.body.data);
        if (result === StatusCode.INVALID_ENCRYPTED_INPUT) {
          return ApiError.handle(new BadRequestError('Invalid Encrpted String'), res);
        } else {
          req.body = result;
        }
      }
      next();
    });
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(PATH, controller.router);
    });
  }

  private initializeErrorHandling() {
    // catch 404 and forward to error handler
    this.app.use((_req, res, _next) => {
      return ApiError.handle(new NotFoundError(), res);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof ApiError) {
        return ApiError.handle(err, res);
      } else {
        if (DB_ENVIRONMENT !== 'PROD') {
          return res.status(500).send(err.message);
        }
        return ApiError.handle(new InternalError(), res);
      }
    });

    process.on('unhandledRejection', (error: any) => {
      if (error.code !== 'ERR_HTTP_HEADERS_SENT') {
        console.log('unhandledRejection', error.message);
        console.log('unhandledRejection', error.stack);
      }
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
