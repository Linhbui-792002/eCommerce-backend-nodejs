'use strict';
import config from '../configs/config.mongodb.js';
import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect.js';
const {
  db: { host, name, port },
} = config;
const connectString = `mongodb://${host}:${port}/${name}`;
console.log(`connectString:`, connectString,process.env.PORT);
//dev
class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = 'mongodb') {
    //dev
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log(`Connect Mongodb Success`, countConnect());
      })
      .catch((err) => console.log(`Error Connect!`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const intanceMongodb = Database.getInstance();

export { intanceMongodb };
