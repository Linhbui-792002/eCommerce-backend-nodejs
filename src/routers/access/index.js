'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';
const routerAccess = express.Router();

// signUp
routerAccess.post('/shop/signup', accessController.signup);

export default routerAccess;
