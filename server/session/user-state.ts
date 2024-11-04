import { Request, Response } from 'express';
import { UserState } from '../interfaces';
import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  const userState: UserState | undefined = req.session.securityToken?.user_state;
  const accessToken = req.session.securityToken?.access_token;
  const name = accessToken && userState ? Jwt.parseJwt(accessToken).name : '';

  // Don't allow caching of this endpoint
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  });

  if (!userState) {
    res.send({});
  } else {
    res.send({ ...userState, name });
  }
};
