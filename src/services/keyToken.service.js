'use strict';
import KeyTokenModel from '../models/keytoken.model.js';

import { Types } from 'mongoose';
class KeyTokenService {

  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // use RSA
      //   const publicKeyString = publicKey.toString();
      //level 0
      // const tokens = await KeyTokenModel.create({
      //   user: userId,
      //     publicKey,
      //   privateKey
      // });
      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await KeyTokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  static removeKeyById = async (id) => {
    return await KeyTokenModel.deleteOne(id)
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await KeyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await KeyTokenModel.findOne({ refreshToken })
  }

  static deleteKeyById = async (userId) => {
    return await KeyTokenModel.deleteOne({ user: new Types.ObjectId(userId) })
  }


}

export default KeyTokenService;
