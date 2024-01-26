import { NextFunction, Request, Response } from 'express';

import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

const INTERNAL_JWT = `${config.get('opal-api.url')}/api/testing-support/handle-oauth-code`;

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login-callback-stub');

  try {
    const result = await axios.post(INTERNAL_JWT);
    const mockSecurityToken = result.data;

    req.session.securityToken = mockSecurityToken;

    req.session.save((err) => {
      if (err) {
        logger.error('Error saving session', err);
        return next(err);
      }
      logger.info('Session saved');
      res.redirect('/');
    });
  } catch (error) {
    logger.error('Error on login-stub callback', error);
    return next(error);
  }
};
