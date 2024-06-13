import { MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE } from './manual-account-creation-account-details-state';
import { MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE } from './manual-account-creation-employer-detail-state';

export const MANUAL_ACCOUNT_CREATION_STATE = {
  accountDetails: MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE,
  employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  unsavedChanges: false,
  stateChanges: false,
};
