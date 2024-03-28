'use strict';
import { apiKey, permission } from '../auth/checkAuth.js';
import routerAccess from './access/index.js';
import routerProduct from './product/index.js';
import express from 'express';
const router = express.Router();

// check apiKey
router.use(apiKey);
//check permissions
router.use(permission('0000'));

router.use('/v1/api/', routerAccess);
router.use('/v1/api/product', routerProduct);

export default router;
