'use strict';

import mongoose, { Schema } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    privateKey: {
      type: String,
      required: true,
      trim: true,
    },
    publicKey: {
      type: String,
      required: true,
      trim: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const KeyTokenModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
export default KeyTokenModel;
