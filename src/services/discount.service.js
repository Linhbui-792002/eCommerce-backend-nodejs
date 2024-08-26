'use strict'

import { BadRequestError, NotFoundError } from "../core/error.response.js"
import Discount from '../models/discount.model.js';
import { checkDiscountExists, findAllDiscountCodeUnSelect } from "../repositories/discount.repo.js";
import { findAllProducts } from "../repositories/product.repo.js";
import { convertToObjectIdMongo } from "../utils/index.js";

/**
 * Discount Services
 * 1- Generator Discount Code [Shop | Admin]
 * 2- Get discount amount [user]
 * 3- Get all discount codes [user | Shop]
 * 4- Verify discount code [Admin |Shop]
 * 5- Delete discount code [Admin | Shop]
 * 6- Cancel discount code [user]
 */

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId,
            min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, users_used, uses_count, max_uses_per_user
        } = payload
        // check value

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }

        // create index for discount code
        const foundDiscount = await Discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists !')
        }

        const newDiscount = await Discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type, // percentage
            discount_value: value, // 10.000, ...
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_user_used: users_used,
            discount_max_user_per_used: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        return newDiscount
    }

    static async updateDiscountCode(payload, discountId) {
        const {
            code, start_date, end_date, is_active, shopId,
            min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, users_used, uses_count, max_per_user
        } = payload

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }

        // create index for discount code
        const foundDiscount = await Discount.findOne({
            _id: { $ne: discountId },
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount name exists !')
        }
        return await Discount.findByIdAndUpdate(discountId, payload)
    }


    // Get all discount with products

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit=50, page=1
    }) {
        // create index for discount_code
    
        const foundDiscount = await Discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount

        let products
        if (discount_applies_to === 'all') {
            //get all product
            products= await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongo(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            //get the products ids
            products =  await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    product_shop: convertToObjectIdMongo(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        console.log(products,'pconsole.log(products');
        return products
    }

    /**
     * Get all discount all of shop
     */

    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongo(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId']
        })

        return discounts
    }

    /**
     * Apply Discount Code
     * Products = [
     *  {
     *      productId,
     *      shopId,
     *      name
     *  }
     * ]
     */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {

        const foundDiscount = await checkDiscountExists( {
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongo(shopId)
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount not exits')
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_user_per_used,
            discount_user_used,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('discount expired!')
        if (!discount_max_uses) throw new NotFoundError(`Discount are out`)

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new NotFoundError(`discount expired!`)
        // }

        // check co gia tri toi thieu ko
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
        }

        if (totalOrder < discount_min_order_value) {
            throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}!`)
        }

        if (discount_max_user_per_used > 0) {
            const userUsedDiscount = discount_user_used.find(user => user.userId == userId)

            if (userUsedDiscount) {
                //..... 
            }
        }
        //check discount la fixed_amount or 

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        // const foundDiscount = ''
        // if(foundDiscount){
        //     //deleted
        // }
        const deleted = await Discount.findByIdAndDelete({
            discount_code: codeId,
            discount_shopId: shopId
        })
        return deleted
    }

    /**
     * 
     * Cancel discount code
     */
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists(filter = {
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongo(shopId)
        })

        if (!foundDiscount) throw new NotFoundError(`discount not exits`)

        const result = await Discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_max_user: 1,
                discount_uses_count: -1
            }
        })

        return result
    }
}

export default DiscountService