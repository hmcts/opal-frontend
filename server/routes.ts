import express from 'express';
import type { Router } from 'express';
import { proxy } from './api';
import { ssoAuthenticated, ssoLoginCallback, ssoLogin, ssoLogout, ssoLogoutCallback } from './sso';

export default (): Router => {
  const router = express.Router();

  router.use('/api', proxy());

  // Handle our authentication
  router.get('/sso/login', (req, res, next) => ssoLogin(req, res, next));
  router.get('/sso/login-callback', (req, res, next) => ssoLoginCallback(req, res, next));
  router.get('/sso/logout', (req, res, next) => ssoLogout(req, res, next));
  router.get('/sso/logout-callback', (req, res, next) => ssoLogoutCallback(req, res, next));
  router.get('/sso/authenticated', (req, res) => ssoAuthenticated(req, res));

  return router;
};
