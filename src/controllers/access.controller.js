'use strict';

import { CREATED ,SuccessResponse} from '../core/success.response.js';
import AccessService from '../services/access.service.js';

class AccessController {

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
