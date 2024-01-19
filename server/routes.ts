import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';

import type { NextFunction, Request, Response, Router } from 'express';
import { proxy } from './api';
import { ssoAuthenticated, ssoLoginCallback, ssoLogin, ssoLogout, ssoLogoutCallback } from './sso';
import {
  ssoLoginStub,
  ssoLoginCallbackStub,
  ssoAuthenticatedStub,
  ssoLogoutStub,
  ssoLogoutCallbackStub,
} from './stubs/sso';

const setupSSORoutes = (router: Router, ssoEnabled: boolean) => {
  const login = ssoEnabled ? ssoLogin : ssoLoginStub;
  const loginCallback = ssoEnabled ? ssoLoginCallback : ssoLoginCallbackStub;
  const logout = ssoEnabled ? ssoLogout : ssoLogoutStub;
  const logoutCallback = ssoEnabled ? ssoLogoutCallback : ssoLogoutCallbackStub;
  const authenticated = ssoEnabled ? ssoAuthenticated : ssoAuthenticatedStub;

  const loginCallbackType = ssoEnabled ? 'post' : 'get';

  router.get('/sso/login', (req: Request, res: Response) => login(req, res));

  const routePath = '/sso/login-callback';
  const callbackHandler = (req: Request, res: Response, next: NextFunction) => loginCallback(req, res, next);

  if (loginCallbackType === 'post') {
    router.post(routePath, bodyParser.json(), bodyParser.urlencoded({ extended: false }), callbackHandler);
  } else {
    router.get(routePath, callbackHandler);
  }

  router.get('/sso/logout', (req: Request, res: Response, next: NextFunction) => logout(req, res, next));
  router.get('/sso/logout-callback', (req: Request, res: Response, next: NextFunction) =>
    logoutCallback(req, res, next),
  );
  router.get('/sso/authenticated', (req: Request, res: Response) => authenticated(req, res));
};

export default (): Router => {
  const router = express.Router();
  const ssoEnabled: boolean = config.get('features.sso.enabled');

  router.use('/api', proxy());

  setupSSORoutes(router, ssoEnabled);

  return router;
};
