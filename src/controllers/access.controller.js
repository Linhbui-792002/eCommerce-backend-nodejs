'use strict';

import AccessService from '../services/access.service.js';

class AccessController {
  signup = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      const resutl = await AccessService.signUp(req.body);
      console.log(resutl, 'resutl');
      return res.status(201).json({ ...resutl });
    } catch (error) {
      next(error);
    }
  };
}
const accessController = new AccessController();
export default accessController;
