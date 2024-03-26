'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authentication } from '../../auth/authUtils.js';
const routerAccess = express.Router();

// signUp
routerAccess.post('/shop/signup', asyncHandler(accessController.signup));
routerAccess.post('/shop/login', asyncHandler(accessController.login));


// authentication
routerAccess.use(authentication)
//////////////////
routerAccess.post('/shop/logout', asyncHandler(accessController.logout));
routerAccess.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

export default routerAccess;
