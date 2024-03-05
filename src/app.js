import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { intanceMongodb } from './database/init.mongodb.js';
import { countConnect, checkOverLoad } from './helpers/check.connect.js';
const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

//init db
checkOverLoad();

//init routers
app.get('/', (req, res, next) => {
  const strCompress = 'hello anh alaxdev';
  return res.status(200).json({
    mess: 'hello anh em',
    matadata: strCompress.repeat(100000),
  });
});
//handling error

export default app;
