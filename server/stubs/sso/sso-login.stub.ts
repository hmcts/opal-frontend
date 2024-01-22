import { Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

export default async (req: Request, res: Response) => {
  const logger = Logger.getLogger('login-stub');
  logger.info(`Entered login-stub file`);
  logger.info(`Redirecting to /sso/login-callback`);
  res.redirect('/sso/login-callback');
};
