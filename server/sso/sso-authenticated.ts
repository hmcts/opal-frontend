import { Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

export default (req: Request, res: Response) => {
  const logger = Logger.getLogger('authenticated');
  const token = req.session.securityToken?.accessToken;

  logger.info(`Get session token ${req.session.securityToken?.accessToken}`);

  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  // If we don't have a token
  if (!token) {
    res.status(401).send(false);
    return;
  }

  if (!token) {
    res.status(401).send(false);
  } else {
    res.status(200).send(true);
  }
};
