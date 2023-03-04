import sql from 'mssql';

import StoredProcedureParameters from '../interfaces/storedProcedureParamter.interface';
import { DB_CONFIGS, DB_ENVIRONMENT } from './database.config';

const { Client } = require('pg');
export class Database {
  static configs: any;

  private mssqlConfig!: {
    server: string;
    port: number;
    user: string;
    password: string;
    database: string;
    options: {
      enableArithAbort: true;
      trustServerCertificate: true;
    };
    connectionTimeout: 150000;
    requestTimeout: 300000;
    pool: {
      max: 10;
      min: 0;
      idleTimeoutMillis: 30000;
    };
  };

  private postgresConfig!: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: string;
  };

  /**
   * A generic function to update PG Connection strings
   * @param dbName DB Name
   */
  protected async setPGConfig(dbName: string) {
    return new Promise((resolve, _) => {
      this.postgresConfig = {
        user: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS[dbName].user,
        host: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS[dbName].host,
        database: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS[dbName].database,
        password: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS[dbName].password,
        port: DB_CONFIGS[DB_ENVIRONMENT].POSTGRESS[dbName].port,
      };

      resolve(this.postgresConfig);
    });
  }

  /**
   * A generic function to update PG Connection strings
   * @param dbName DB Name
   */
  protected async setMsSqlConfig(dbName: string) {
    return new Promise((resolve, _) => {
      this.mssqlConfig = {
        server: DB_CONFIGS[DB_ENVIRONMENT].MSSQL[dbName].server,
        port: DB_CONFIGS[DB_ENVIRONMENT].MSSQL[dbName].port,
        user: DB_CONFIGS[DB_ENVIRONMENT].MSSQL[dbName].user,
        password: DB_CONFIGS[DB_ENVIRONMENT].MSSQL[dbName].password,
        database: DB_CONFIGS[DB_ENVIRONMENT].MSSQL[dbName].database,
        options: {
          enableArithAbort: true,
          trustServerCertificate: true,
        },
        connectionTimeout: 150000,
        requestTimeout: 300000,
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        },
      };

      resolve(this.mssqlConfig);
    });
  }

  /**
   * A generic function to execute POSTGRES Query
   * @param query statement to be executed
   */
  protected executePGQuery(query: string) {
    return new Promise((resolve, reject) => {
      const client = new Client(this.postgresConfig);
      client.connect();
      client.query(query, (err: any, res: any) => {
        client.end();
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * A generic function to execute stored procedures
   * @param spName string
   * @param parameters StoredProcedureParameters
   */
  protected executeStoreProcedure(spName: string, parameters: StoredProcedureParameters[] = []) {
    return new Promise((resolve, reject) => {
      sql
        .connect(this.mssqlConfig)
        .then((pool) => {
          let request = pool.request();

          if (Array.isArray(parameters) && parameters.length > 0) {
            parameters.forEach((parameter) => {
              if (parameter.variableType === 'IN' || parameter.variableType === 'INOUT') {
                request.input(parameter.name, parameter.type, parameter.value);
              } else if (parameter.variableType === 'OUT') {
                request.output(parameter.name, parameter.type);
              }
            });
          }

          return request.execute(`[${this.mssqlConfig.database}].${spName}`);
        })
        .then((result) => {
          // @ts-ignore
          sql.close();
          resolve(result?.recordset ? this._formatResul(result.recordsets) : null);
        })
        .catch((err) => {
          // @ts-ignore
          sql.close();
          reject(err);
        });
    });
  }

  /**
   * Generic function to format the result if there are multiple recordsets given by SPs
   * @param result obtained from successful execution of SP
   * @returns formatted result object into different levels
   */
  private _formatResul(result: any) {
    if (result.length > 1) {
      let resultObj: any = {};
      result.forEach((record: any, index: number) => {
        resultObj[`level${index + 1}`] = record;
      });
      return [resultObj];
    }

    return result[0];
  }
}

export default Database;
