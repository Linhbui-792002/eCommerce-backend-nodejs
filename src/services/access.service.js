'use strict';
import shopModel from '../models/shop.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service.js';
import createTokenPair from '../auth/authUtils.js';
import { getInfoData } from '../utils/index.js';
import { AuthFailureError, BadRequestError } from '../core/error.response.js';
import { findByEmail } from './shop.service.js';
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITER: 'EDITER',
  ADMIN: 'ADMIN',
};

class AccessService {
  /*
    1 - chech email in dbs
    2 - match password 
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login
   */

  static login = async ({ email, password, refreshToken = null }) => {
    //1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop  not registered');

    //2,
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authenticaton error');

    //3,
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    //4
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });
    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    //step1 check email exists
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Error Shop already registered!');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1', //pkcf8
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      //Public key CrytoGraphy Standards. trong RSA

      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      // console.log({ privateKey, publicKey }, '{ privateKey, publicKey '); //save collection keyStore
      // console.log(newShop._id, 'newShop._id');
      // useRSA
      // const pulicKeyString = await KeyTokenService.createKeyToken({

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError();
      }

      // RSA
      // const publicKeyObject = crypto.createPublicKey(pulicKeyString);

      //created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log(`Reated Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };
}

export default AccessService;
