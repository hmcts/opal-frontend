import { describe, expect, it } from 'vitest';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERRORS } from '../constants/fines-mci-payment-category-criminal-matches-errors.constant';
import { finesMciPaymentCategoryCriminalMatchesSelectionValidator } from './fines-mci-payment-category-criminal-matches.validator';

describe('finesMciPaymentCategoryCriminalMatchesSelectionValidator', () => {
  it('should return the no account selected error when no accounts are selected', () => {
    expect(finesMciPaymentCategoryCriminalMatchesSelectionValidator([])).toBe(
      FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERRORS.noAccountSelected,
    );
  });

  it('should return the too many accounts selected error when more than one account is selected', () => {
    expect(finesMciPaymentCategoryCriminalMatchesSelectionValidator([1, 2])).toBe(
      FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_MATCHES_ERRORS.tooManyAccountsSelected,
    );
  });

  it('should return null when one account is selected', () => {
    expect(finesMciPaymentCategoryCriminalMatchesSelectionValidator([1])).toBeNull();
  });
});
