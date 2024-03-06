'use strict';
import routerAccess from './access/index.js';
import express from 'express';
const router = express.Router();

router.use('/v1/api/',routerAccess);

export default router;
