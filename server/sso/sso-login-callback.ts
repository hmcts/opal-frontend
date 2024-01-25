import { NextFunction, Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';
import { log } from 'console';

const INTERNAL_USER_CALLBACK = `${config.get('opal-api.url')}/internal-user/handle-oauth-code`;
const logger = Logger.getLogger('login-callback');

export default async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Login callback received');
  try {
    logger.info('Calling internal user callback', INTERNAL_USER_CALLBACK);
    const result = await axios.post<any>(INTERNAL_USER_CALLBACK, req.body, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    logger.info('Received security token', result.data);

    const securityToken = result.data;
    req.session.securityToken = securityToken;

    logger.info('Saving session');
    req.session.save((err) => {
      if (err) {
        logger.error('Error saving session', err);
        return next(err);
      }
      logger.info('Session saved');
      res.redirect('/');
    });
  } catch (error) {
    logger.error('Error on login-callback', error);
    next(error);
  }
};
