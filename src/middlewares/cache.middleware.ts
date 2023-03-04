// @ts-ignore
import redis from 'redis';

import { REDIS_KEY_EXPIRY_TIME } from '../config';

export class CacheMiddleware {
  static client: any;

  createRedisServer = () => {
    CacheMiddleware.client = redis.createClient();
    CacheMiddleware.client.on('error', (err: any) => console.log('Redis Client Error', err));
  };

  static setCache = (key: string, value: any) => {
    CacheMiddleware.client.setex(key, REDIS_KEY_EXPIRY_TIME, JSON.stringify(value));
  };

  static getCache = (key: string): any => {
    return new Promise((resolve, reject) => {
      CacheMiddleware.client.get(key, (error: any, data: any) => {
        if (error) reject(error);
        resolve(JSON.parse(data));
      });
    });
  };
}
