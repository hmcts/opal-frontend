import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const token = req.session.securityToken?.accessToken;
  const userState = req.session.securityToken?.userState;

  res.header('Cache-Control', 'no-store, must-revalidate');

  if (token && userState) {
    res.send(userState);
  } else {
    res.send({});
  }
};
