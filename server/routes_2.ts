import { Application } from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';
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

export default class Routes {
  public enableFor(app: Application): void {
    const logger = Logger.getLogger('routes');
    // const router = express.Router();
    const ssoEnabled: boolean = config.get('features.sso.enabled');

    logger.info(`Entered routing file 2`);
    logger.info(`SSO enabled: ${ssoEnabled}`);

    app.use('/api', proxy());

    // Declare use of body-parser AFTER the use of proxy https://github.com/villadora/express-http-proxy
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    this.setupSSORoutes(app, ssoEnabled);
  }

  private setupSSORoutes(app: Application, ssoEnabled: boolean) {
    const logger = Logger.getLogger('routes/setupSSORoutes ');
    const login = ssoEnabled ? ssoLogin : ssoLoginStub;
    const loginCallback = ssoEnabled ? ssoLoginCallback : ssoLoginCallbackStub;
    const logout = ssoEnabled ? ssoLogout : ssoLogoutStub;
    const logoutCallback = ssoEnabled ? ssoLogoutCallback : ssoLogoutCallbackStub;
    const authenticated = ssoEnabled ? ssoAuthenticated : ssoAuthenticatedStub;

    logger.info(`Setting up SSO routes`);

    const loginCallbackType = ssoEnabled ? 'post' : 'get';

    logger.info(`Login callback type: ${loginCallbackType}`);

    app.get('/sso/login', (req: Request, res: Response, next: NextFunction) => login(req, res, next));

    const routePath = '/sso/login-callback';
    const callbackHandler = (req: Request, res: Response, next: NextFunction) => loginCallback(req, res, next);

    if (loginCallbackType === 'post') {
      app.post(routePath, ssoLoginCallback());
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
