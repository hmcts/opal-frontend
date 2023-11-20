import express from 'express';
import type { Router } from 'express';
import { proxy } from './api';
import { ssoCallback, ssoLogin, ssoLogout } from './sso';

export default (): Router => {
  const router = express.Router();

  router.use('/api', proxy());

  // Handle our authentication
  router.get('/sso/login', (req, res) => ssoLogin(req, res));
  router.get('/sso/logout', (req, res) => ssoLogout(req, res));
  router.get('/sso/callback', (req, res) => ssoCallback(req, res));

  return router;
};
