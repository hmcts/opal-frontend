import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Jwt } from '../utils';
import config from 'config';

export default (req: Request, res: Response) => {
  if (req.session.securityToken?.accessToken) {
    const testMode = config.get('expiry.testMode');
    const expiryTimeInMin: number = testMode
      ? config.get('expiry.test.expiryTimeInMin')
      : config.get('expiry.default.expiryTimeInMin');
    const expiryWarningThresholdInMin: number = testMode
      ? config.get('expiry.test.warningThresholdInMin')
      : config.get('expiry.default.warningThresholdInMin');

    const payload = Jwt.parseJwt(req.session.securityToken?.accessToken);

    //Create date from expiry, argument must be in ms so multiply by 1000
    const jwtExpiry = testMode
      ? DateTime.now().plus({ minutes: expiryTimeInMin }).toISO()
      : new Date(payload.exp * 1000);

    res.status(200).send({
      expiry: jwtExpiry,
      expiryWarningThresholdInMin,
    });
  } else {
    res.status(200).send({
      expiry: null,
      expiryWarningThresholdInMin: null,
    });
  }
};
