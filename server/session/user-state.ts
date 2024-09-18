import { Request, Response } from 'express';
import { UserState } from '../interfaces';

export default (req: Request, res: Response) => {
  const userState: UserState | undefined = req.session.securityToken?.user_state;

  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (!userState) {
    res.send({});
  } else {
    res.send(userState);
  }
};
