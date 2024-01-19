import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.redirect('/sso/login-callback');
};
