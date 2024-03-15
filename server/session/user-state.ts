import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const userState = req.session?.securityToken?.userState;
  // If we have state return it...
  // We only have state after a successful login
  if (userState) {
    return res.send(userState);
  }

  return res.send(null);
};
