'use strict'

import { product, clothing, electronic, furniture } from '../models/product.model.js';
import { BadRequestError } from '../core/error.response.js'
import {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} from '../repositories/product.repo.js';
import { removeUndefinedObject, updateNestedObjectParser } from '../utils/index.js';
// define factory class to create product
class ProductFactory {
    /**
     * Type:'Clothing'
     * payload
     */

    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
       ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product Types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product Types ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // PUT //
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    // END PUT //


    // QUERY
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0, select }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip, select })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true }, select = ['product_name', 'product_price', 'product_thumb'] }) {
        return await findAllProducts({ limit, sort, page, filter, select })
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }

}

//define  base product class
class Product {
    constructor({
        product_name, product_thumb, product_price, product_quantity,
        product_type, product_shop, product_attributes, product_description
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_description = product_description
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

//Define class for different product types clothing

class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }

    async updateProduct(productId) {

        // 1. remove attr has null or undefined
        //2 check update o dau
        const objectParams = this
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, bodyUpdate: objectParams.product_attributes, model: clothing })
        }

        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

//Define class for different product types electronic
class Electronic extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronic) throw new BadRequestError('create new electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct

    }

    async updateProduct(productId) {

        // 1. remove attr has null or undefined
        //2 check update o dau
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: electronic })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) throw new BadRequestError('create new furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct

    }
}

// register productType
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

const ProductServiceV2 = ProductFactory
export default ProductServiceV2