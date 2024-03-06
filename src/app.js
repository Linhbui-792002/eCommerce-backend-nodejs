import * as dotenv from 'dotenv';
import router from './routers/index.js';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { intanceMongodb } from './database/init.mongodb.js';
import { countConnect, checkOverLoad } from './helpers/check.connect.js';
dotenv.config();
const app = express();
// console.log(`Process:`, process.env);
//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}))

//init db
app.use('/', router);

// checkOverLoad();

//init routers

//handling error

export default app;
