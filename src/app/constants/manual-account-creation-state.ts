import { MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE } from './manual-account-creation-employer-detail-state';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE } from './manual-account-creation-personal-details-state';

export const MANUAL_ACCOUNT_CREATION_STATE = {
  employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
  unsavedChanges: false,
  stateChanges: false,
};
