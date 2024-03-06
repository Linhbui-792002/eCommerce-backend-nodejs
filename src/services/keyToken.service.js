'use strict';
import KeyToken from '../models/keytoken.model.js';
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // use RSA
      //   const publicKeyString = publicKey.toString();

      const tokens = await KeyToken.create({
        user: userId,
          publicKey,
        privateKey
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
