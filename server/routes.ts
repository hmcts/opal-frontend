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

function setupRoutes(router: Router, ssoEnabled: boolean) {
  const login = ssoEnabled ? ssoLogin : ssoLoginStub;
  const loginCallback = ssoEnabled ? ssoLoginCallback : ssoLoginCallbackStub;
  const logout = ssoEnabled ? ssoLogout : ssoLogoutStub;
  const logoutCallback = ssoEnabled ? ssoLogoutCallback : ssoLogoutCallbackStub;
  const authenticated = ssoEnabled ? ssoAuthenticated : ssoAuthenticatedStub;

  const loginCallbackType = ssoEnabled ? 'post' : 'get';

  router.get('/sso/login', (req: Request, res: Response) => login(req, res));
  router[loginCallbackType]('/sso/login-callback', (req: Request, res: Response, next: NextFunction) =>
    loginCallback(req, res, next),
  );
  router.get('/sso/logout', (req: Request, res: Response, next: NextFunction) => logout(req, res, next));
  router.get('/sso/logout-callback', (req: Request, res: Response, next: NextFunction) =>
    logoutCallback(req, res, next),
  );
  router.get('/sso/authenticated', (req: Request, res: Response) => authenticated(req, res));
}

export default (): Router => {
  const router = express.Router();
  const ssoEnabled: boolean = config.get('features.sso.enabled');

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));

  router.use('/api', proxy());

  setupRoutes(router, ssoEnabled);

  return router;
};
