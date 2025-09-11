import { IFinesMacReviewAccountDecisionFieldErrors } from '../interfaces/fines-mac-review-account-decision-field-errors.interface';

export const FINES_MAC_REVIEW_ACCOUNT_DECISION_FIELD_ERRORS: IFinesMacReviewAccountDecisionFieldErrors = {
  fm_review_account_decision: {
    required: {
      message: 'Select whether approved or rejected',
      priority: 1,
    },
  },
  fm_review_account_decision_reason: {
    required: {
      message: 'Enter reason for rejection',
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message:
        'Reason for rejection must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      priority: 2,
    },
  },
};
