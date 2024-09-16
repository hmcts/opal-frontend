import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import config from 'config';
import { Logger } from '@hmcts/nodejs-logging';

const INTERNAL_USER_LOGOUT = `${config.get('opal-api.url')}/internal-user/logout`;
const logger = Logger.getLogger('login');

export default async (req: Request, res: Response, next: NextFunction) => {
  const env = process.env['NODE_ENV'] || 'development';
  const hostname = env === 'development' ? config.get('frontend-hostname.dev') : config.get('frontend-hostname.prod');
  const url = `${INTERNAL_USER_LOGOUT}?redirect_uri=${hostname}/sso/logout-callback`;

  try {
    let accessToken;

    if (req.session.securityToken) {
      accessToken = req.session.securityToken.access_token;
    }

    if (!accessToken) {
      return next(new Error('No access token found in session'));
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const logoutRedirect = response.request.res.responseUrl;
    if (logoutRedirect) {
      res.redirect(logoutRedirect);
    } else {
      next(new Error('Error trying to fetch logout page'));
    }
  } catch (error) {
    logger.error('Error logging out', error);
    return next(error);
  }
};
