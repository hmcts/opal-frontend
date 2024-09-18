import { Request, Response } from 'express';
import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  const isJwtExpired = Jwt.isJwtExpired(req.session.securityToken?.access_token);
  const userId = req.session.securityToken?.user_state?.user_id;
  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (isJwtExpired || !userId) {
    res.status(401).send(false);
  } else {
    res.status(200).send(true);
  }
};
