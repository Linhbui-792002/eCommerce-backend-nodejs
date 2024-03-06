'use strict';

import mongoose, { Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';
// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verfify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    role: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const User = mongoose.model(DOCUMENT_NAME, userSchema);
export default User;
