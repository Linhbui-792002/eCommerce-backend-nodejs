'use strict';

import { SuccessResponse } from '../core/success.response.js';
import ProductService from '../services/product.service.js';

class ProductController {

    createProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

}
const productController = new ProductController();
export default productController;
