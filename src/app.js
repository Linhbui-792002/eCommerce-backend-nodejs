import * as dotenv from 'dotenv';
import router from './routers/index.js';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

//init db
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
app.use(
  express.urlencoded({
    extended: true,
  })
);

//init db

// checkOverLoad();

//init routers
app.use('/', router);

//handling error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  });
  next(error);
});

export default app;
