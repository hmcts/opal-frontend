import express from 'express';
import type { Router } from 'express';
import { proxy } from './api';
import { ssoCallback, ssoLogin } from './auth';

export default (): Router => {
  const router = express.Router();

  router.use('/api', proxy());

  // Handle our authentication
  router.get('/auth/sso', (req, res) => ssoLogin(req, res));
  router.get('/auth/sso/callback', (req, res) => ssoCallback(req, res));

  return router;
};
