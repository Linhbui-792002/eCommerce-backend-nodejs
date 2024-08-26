'use strict';

import { SuccessResponse } from '../core/success.response.js';
import DiscountService from '../services/discount.service.js';

class DiscountController {
    
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: ' Successful code Generation',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: ' Successful code found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: ' Successful code found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: ' Successful code found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }


}

const discountController = new DiscountController();
export default discountController;