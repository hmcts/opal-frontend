import { Request, Response } from 'express';
import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  const isJwtExpired = Jwt.isJwtExpired(req.session.securityToken?.accessToken);
  const userId = req.session.securityToken?.userState?.userId;
  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (isJwtExpired || !userId) {
    res.status(401).send(false);
  } else {
    res.status(200).send(true);
  }
};
