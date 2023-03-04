export const ENABLE_ENCRYPTION: boolean = true;
export const PORT = 4200;
export const REDIS_PORT = 6379;
export const REDIS_KEY_EXPIRY_TIME = 3600 * 24 * 1; // 1 day
export const PATH = '/curreny-conversion/api/v1';
export const SALT_ROUNDS = 10;
export const AMC_KEY = 'AMC_TOKEN';
export const BYPASS_TOKEN = 'bYP@$$T0k#N@TEST';
export const USER_NAME = 'U2FsdGVkX19BWF3rAcTEBAqCmu7N6K/LHZAeHxNVerz84MLXCZHmgkvLublBu7N6';
export const PASSWORD = 'U2FsdGVkX1/D0h+FH7I67/pVnj3KiiWjQTyuj7jRTmA=';

export const REGEX = {
  PAN: /[A-Z]{3}[P]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}/,
  STRING_CONTAINING_NUMBERS_ONLY: /^\d+$/,
};

// Helper code for the API consumer to understand the error and handle is accordingly
export enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
  INVALID_ENCRYPTED_INPUT = '10004',
}

export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export const SERVER_IPS = {
  LOCAL: [`http://localhost:${PORT}`, `localhost:${PORT}`],
  DEV: [],
  SIT: [],
  UAT: [],
  PROD: [],
};

export enum nonTokenAPIs {
  '/security/saltencryption',
  '/security/encryption',
  '/security/decryption',
}

export enum cachingAPIs {
  '/security/saltencryption',
  '/currency/rates',
}

export const NON_ENCRYPTION_ENDPOINTS = [`${PATH}/security/encryption`, `${PATH}/security/decryption`, `${PATH}/security/saltencryption`];

export const OPEN_EXCHANGE_RATES_CONFIGS = {
  DEV: {
    getLatestRatesURL: 'https://openexchangerates.org/api/latest.json',
  },
  UAT: {
    getLatestRatesURL: 'https://openexchangerates.org/api/latest.json',
  },
  PROD: {
    getLatestRatesURL: 'https://openexchangerates.org/api/latest.json',
  },
};
