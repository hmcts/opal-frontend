import { Request, Response, NextFunction } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('login-stub');

export default async (req: Request, res: Response, next: NextFunction) => {
  const email = req.query['email'] as string;

  if (email !== 'null') {
    res.redirect(`/sso/login-callback?email=${email}`);
  } else {
    const error = new Error('No email provided.');
    logger.error('Error on login-stub', error);
    return next(error);
  }
};
