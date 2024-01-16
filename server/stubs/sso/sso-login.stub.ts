import { Response } from 'express';

export default async (res: Response) => {
  res.redirect('/sso/login-callback');
};
