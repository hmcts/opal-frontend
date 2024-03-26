import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { username } = req.query;
  res.redirect(`/sso/login-callback?username=${username}`);
};
