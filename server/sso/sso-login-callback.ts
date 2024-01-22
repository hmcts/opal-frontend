import { NextFunction, Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

const INTERNAL_USER_CALLBACK = `${config.get('opal-api.url')}/internal-user/handle-oauth-code`;

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login-callback');

  logger.info(`Entered login-callback file`);
  try {
    logger.info(`Trying to make a request to ${INTERNAL_USER_CALLBACK}`);

    const result = await axios.post<any>(INTERNAL_USER_CALLBACK, req.body, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    const securityToken = result.data;

    logger.info(`Access Token received`);
    logger.info(`Access Token: ${securityToken.accessToken.substring(0, 10)}...`);

    req.session.securityToken = securityToken;

    req.session.save((err) => {
      if (err) {
        logger.error('Error saving session', err);
        return next(err);
      }

      logger.info(`Token saved in session`);
      res.redirect('/');
    });
  } catch (error) {
    logger.error('Error on login-callback', error);
    next(error);
  }
};
