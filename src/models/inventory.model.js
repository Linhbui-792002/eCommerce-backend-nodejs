'use strict';

import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    inven_product: {type: Schema.Types.ObjectId, ref: 'Product'},
    inven_location:{type:String, default: 'unKnow'},
    inven_stock :{type: Number, required:true},
    inven_shopId :{type: Schema.Types.ObjectId, ref:"Shop"},
    inven_reservations :{type: Array, default: []},
    /**
     * cardId: 
     * stock: 1
     * createdOn:
     */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Inventory = mongoose.model(DOCUMENT_NAME, inventorySchema);
export default Inventory;
