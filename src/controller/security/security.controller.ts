import express from 'express';

import { SuccessResponse } from '../../core/ApiResponse';

import Controller from '../../interfaces/controller.interface';
import { BaseController } from '../BaseController';
import { EncryptionAndDecryption } from '../../core/Encryption&Decryption';

export class SecurityController extends BaseController implements Controller {
  public path = '/security';
  public router = express.Router();

  constructor() {
    super();
    this._initialiseRoutes();
  }

  /**
   * Initialize routes for this controller
   */
  private _initialiseRoutes() {
    this.router.post(`${this.path}/encryption`, this._encryptData);
    this.router.post(`${this.path}/decryption`, this._decryptData);
  }

  /**
   * Controller Function for Encrypting Data
   */
  private _encryptData = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // 1. Encrypt Request Body
    const encryptedData = EncryptionAndDecryption.encryption(req.body);

    // 2. Sending Encrypted Data to Client
    new SuccessResponse('success', encryptedData).send(res);
  });

  /**
   * Controller Function for Decrypting Data
   */
  private _decryptData = this.catchAsyn(async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // 1. Encrypt Request Body
    const decryptedData = EncryptionAndDecryption.decryption(req.body.data);

    // 2. Sending Encrypted Data to Client
    new SuccessResponse('success', decryptedData).send(res);
  });
}
