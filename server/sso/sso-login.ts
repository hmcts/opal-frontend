import { Request, Response } from 'express';

import config from 'config';

const INTERNAL_USER_LOGIN = `${config.get('opal-api.url')}/internal-user/login-or-refresh`;

export default async (req: Request, res: Response) => {
  const env = process.env['NODE_ENV'] || 'development';
  const hostname = env === 'development' ? config.get('frontend-hostname.dev') : config.get('frontend-hostname.prod');
  const url = `${INTERNAL_USER_LOGIN}?redirect_uri=${hostname}/sso/login-callback`;
  res.redirect(url);
};
