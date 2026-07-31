import { FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS } from '../constants/fines-acc-account-status-banner-labels.constant';

/**
 * Gets the account status banner label for a configured fines account status code.
 *
 * @param accountStatusCode - The fines account status code to look up.
 * @returns The configured banner label, or null when no label is configured.
 */
export function getFinesAccAccountStatusBannerLabel(accountStatusCode: string | null | undefined): string | null {
  if (!accountStatusCode) {
    return null;
  }

  return (
    FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS[accountStatusCode as keyof typeof FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS] ??
    null
  );
}
