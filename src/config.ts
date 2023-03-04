const { PORT, PATH } = process.env;

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
  UAT: ['65.2.78.173:4200'],
  PROD: [],
};

export enum nonTokenAPIs {
  '/security/encryption',
  '/security/decryption',
}

export enum cachingAPIs {
  '/currency/rates',
}

export const NON_ENCRYPTION_ENDPOINTS = [`${PATH}/security/encryption`, `${PATH}/security/decryption`];

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
