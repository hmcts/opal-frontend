import { FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS } from '../constants/fines-acc-account-status-banner-labels.constant';

export function getFinesAccAccountStatusBannerLabel(accountStatusCode: string | null | undefined): string | null {
  if (!accountStatusCode) {
    return null;
  }

  return (
    FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS[accountStatusCode as keyof typeof FINES_ACC_ACCOUNT_STATUS_BANNER_LABELS] ??
    null
  );
}
