import { Request, Response } from 'express';

import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  if (req.session.securityToken?.accessToken) {
    const payload = Jwt.parseJwt(req.session.securityToken?.accessToken);

    //Create date from expiry, argument must be in ms so multiply by 1000
    const jwtExpiry = new Date(payload.exp * 1000);
    res.status(200).send({
      tokenExpiry: jwtExpiry,
    });
  } else {
    res.send({
      tokenExpiry: null,
    });
  }
};
