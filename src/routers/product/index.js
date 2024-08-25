'use strict';

import express from 'express';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authenticationV2 } from '../../auth/authUtils.js';
const routerProduct = express.Router();

//user
routerProduct.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
routerProduct.get('/', asyncHandler(productController.findAllProducts));
routerProduct.get('/:product_id', asyncHandler(productController.findProduct));


// authentication
routerProduct.use(authenticationV2)
///
routerProduct.post('/', asyncHandler(productController.createProduct));
routerProduct.patch('/:productId', asyncHandler(productController.updateProduct));
routerProduct.post('/publish/:id', asyncHandler(productController.publishProductByShop));
routerProduct.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop));


// QUERY //

routerProduct.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
routerProduct.get('/published/all', asyncHandler(productController.getAllPublishedForShop))
export default routerProduct;
