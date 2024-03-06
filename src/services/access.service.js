'use strict';
import shopModel from '../models/shop.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service.js';
import createTokenPair from '../auth/authUtils.js';
import { getInfoData } from '../utils/index.js';
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITER: 'EDITER',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step1 check email exists
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already registered',
        };
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
          return {
            code: 'xxxx',
            message: 'pulicKeyString error',
          };
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
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

export default AccessService;
