import { NextFunction, Request, Response } from 'express';

import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

const INTERNAL_JWT = `${config.get('opal-api.url')}/api/testing-support/handle-oauth-code`;

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login-callback-stub');

  logger.info(`Entered login-callback-stub file`);

  try {
    logger.info(`Trying to make a request to ${INTERNAL_JWT}`);
    const result = await axios.post(INTERNAL_JWT);
    const mockSecurityToken = result.data;

    req.session.securityToken = mockSecurityToken;

    logger.info(`Access Token received`);
    logger.info(`Access Token: ${mockSecurityToken.accessToken.substring(0, 10)}...`);

    req.session.save((err) => {
      if (err) {
        logger.error('Error saving session', err);
        return next(err);
      }

      logger.info(`Token saved in session`);
      res.redirect('/');
    });
  } catch (error) {
    logger.error('Error on login-stub callback', error);
    return next(error);
  }
};
