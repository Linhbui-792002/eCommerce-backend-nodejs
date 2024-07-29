'use strict';

import { SuccessResponse } from '../core/success.response.js';
import ProductService from '../services/product.service.js';
import ProductServiceV2 from '../services/product.service.xxx.js';

class ProductController {

    createProduct = async (req, res, next) => {

        // new SuccessResponse({
        //     message: 'Create new product success!',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res);

        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    //update product
    updateProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    // PUT //

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'published product success!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Un Publish product success!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }



    // QUERY //
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all product draft for shop!',
            metadata: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all product published for shop!',
            metadata: await ProductServiceV2.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list getListSearchProduct success!',
            metadata: await ProductServiceV2.searchProducts(
                { keySearch: req.params.keySearch }
            )
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list findAllProducts success!',
            metadata: await ProductServiceV2.findAllProducts(
                req.query
            )
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list findProduct success!',
            metadata: await ProductServiceV2.findProduct(
                { product_id: req.params.product_id }
            )
        }).send(res);
    }

    // END QUERY //

}
const productController = new ProductController();
export default productController;
