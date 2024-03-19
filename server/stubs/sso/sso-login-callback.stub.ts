import {NextFunction, Request, Response} from 'express';

import {Logger} from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

const INTERNAL_JWT = `${config.get('opal-api.url')}/api/testing-support/token/test-user`;
const logger = Logger.getLogger('login-callback-stub');

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await axios.get(INTERNAL_JWT);

    req.session.securityToken = result.data;

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
