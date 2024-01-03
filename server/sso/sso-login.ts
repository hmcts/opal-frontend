import { Request, Response } from 'express';

import config from 'config';

const INTERNAL_USER_LOGIN = `${config.get('opal-api.url')}/internal-user/login-or-refresh`;

export default async (req: Request, res: Response) => {
  res.redirect(INTERNAL_USER_LOGIN);
};
