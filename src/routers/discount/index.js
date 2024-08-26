'use strict';

import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler.js'
import { authenticationV2 } from '../../auth/authUtils.js';
import discountController from '../../controllers/discount.controller.js';


const routerDiscount = express.Router();


// get amount a discount
routerDiscount.post('/amount', asyncHandler(discountController.getDiscountAmount))
routerDiscount.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts))

routerDiscount.use(authenticationV2)
routerDiscount.post('/',asyncHandler(discountController.createDiscountCode))
routerDiscount.get('/',asyncHandler(discountController.getAllDiscountCode))


export default routerDiscount;
