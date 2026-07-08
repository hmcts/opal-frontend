import type { IHttpRetryPolicy } from '@hmcts/opal-frontend-common/interceptors/http-retry/interfaces';
import { HTTP_RETRYABLE_STATUS_CODES } from '@hmcts/opal-frontend-common/interceptors/http-retry/constants';

export const HTTP_RETRY_DISABLED_POLICY: IHttpRetryPolicy = Object.freeze({
  retryCount: 0,
  delayMs: 0,
  backoffMultiplier: 1,
  maxDelayMs: 0,
  retryableStatusCodes: HTTP_RETRYABLE_STATUS_CODES,
});
