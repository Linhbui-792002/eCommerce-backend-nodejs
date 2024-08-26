import Discount from "../models/discount.model.js"
import { getSelectData, unGetSelectData } from "../utils/index.js"


const findAllDiscountCodeUnSelect = async ({
    limit = 50 , page = 1, sort= 'ctime',
    filter, unSelect
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discounts = await Discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()

    return discounts
}

const findAllDiscountCodeSelect = async ({
    limit = 50 , page = 1, sort= 'ctime',
    filter, select
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discounts = await Discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return discounts
}

const checkDiscountExists = async (filter) => {
   return await Discount.findOne(filter).lean()
}


export {findAllDiscountCodeUnSelect, findAllDiscountCodeSelect, checkDiscountExists}