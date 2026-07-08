import type { IHttpRetryPolicy } from '@hmcts/opal-frontend-common/interceptors/http-retry/interfaces';
import { HTTP_RETRYABLE_STATUS_CODES } from '@hmcts/opal-frontend-common/interceptors/http-retry/constants';

export const DEFAULT_HTTP_RETRY_POLICY: IHttpRetryPolicy = Object.freeze({
  retryCount: 3,
  delayMs: 250,
  backoffMultiplier: 2,
  maxDelayMs: 2000,
  retryableStatusCodes: HTTP_RETRYABLE_STATUS_CODES,
});
