import { IFinesMacState } from '../interfaces';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE } from './fines-mac-account-comments-notes-state';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from './fines-mac-account-details-state';
import { FINES_MAC_BUSINESS_UNIT_STATE } from './fines-mac-business-unit-state';
import { FINES_MAC_COMPANY_DETAILS_STATE } from './fines-mac-company-details-state';
import { FINES_MAC_CONTACT_DETAILS_STATE } from './fines-mac-contact-details-state';
import { FINES_MAC_COURT_DETAILS_STATE } from './fines-mac-court-details-state';
import { FINES_MAC_EMPLOYER_DETAILS_STATE } from './fines-mac-employer-details-state';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from './fines-mac-offence-details-state';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE } from './fines-mac-parent-guardian-details-state';
import { FINES_MAC_PAYMENT_TERMS_STATE } from './fines-mac-payment-terms-state';
import { FINES_MAC_PERSONAL_DETAILS_STATE } from './fines-mac-personal-details-state';

export const FINES_MAC_STATE: IFinesMacState = {
  accountDetails: FINES_MAC_ACCOUNT_DETAILS_STATE,
  employerDetails: FINES_MAC_EMPLOYER_DETAILS_STATE,
  contactDetails: FINES_MAC_CONTACT_DETAILS_STATE,
  parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE,
  personalDetails: FINES_MAC_PERSONAL_DETAILS_STATE,
  companyDetails: FINES_MAC_COMPANY_DETAILS_STATE,
  courtDetails: FINES_MAC_COURT_DETAILS_STATE,
  accountCommentsNotes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE,
  offenceDetails: FINES_MAC_OFFENCE_DETAILS_STATE,
  paymentTerms: FINES_MAC_PAYMENT_TERMS_STATE,
  businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
};
