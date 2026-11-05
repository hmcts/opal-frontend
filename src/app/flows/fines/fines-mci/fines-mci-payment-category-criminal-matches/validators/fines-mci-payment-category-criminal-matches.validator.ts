import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERRORS } from '../constants/fines-mci-payment-category-criminal-matches-errors.constant';
import { FinesMciCriminalAccountId } from '../../interfaces/fines-mci-criminal-account.interface';

export const finesMciPaymentCategoryCriminalMatchesSelectionValidator = (
  selectedAccountIds: readonly FinesMciCriminalAccountId[],
): string | null => {
  if (selectedAccountIds.length === 0) {
    return FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERRORS.noAccountSelected;
  }

  if (selectedAccountIds.length > 1) {
    return FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERRORS.tooManyAccountsSelected;
  }

  return null;
};
