import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const token = req.session.securityToken?.accessToken;
  const userState = req.session.securityToken?.userState;
  const userProfile = {
    userId: userState?.userId,
    userName: userState?.userName,
  };

  if (token && userState) {
    res.send(userProfile);
  } else {
    res.send({});
  }
};
