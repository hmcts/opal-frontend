import { ISessionTokenExpiry } from '@services/session-service/interfaces/session-token-expiry.interface';

export const SESSION_TOKEN_EXPIRY_MOCK: ISessionTokenExpiry = {
  expiry: 'test',
  warningThresholdInMilliseconds: 5,
};
