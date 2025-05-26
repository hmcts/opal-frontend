import { IFinesMacReviewAccountDecisionFieldErrors } from '../interfaces/fines-mac-review-account-decision-field-errors.interface';

export const FINES_MAC_REVIEW_ACCOUNT_DECISION_FIELD_ERRORS: IFinesMacReviewAccountDecisionFieldErrors = {
  fm_review_account_decision: {
    required: {
      message: 'Select whether approved or rejected',
      priority: 1,
    },
  },
  fm_review_account_rejection_reason: {
    required: {
      message: 'Enter reason for rejection',
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: 'Reason for rejection must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'Reason for rejection must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
};
