import { Request, Response } from 'express';

import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  if (req.session.securityToken?.accessToken) {
    const payload = Jwt.parseJwt(req.session.securityToken?.accessToken);

    //   if (payload.exp) {
    //Create date from expiry, argument must be in ms so multiply by 1000
    const jwtExpiry = new Date(payload.exp * 1000);
    res.status(200).send(jwtExpiry);
  }
  //   }

  // // Don't allow caching of this endpoint
  // res.header('Cache-Control', 'no-store, must-revalidate');

  // if (isJwtExpired || !userId) {
  //   res.status(401).send(false);
  // } else {
  //   res.status(200).send(true);
  // }
};
