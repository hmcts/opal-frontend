import { Request, Response } from 'express';
import { Logger } from '@hmcts/nodejs-logging';
//Returns payload of JWT
const parseJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

//If token doesn't exist, or is expired, return as invalid
const isJwtExpired = (token: string | undefined) => {
  try {
    if (token) {
      const payload = parseJwt(token);
      if (payload.exp) {
        //Create date from expiry, argument must be in ms so multiply by 1000
        const jwtExpiry = new Date(payload.exp * 1000);
        //If JWT expiry is after now, then return as valid
        if (jwtExpiry > new Date()) {
          return false;
        }
      }
    }
    return true;
  } catch {
    return true;
  }
};

export default (req: Request, res: Response) => {
  const logger = Logger.getLogger('authenticated-stub');
  const token = req.session.securityToken?.accessToken;

  logger.info(`Entered authenticated-stub file`);
  // Don't allow caching of this endpoint
  res.header('Cache-Control', 'no-store, must-revalidate');

  // If we don't have a token
  if (!token) {
    logger.info(`No session token found`);
    res.status(401).send(false);
    return;
  }

  // Once we have a proper JWT we will check this but for now...
  if (isJwtExpired(token)) {
    logger.error('JWT is expired');
    res.status(401).send(false);
  } else {
    logger.info(`Access Token: ${token.substring(0, 10)}`);
    res.status(200).send(true);
  }
};
