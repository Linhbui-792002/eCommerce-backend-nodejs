'use strict';

import User from '../models/shop.model.js';

const findByEmail = async ({ email, select = { email: 1, password: 1 , name:1,status:1 , roles:1 } }) => {
  return await User.findOne({ email }).select(select).lean();
};

export {findByEmail}