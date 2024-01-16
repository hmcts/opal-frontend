import { NextFunction, Request, Response } from 'express';

import { Logger } from '@hmcts/nodejs-logging';

export default (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login-callback-stub');
  const mockSecurityToken = {
    accessToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEYXZpZE1hbm4iLCJpYXQiOjE2OTI4NzQ5MzAsImV4cCI6MjAzOTk0MzczMCwiYXVkIjoiZGFydHMtbG9jYWwtZGV2Iiwic3ViIjoiZGFydHMtbG9jYWwtand0In0.6wJo9geKWacjA-FR67waVRsNuS6uP5X-JJRlTOpwGhI',
  };

  req.session.securityToken = mockSecurityToken;

  req.session.save((err) => {
    if (err) {
      return next(err);
    }

    logger.info(`token saved`);

    res.redirect('/');
  });
};
