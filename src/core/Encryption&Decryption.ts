import CryptoJS from 'crypto-js';
import { StatusCode, SALT_ROUNDS } from '../config';
import bcrypt from 'bcryptjs';

const { ENCRYPTION_SECRET_KEY } = process.env;

export class EncryptionAndDecryption {
  public static encryption(body: any) {
    // @ts-ignore
    return CryptoJS.AES.encrypt(JSON.stringify(body), ENCRYPTION_SECRET_KEY).toString();
  }

  public static decryption(body: any) {
    try {
      // @ts-ignore
      const bytes = CryptoJS.AES.decrypt(body, ENCRYPTION_SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
      return StatusCode.INVALID_ENCRYPTED_INPUT;
    }
  }

  public static saltEncryption(data: any) {
    return new Promise((resolve, reject) => {
      bcrypt
        .hash(data, SALT_ROUNDS)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public static saltCompare(data: any, hash: any): any {
    return new Promise((resolve, reject) => {
      bcrypt
        .compare(data, hash)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
