'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../auth/checkAuth.js';
const routerAccess = express.Router();

// signUp
routerAccess.post('/shop/signup', asyncHandler(accessController.signup));
routerAccess.post('/shop/login', asyncHandler(accessController.login));

export default routerAccess;
