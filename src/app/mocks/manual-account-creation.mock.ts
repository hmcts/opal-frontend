import { MANUAL_ACCOUNT_CREATION_ACCOUNT_COMMENTS_NOTES_STATE_MOCK } from '@mocks';
import { MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE } from '../constants/manual-account-creation-account-details-state';
import { MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE } from '../constants/manual-account-creation-business-unit-state';
import { MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE } from '../constants/manual-account-creation-company-details-state';
import { MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE } from '../constants/manual-account-creation-contact-details-state';
import { MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE } from '../constants/manual-account-creation-court-details-state';
import { MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE } from '../constants/manual-account-creation-employer-details-state';
import { MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE } from '../constants/manual-account-creation-parent-guardian-details-state';
import { MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE } from '../constants/manual-account-creation-personal-details-state';

export const MANUAL_ACCOUNT_CREATION_MOCK = {
  accountDetails: { ...MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_STATE, defendantType: 'adultOrYouthOnly' },
  employerDetails: MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_STATE,
  contactDetails: MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE,
  parentGuardianDetails: MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE,
  personalDetails: MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_STATE,
  companyDetails: MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_STATE,
  courtDetails: MANUAL_ACCOUNT_CREATION_COURT_DETAILS_STATE,
  accountCommentsNotes: MANUAL_ACCOUNT_CREATION_ACCOUNT_COMMENTS_NOTES_STATE_MOCK,
  businessUnit: MANUAL_ACCOUNT_CREATION_BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
};
