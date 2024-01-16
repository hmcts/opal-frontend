import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';

import type { Router } from 'express';
import { proxy } from './api';
import { ssoAuthenticated, ssoLoginCallback, ssoLogin, ssoLogout, ssoLogoutCallback } from './sso';
import {
  ssoLoginStub,
  ssoLoginCallbackStub,
  ssoAuthenticatedStub,
  ssoLogoutStub,
  ssoLogoutCallbackStub,
} from './stubs/sso';

export default (): Router => {
  const router = express.Router();
  const ssoEnabled = config.get('features.sso.enabled');

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));

  router.use('/api', proxy());

  // Handle our authentication
  if (ssoEnabled) {
    router.get('/sso/login', (req, res) => ssoLogin(req, res));
    router.post('/sso/login-callback', (req, res, next) => ssoLoginCallback(req, res, next));
    router.get('/sso/logout', (req, res, next) => ssoLogout(req, res, next));
    router.get('/sso/logout-callback', (req, res, next) => ssoLogoutCallback(req, res, next));
    router.get('/sso/authenticated', (req, res) => ssoAuthenticated(req, res));
  } else {
    router.get('/sso/login', (req, res) => ssoLoginStub(res));
    router.get('/sso/login-callback', (req, res, next) => ssoLoginCallbackStub(req, res, next));
    router.get('/sso/authenticated', (req, res) => ssoAuthenticatedStub(req, res));
    router.get('/sso/logout', (req, res) => ssoLogoutStub(req, res));
    router.get('/sso/logout-callback', (req, res, next) => ssoLogoutCallbackStub(req, res, next));
  }

  return router;
};
