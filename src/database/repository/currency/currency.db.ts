import express from 'express';
import { ApiError } from '../../../core/ApiError';
import { SaveRecordInterface } from '../../../interfaces/currency/saveRecord.interface';
import Database from '../../database';

export class CurrencyDB extends Database {
  public saveRecord = async (dbObject: SaveRecordInterface, res: express.Response) => {
    const query = `INSERT INTO public."currency-rates"(
        rates, date)
        VALUES ('${dbObject.rates}', '${dbObject.date}');`;

    this.setPGConfig('currency-convertor-db');

    return this.executePGQuery(query)
      .then((data: any) => {
        return data['rows'][0];
      })
      .catch((error) => {
        ApiError.handle(error, res);
      });
  };
}
