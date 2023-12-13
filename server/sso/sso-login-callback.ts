import { NextFunction, Request, Response } from 'express';

import { Logger } from '@hmcts/nodejs-logging';
export default (req: Request, res: Response, next: NextFunction) => {
  const logger = Logger.getLogger('login-callback');
  const mockSecurityToken = {
    accessToken:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2htY3Rzc3RnZXh0aWQuYjJjbG9naW4uY29tLzhiMTg1ZjhiLTY2NWQtNGJiMy1hZjRhLWFiN2VlNjFiOTMzNC92Mi4wLyIsInN1YiI6IjMxZDQ4NGQ5LTBhNTgtNDNmNC1iZDFkLWE4MDVhNWE4MGFlNCIsImF1ZCI6IjM2M2MxMWNiLTQ4YjktNDRiZi05ZDA2LTlhMzk3M2Y2ZjQxMyIsImV4cCI6MTcwMDY2MTcwNiwiaWF0IjoxNzAwNjUwOTA2LCJhdXRoX3RpbWUiOjE3MDA2NTA5MDUsIm5hbWUiOiJ1bmtub3duIiwiZ2l2ZW5fbmFtZSI6IkRlYW4iLCJlbWFpbHMiOlsiZGVhbi5idWxsb2NrQGhtY3RzLm5ldCJdLCJ0ZnAiOiJCMkNfMV9kYXJ0c19leHRlcm5hbHVzZXJfc2lnbmluIiwibmJmIjoxNzAwNjUwOTA2fQ.ggWcv7vUgoDggDgkCtsRnSYETc4wy4DBRTJNk16RRyDOaqWQw20XhExwrFFBTdrkswbwB8YLzxdRvJxusn9xYg8HneKeRQqVsupcowix9aSjmWwcCwaZnqWV1KwxUpYEQGJuGqDNOeMAdNwugTHMyhvPesRVSZu4mP65sRN7QRIUkxG4T3-5Qk726yov2nSCuLOF7cUSBZewyXmW7DKzK92_fNW_ObInzG0u4qSTepPUfyWzRgwc-ePbxrk5bybE6j9eJc3WBctUPz2-dXpNs_fCHvHLi4wK80NMbZxfKvQT291Zg5DGmvlPCvnkRMSPenfxqavaYPfzJCjKxrO1nA',
  };

  // req.session.userType = type;
  req.session.securityToken = mockSecurityToken;

  logger.info(`Set session token ${req.session.securityToken?.accessToken}`);

  req.session.save((err) => {
    if (err) {
      return next(err);
    }

    logger.info(`token saved`);

    setTimeout(() => {
      res.redirect('/');
    }, 500);
  });
};
