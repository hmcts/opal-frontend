import { Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';

export default (req: Request, res: Response) => {
  const logger = Logger.getLogger('authenticated');
  const token = req.session.securityToken?.accessToken;

  logger.info(`Entered authenticated file`);

  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (!token) {
    logger.info(`No session token found`);
    res.status(401).send(false);
  } else {
    logger.info(`Access Token: ${req.session.securityToken?.accessToken}`);
    res.status(200).send(true);
  }
};
