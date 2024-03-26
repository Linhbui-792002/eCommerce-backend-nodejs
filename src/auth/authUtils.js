'use strict';
import JWT from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandler.js'
import { AuthFailureError, NotFoundError } from '../core/error.response.js';
import KeyTokenService from '../services/keyToken.service.js';
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'athorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      //   algorithm: 'RS256',
      expiresIn: '2days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      //   algorithm: 'RS256',
      expiresIn: '7days',
    });

    //verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) { }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check userId missing ???
   * 2 - get accessToken
   * 3 - verifyToken
   * 4 - check user in dbs
   * 5 - check keyStore with this userId
   * 6 - OK all => return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  //2
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not founf keyStore')

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId != decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }

})


const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

export { createTokenPair, authentication, verifyJWT };
