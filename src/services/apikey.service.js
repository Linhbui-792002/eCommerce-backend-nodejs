'use strict';
import ApiKey from '../models/apikey.model.js';

const findById = async (key) => {
  try {
    const objKey = await ApiKey.findOne({ key, status: true }).lean();

    return objKey;
  } catch (error) {
    console.log(error);
  }
};

export default findById;
