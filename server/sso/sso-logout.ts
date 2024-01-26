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

  logger.info(`Attempting to logout`);
  logger.info('redis enabled', config.get('features.redis.enabled'));
  try {
    let accessToken;

    if (req.session.securityToken) {
      accessToken = req.session.securityToken.accessToken;
    }

    if (!accessToken) {
      return next(new Error('No access token found in session'));
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response) {
      res.redirect('/sso/logout-callback');
    }
  } catch (error) {
    logger.error('Error logging out', error);
    return next(error);
  }
};
