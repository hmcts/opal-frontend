import { Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('authenticated');

export default (req: Request, res: Response) => {
  const token = req.session.securityToken?.accessToken;

  logger.info(`Checking if user is authenticated. Token: ${token}`);

  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (!token) {
    res.status(401).send(false);
  } else {
    res.status(200).send(true);
  }
};
