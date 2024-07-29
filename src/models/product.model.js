'use strict'

import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        require: true
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description: {
        type: String,
        require: true
    },
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
        enum: ["Electronic", "Clothing", "Furniture"]
    },
    product_shop: {
        type: Schema.Types.ObjectID,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})


//define the product type = Clothing

const clothingSchema = new Schema({
    branch: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    }
}, {
    timestamps: true,
    collection: 'clothes',
})

const electronicSchema = new Schema({
    manufacture: {
        type: String,
        require: true
    },
    model: String,
    color: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    }
}, {
    timestamps: true,
    collection: 'electronics',
})

const furnitureSchema = new Schema({
    branch: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    }
}, {
    timestamps: true,
    collection: 'furnitures',
})


//Export the model
export const clothing = mongoose.model('Clothing', clothingSchema);
export const electronic = mongoose.model('Electronics', electronicSchema);
export const furniture = mongoose.model('Furnitrures', furnitureSchema);
export const product = mongoose.model(DOCUMENT_NAME, productSchema);


