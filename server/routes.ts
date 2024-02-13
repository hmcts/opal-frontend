import { Application } from 'express';
import bodyParser from 'body-parser';
import config from 'config';

import type { NextFunction, Request, Response } from 'express';
import { proxy } from './api';
import { ssoAuthenticated, ssoLoginCallback, ssoLogin, ssoLogout, ssoLogoutCallback } from './sso';
import {
  ssoLoginStub,
  ssoLoginCallbackStub,
  ssoAuthenticatedStub,
  ssoLogoutStub,
  ssoLogoutCallbackStub,
} from './stubs/sso';

import csurf from 'csurf';

export default class Routes {
  public enableFor(app: Application): void {
    const ssoEnabled: boolean = config.get('features.sso.enabled');
    const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'lax', secure: config.get('session.secure') } });

    // Refresh the CSRF token on every request
    app.get('*', csrfProtection, function (req, res, next) {
      // Pass the Csrf Token
      res.cookie('XSRF-TOKEN', req.csrfToken());
      next();
    });

    app.use('/api', csrfProtection, proxy());

    // Declare use of body-parser AFTER the use of proxy https://github.com/villadora/express-http-proxy
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    this.setupSSORoutes(app, ssoEnabled);
  }

  private setupSSORoutes(app: Application, ssoEnabled: boolean) {
    const login = ssoEnabled ? ssoLogin : ssoLoginStub;
    const loginCallback = ssoEnabled ? ssoLoginCallback : ssoLoginCallbackStub;
    const logout = ssoEnabled ? ssoLogout : ssoLogoutStub;
    const logoutCallback = ssoEnabled ? ssoLogoutCallback : ssoLogoutCallbackStub;
    const authenticated = ssoEnabled ? ssoAuthenticated : ssoAuthenticatedStub;

    const loginCallbackType = ssoEnabled ? 'post' : 'get';

    app.get('/sso/login', (req: Request, res: Response, next: NextFunction) => login(req, res, next));

    const routePath = '/sso/login-callback';
    const callbackHandler = (req: Request, res: Response, next: NextFunction) => loginCallback(req, res, next);

    if (loginCallbackType === 'post') {
      app.post(routePath, callbackHandler);
    } else {
      app.get(routePath, callbackHandler);
    }

    app.get('/sso/logout', (req: Request, res: Response, next: NextFunction) => logout(req, res, next));
    app.get('/sso/logout-callback', (req: Request, res: Response, next: NextFunction) =>
      logoutCallback(req, res, next),
    );
    app.get('/sso/authenticated', (req: Request, res: Response) => authenticated(req, res));
  }
}
