import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const isJwtExpired = false;

  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (isJwtExpired) {
    res.status(401).send(false);
  } else {
    res.status(200).send(true);
  }
};
