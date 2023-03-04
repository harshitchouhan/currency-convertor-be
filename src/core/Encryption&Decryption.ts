import CryptoJS from 'crypto-js';
import { StatusCode } from '../config';

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
}
