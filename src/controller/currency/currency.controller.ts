import axios from 'axios';
import express from 'express';
import moment from 'moment';
import { OPEN_EXCHANGE_RATES_CONFIGS } from '../../config';
import { ApiError, BadRequestError, AuthFailureError, ForbiddenError, NotFoundError, InternalError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { DB_ENVIRONMENT } from '../../database/database.config';
import { CurrencyDB } from '../../database/repository/currency/currency.db';

import Controller from '../../interfaces/controller.interface';
import { CacheMiddleware } from '../../middlewares/cache.middleware';
import { BaseController } from '../BaseController';

const { APP_ID } = process.env;

export class CurrencyController extends BaseController implements Controller {
  public path = '/currency';
  public router = express.Router();

  private db = new CurrencyDB();

  constructor() {
    super();

    this._initializeRoutes();
  }

  private _initializeRoutes = () => {
    this.router.get(`${this.path}/rates`, this._getRates);
  };

  private _getRates = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // 1. Checking in cache
    let key = moment(new Date()).format('YYYY-MM-DD');
    let cachedData = await CacheMiddleware.getCache(key);

    // 2. Sending response to client
    if (cachedData) return new SuccessResponse('success', cachedData).send(res);

    // 3. Fetching rates from openexchangerates
    let url = `${OPEN_EXCHANGE_RATES_CONFIGS[DB_ENVIRONMENT].getLatestRatesURL}?app_id=${APP_ID}`;
    await axios
      .get(url)
      .then(async (response) => {
        // 4. Storing data in cache
        let data = response.data;
        CacheMiddleware.setCache(key, data);

        // 5. Storing data in DB
        await this.db.saveRecord({ date: key, rates: JSON.stringify(data) }, res);

        // 5. Sending response to client
        new SuccessResponse('success', data).send(res);
      })
      .catch((err) => {
        let { status } = err.response.data;

        if (status === 400) return ApiError.handle(new BadRequestError(), res);
        if (status === 401) return ApiError.handle(new AuthFailureError(), res);
        if (status === 403 || status === 429) return ApiError.handle(new ForbiddenError(), res);
        if (status === 404 || status === 405) return ApiError.handle(new NotFoundError(), res);

        return ApiError.handle(new InternalError(), res);
      });
  });
}
