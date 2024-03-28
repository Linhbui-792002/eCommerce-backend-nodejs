'use strict';

import express from 'express';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authenticationV2 } from '../../auth/authUtils.js';
const routerProduct = express.Router();


// authentication
routerProduct.use(authenticationV2)
///
routerProduct.post('/', asyncHandler(productController.createProduct));

export default routerProduct;
