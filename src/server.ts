import 'dotenv/config';

import App from './app';
import { PORT } from './config';
import { CurrencyController } from './controller/currency/currency.controller';

import { SecurityController } from './controller/security/security.controller';

export const app = new App([new SecurityController(), new CurrencyController()], PORT);

app.listen();
