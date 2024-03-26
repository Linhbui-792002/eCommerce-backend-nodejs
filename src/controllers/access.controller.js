'use strict';

import { CREATED, SuccessResponse } from '../core/success.response.js';
import AccessService from '../services/access.service.js';

class AccessController {

  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    }).send(res);
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res);
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  }

  signup = async (req, res, next) => {
    const resutl = await AccessService.signUp(req.body);

    new CREATED({
      message: 'Registed OK!',
      metadata: resutl,
      options: {
        limit: 10,
      },
    }).send(res);
  };
}
const accessController = new AccessController();
export default accessController;
