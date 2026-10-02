import { describe, expect, it } from 'vitest';
import { FINES_ACC_ACCOUNT_STATUS_BANNERS } from '../constants/fines-acc-account-status-banners.constant';
import { getFinesAccAccountStatusBannerContent } from './fines-acc-account-status-banner.utils';

describe('getFinesAccAccountStatusBannerContent', () => {
  it.each(Object.entries(FINES_ACC_ACCOUNT_STATUS_BANNERS))(
    'should return the banner label for account status %s',
    (accountStatusCode, bannerContent) => {
      expect(getFinesAccAccountStatusBannerContent(accountStatusCode)).toBe(bannerContent);
    },
  );

  it('should return null for an account status without a configured banner', () => {
    expect(getFinesAccAccountStatusBannerContent('L')).toBeNull();
  });

  it('should return null when no account status is provided', () => {
    expect(getFinesAccAccountStatusBannerContent(null)).toBeNull();
  });
});
