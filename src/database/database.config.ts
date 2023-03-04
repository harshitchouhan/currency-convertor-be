import { EncryptionAndDecryption } from '../core/Encryption&Decryption';

export const DB_ENVIRONMENT: 'DEV' | 'PROD' = 'DEV';

export const DB_CONFIGS: any = {
  DEV: {
    POSTGRESS: {
      'currency-convertor-db': {
        user: 'ubuntu',
        host: '65.2.78.173',
        database: 'currency-convertor-db',
        password: 'password',
        port: 5432,
      },
    },
  },
  PROD: {
    POSTGRESS: {
      'currency-convertor-db': {
        user: EncryptionAndDecryption.decryption('U2FsdGVkX19rqxKPjN1jrtUK8cjdnBr2TRjRCkN/DE4='),
        host: 'localhost',
        database: EncryptionAndDecryption.decryption('U2FsdGVkX1+otnCctZemJqelGMdb81AuoiGY5J982j60sU/9sCr/ohYfHud2CCkg'),
        password: EncryptionAndDecryption.decryption('U2FsdGVkX19fZ5rZMWeeS9oaJX0ROpDhy9NkUHJxPNM='),
        port: +EncryptionAndDecryption.decryption('U2FsdGVkX1+TbsnBdYUSSQHMZCkKRMUXyB/3wRX7c8o='),
      },
    },
  },
};
