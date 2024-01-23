import { NextFunction, Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

export default (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login');

  req.session.destroy((err) => {
    if (err) {
      logger.error('Error destroying session', err);
      return next(err);
    }

    res.redirect('/');
  });
};
