import express from 'express';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

import { Database } from './../database/database';
import { EncryptionAndDecryption } from './Encryption&Decryption';
import { ENABLE_ENCRYPTION } from '../config';
import { ApiError, InternalError } from './ApiError';

export class Logger extends Database {
  constructor(private response: express.Response, private request: express.Request, private statusCode: string, private status: number, private clientResponse: any) {
    super();
    this.createLog();
  }

  private createLog = async () => {
    let formatted_date = moment(new Date()).format('YYYY-MM-DD kk:mm:ss.SSS');
    let method = this.request.method;
    let url = this.request.url;
    let status = this.statusCode;
    let fullUrl = this.request.protocol + '://' + this.request.get('host') + this.request.originalUrl;

    let activityLogDetails: any = {};
    let errorLogDetails: any = {};

    // @ts-ignore
    const duration = Date.now() - +this.response.get('start');
    let log = `[${formatted_date}] ${method}:${url} ${status} ${this.status} ${duration}ms`;

    if (this.status.toString().startsWith('2')) {
      let clientResponseClone = JSON.parse(JSON.stringify(this.clientResponse));
      if (this.clientResponse.hasOwnProperty('data') && ENABLE_ENCRYPTION) {
        clientResponseClone.data = EncryptionAndDecryption.decryption(clientResponseClone.data);
      }

      const transactionsDetails = {
        headers: JSON.stringify(this.request.headers),
        body: this.request.body,
        query: this.request.query,
        response: JSON.stringify(clientResponseClone),
      };

      activityLogDetails = {
        activityDateTime: formatted_date,
        deviceDetails: this.request.ip,
        method,
        endPoint: fullUrl,
        status: +status,
        statusCode: +this.status,
        responseTime: `${duration}ms`,
        transactionsDetails: JSON.stringify(transactionsDetails),
      };

      log += `\n${JSON.stringify(activityLogDetails)}\n-------------------------------`;
    }

    if (!this.status.toString().startsWith('2')) {
      const transactionsDetails = {
        headers: JSON.stringify(this.request.headers),
        body: this.request.body,
        query: this.request.query,
        response: JSON.stringify(this.clientResponse),
      };

      errorLogDetails = {
        activityDateTime: formatted_date,
        deviceDetails: this.request.ip,
        errorMethod: method,
        endPoint: fullUrl,
        errorCode: +status,
        statusCode: +this.status,
        responseTime: `${duration}ms`,
        errorDetails: this.clientResponse.message,
        transactionsDetails: JSON.stringify(transactionsDetails),
      };

      log += `\n${JSON.stringify(errorLogDetails)}\n-------------------------------`;
    }

    this.generateLogFile(log, this.status);
  };

  private generateLogFile = (log: string, status: number) => {
    let mainFolder = 'logs';
    let subFolder = status.toString().startsWith('2') ? 'success' : 'error';
    let dir = `${mainFolder}/${subFolder}`;
    let successLogsFileName = `${moment(new Date()).format('YYYY-MM-DD')}-success_logs.log`;
    let errorLogsFileName = `${moment(new Date()).format('YYYY-MM-DD')}-error_log.log`;
    let fileName = status.toString().startsWith('2') ? successLogsFileName : errorLogsFileName;

    if (!dir) dir = path.resolve(`logs/${subFolder}`);

    // create directory if it is not present
    if (!fs.existsSync(mainFolder)) {
      // Create the directory if it does not exist
      fs.mkdirSync(mainFolder);

      // create directory if it is not present
      if (!fs.existsSync(dir)) {
        // Create the directory if it does not exist
        fs.mkdirSync(dir);
      }
    } else {
      // create directory if it is not present
      if (!fs.existsSync(dir)) {
        // Create the directory if it does not exist
        fs.mkdirSync(dir);
      }
    }

    fs.appendFile(`${dir}/${fileName}`, log + '\n', (err) => {
      if (err) console.log(err);
    });
  };
}
