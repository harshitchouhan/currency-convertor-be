import 'dotenv/config';

import App from './app';
import { PORT } from './config';


import { SecurityController } from './controller/security/security.controller';

export const app = new App([new SecurityController()], PORT);

app.listen();
