import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';

const INTERNAL_USER_LOGOUT = `${config.get('opal-api.url')}/internal-user/logout`;

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login');

  const env = process.env['NODE_ENV'] || 'development';
  const hostname = env === 'development' ? config.get('frontend-hostname.dev') : config.get('frontend-hostname.prod');
  const url = `${INTERNAL_USER_LOGOUT}?redirect_uri=${hostname}/sso/login-callback`;

  logger.info(`Entered logout file`);
  logger.info(`Environment: ${env}`);
  logger.info(`Hostname: ${hostname}`);
  logger.info(`Redirect url: ${url}`);

  try {
    let accessToken;

    if (req.session.securityToken) {
      accessToken = req.session.securityToken.accessToken;
      logger.info(`Access token: ${accessToken}`);
    }

    if (!accessToken) {
      logger.error('No access token found in session');
      next(new Error('No access token found in session'));
    }

    logger.info(`Trying to make a request to ${url}`);
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response) {
      logger.info(`Response received, redirecting to /sso/logout-callback`);
      res.redirect('/sso/logout-callback');
    }
  } catch (error) {
    logger.error('Error logging out', error);
    next(new Error('Error logging out'));
  }
};
