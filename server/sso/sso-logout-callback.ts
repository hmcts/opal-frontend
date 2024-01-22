import { NextFunction, Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

export default (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login');
  logger.info(`Entered logout callback file`);

  req.session.destroy((err) => {
    if (err) {
      logger.error('Error destroying session', err);
      return next(err);
    }

    logger.info(`Session destroyed, redirecting to /`);
    res.redirect('/');
  });
};
