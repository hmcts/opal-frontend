import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import config from 'config';
import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  const accessToken = req.session.securityToken?.accessToken;
  if (accessToken) {
    const testMode = config.get<boolean>('expiry.testMode');
    const expiryConfigPath = testMode ? 'expiry.test' : 'expiry.default';

    const expiryTimeInMin = config.get<number>(`${expiryConfigPath}.expiryTimeInMin`);
    const warningThresholdInMin = config.get<number>(`${expiryConfigPath}.warningThresholdInMin`);

    const payload = Jwt.parseJwt(accessToken);
    const jwtExpiry = testMode
      ? DateTime.now().plus({ minutes: expiryTimeInMin }).toISO()
      : DateTime.fromMillis(payload.exp * 1000).toISO();

    res.status(200).send({
      expiry: jwtExpiry,
      expiryWarningThresholdInMin: warningThresholdInMin,
    });
  } else {
    res.status(200).send({
      expiry: null,
      expiryWarningThresholdInMin: null,
    });
  }
};
