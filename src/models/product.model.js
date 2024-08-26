'use strict'

import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        require: true,
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description: {
        type: String,
        require: true,

    },
    product_slug: {
        type: String,
        require: true
    },
    product_price: {
        type: Number,
        require: true
    },
    product_quantity: {
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
    },

    //more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5'],

        set: (val) => Math.round(val * 10) / 10
    },
    product_validate: {
        type: Array, default: []
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }

}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

// Docment middleware runs before .save() and .create() ...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { flower: true })
    next()
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
export const furniture = mongoose.model('Furniture', furnitureSchema);
export const product = mongoose.model(DOCUMENT_NAME, productSchema);


