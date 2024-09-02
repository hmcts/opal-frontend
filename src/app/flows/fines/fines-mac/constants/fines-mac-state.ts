import { IFinesMacState } from '../interfaces';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from '../fines-mac-account-comments-notes/constants';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../fines-mac-account-details/constants';
import { FINES_MAC_COMPANY_DETAILS_FORM } from '../fines-mac-company-details/constants';
import { FINES_MAC_CONTACT_DETAILS_FORM } from '../fines-mac-contact-details/constants';
import { FINES_MAC_COURT_DETAILS_FORM } from '../fines-mac-court-details/constants';
import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../fines-mac-employer-details/constants';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../fines-mac-offence-details/constants';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM } from '../fines-mac-parent-guardian-details/constants';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../fines-mac-payment-terms/constants';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../fines-mac-personal-details/constants';
import { FINES_MAC_BUSINESS_UNIT_STATE } from './fines-mac-business-unit-state';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE } from '../fines-mac-language-preferences/constants';

export const FINES_MAC_STATE: IFinesMacState = {
  accountDetails: FINES_MAC_ACCOUNT_DETAILS_FORM,
  employerDetails: FINES_MAC_EMPLOYER_DETAILS_FORM,
  contactDetails: FINES_MAC_CONTACT_DETAILS_FORM,
  parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM,
  personalDetails: FINES_MAC_PERSONAL_DETAILS_FORM,
  companyDetails: FINES_MAC_COMPANY_DETAILS_FORM,
  courtDetails: FINES_MAC_COURT_DETAILS_FORM,
  accountCommentsNotes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM,
  offenceDetails: FINES_MAC_OFFENCE_DETAILS_FORM,
  paymentTerms: FINES_MAC_PAYMENT_TERMS_FORM,
  businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
};
