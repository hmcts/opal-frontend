import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const token = req.session.securityToken?.accessToken;
  const userState = req.session.securityToken?.userState;

  if (token && userState) {
    return res.send(userState);
  }

  return res.send(null);
};
