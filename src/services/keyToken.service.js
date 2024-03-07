'use strict';
import KeyToken from '../models/keytoken.model.js';
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
      // const tokens = await KeyToken.create({
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

      const tokens = await KeyToken.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
