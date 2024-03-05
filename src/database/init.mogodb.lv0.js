'use strict';
import mongoose from 'mongoose';

const connectString = `mongodb://127.0.0.1:27017/DB_eCommerce_Dev`;

const connect = mongoose
  .connect(connectString)
  .then((_) => console.log(`Connect Mongodb Success`))
  .catch((err) => console.log(`Error Connect!`));

//dev
if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

export default connect;
