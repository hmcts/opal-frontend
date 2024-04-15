import { Request, Response } from 'express';
import { UserState } from '../interfaces';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('session-user-state');

export default (req: Request, res: Response) => {
  const userState: UserState | undefined = req.session.securityToken?.userState;
  logger.info('User state requested', req.session.securityToken);
  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  if (!userState) {
    res.send({});
  } else {
    res.send(userState);
  }
};
