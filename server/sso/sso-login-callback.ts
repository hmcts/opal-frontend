import { NextFunction, Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';
import config from 'config';

const INTERNAL_USER_CALLBACK = `${config.get('opal-api.url')}/internal-user/handle-oauth-code`;

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login-callback');
  try {
    const result = await axios.post<any>(INTERNAL_USER_CALLBACK, req.body, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });

    const securityToken = result.data;

    req.session.securityToken = securityToken;

    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  } catch (error) {
    logger.error('Error on authentication callback', error);
    next(error);
  }
};
