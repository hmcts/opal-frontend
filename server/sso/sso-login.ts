import { Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';

const INTERNAL_USER_LOGIN = `${config.get('opal-api.url')}/internal-user/login-or-refresh`;

export default async (req: Request, res: Response) => {
  const logger = Logger.getLogger('login');
  const env = process.env['NODE_ENV'] || 'development';
  const hostname = env === 'development' ? config.get('frontend-hostname.dev') : config.get('frontend-hostname.prod');
  const url = `${INTERNAL_USER_LOGIN}?redirect_uri=${hostname}/sso/login-callback`;

  logger.info(`Entered login-callback file...`);
  logger.info(`Environment: ${env}`);
  logger.info(`Hostname: ${hostname}`);
  logger.info(`Redirect url: ${url}`);

  logger.info(`Redirecting to ${url}`);
  res.redirect(url);
};
