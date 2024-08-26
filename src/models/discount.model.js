'use strict';

import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, default: "fixed_amount" }, // percentage
        discount_value: { type: Number, required: true }, // 10.000, ...
        discount_code: { type: String, required: true },
        discount_start_date: { type: Date, required: true },
        discount_end_date: { type: Date, required: true },
        discount_max_uses: { type: Number, required: true }, // quantity discount apply
        discount_uses_count: {type: Number, required:true}, // so discount da dung
        discount_user_used: {type: Array, default:[]}, // ai da dung
        discount_max_user_per_used: {type: Number, required:true} ,// so luong toi da cho phep user dung
        discount_min_order_value: {type: Number, required:true},
        discount_max_value: {type:Number, required:true},
        discount_shopId: {type: Schema.Types.ObjectId, ref:'Shop'},

        discount_is_active: {type: Boolean, default: true},
        discount_is_delete: {type: Boolean, default: false},
        discount_applies_to: {type: String, required:true, enum: ["all", 'specific']},
        discount_product_ids: {type: Array, default:[]}, // so san pham duoc ap dung

   
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
const Discount = mongoose.model(DOCUMENT_NAME, discountSchema);
export default Discount;
