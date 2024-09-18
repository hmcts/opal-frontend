import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import config from 'config';
import { Jwt } from '../utils';

export default (req: Request, res: Response) => {
  const accessToken = req.session.securityToken?.access_token;
  if (accessToken) {
    const testMode = config.get<boolean>('expiry.testMode');
    const expiryConfigPath = testMode ? 'expiry.test' : 'expiry.default';

    const expiryTimeInMilliseconds = config.get<number>(`${expiryConfigPath}.expiryTimeInMilliseconds`);
    const warningThresholdInMilliseconds = config.get<number>(`${expiryConfigPath}.warningThresholdInMilliseconds`);

    const payload = Jwt.parseJwt(accessToken);
    const jwtExpiry = testMode
      ? DateTime.now().plus({ milliseconds: expiryTimeInMilliseconds }).toISO()
      : DateTime.fromMillis(payload.exp * 1000).toISO();

    res.status(200).send({
      expiry: jwtExpiry,
      warningThresholdInMilliseconds: warningThresholdInMilliseconds,
    });
  } else {
    res.status(200).send({
      expiry: null,
      warningThresholdInMilliseconds: null,
    });
  }
};
