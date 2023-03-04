import 'dotenv/config';

import App from './app';
import { CurrencyController } from './controller/currency/currency.controller';
import { SecurityController } from './controller/security/security.controller';

const { PORT } = process.env;

export const app = new App([new SecurityController(), new CurrencyController()], PORT);

app.listen();
