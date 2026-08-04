import { FINES_ACC_ACCOUNT_STATUS_BANNERS } from '../constants/fines-acc-account-status-banners.constant';
import { type FinesAccountStatusBanner } from '../interfaces/fines-account-status-banner.interface';

/**
 * Gets the account status banner label for a configured fines account status code.
 *
 * @param accountStatusCode - The fines account status code to look up.
 * @returns The configured banner label, or null when no label is configured.
 */
export function getFinesAccAccountStatusBannerContent(
  accountStatusCode: string | null | undefined,
): FinesAccountStatusBanner | null {
  if (!accountStatusCode) {
    return null;
  }

  return FINES_ACC_ACCOUNT_STATUS_BANNERS[accountStatusCode as keyof typeof FINES_ACC_ACCOUNT_STATUS_BANNERS] ?? null;
}
