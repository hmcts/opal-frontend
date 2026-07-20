import { describe, expect, it } from 'vitest';
import { FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS } from '../constants/fines-acc-account-status-banner-labels.constant';
import { getFinesAccAccountStatusBannerLabel } from './fines-acc-account-status-banner.utils';

describe('getFinesAccAccountStatusBannerLabel', () => {
  it.each(Object.entries(FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS))(
    'should return the banner label for account status %s',
    (accountStatusCode, bannerLabel) => {
      expect(getFinesAccAccountStatusBannerLabel(accountStatusCode)).toBe(bannerLabel);
    },
  );

  it('should return null for an account status without a configured banner', () => {
    expect(getFinesAccAccountStatusBannerLabel('L')).toBeNull();
  });

  it('should return null when no account status is provided', () => {
    expect(getFinesAccAccountStatusBannerLabel(null)).toBeNull();
  });
});
