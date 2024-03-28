'use strict'

import { product, clothing, electronic } from '../models/product.model.js';
import { BadRequestError } from '../core/error.response.js'
// define factory class to create product
class ProductFactory {
    /**
     * Type:'Clothing'
     * payload
     */

    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronic':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

/**
 * product_name: {
        type: String,
        require: true
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description
    product_price: {
        type: Number,
        require: true
    },
    product_quanlity: {
        type: Number,
        require: true
    },
    product_type: {
        type: String,
        require: true,
        enum: ["Electronics", "Clothing", "Furniture"]
    },
    product_shop: {
        type: Schema.Types.ObjectID,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    }
 */

//define  base product class
class Product {
    constructor({
        product_name, product_thumb, product_price, product_quanlity,
        product_type, product_shop, product_attributes, product_description
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_quanlity = product_quanlity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_description = product_description
    }

    //create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
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
}
const ProductService = ProductFactory
export default ProductService