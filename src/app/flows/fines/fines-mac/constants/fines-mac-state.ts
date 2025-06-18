import { IFinesMacState } from '../interfaces/fines-mac-state.interface';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from '../fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-form';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_MAC_COMPANY_DETAILS_FORM } from '../fines-mac-company-details/constants/fines-mac-company-details-form';
import { FINES_MAC_CONTACT_DETAILS_FORM } from '../fines-mac-contact-details/constants/fines-mac-contact-details-form';
import { FINES_MAC_COURT_DETAILS_FORM } from '../fines-mac-court-details/constants/fines-mac-court-details-form';
import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../fines-mac-employer-details/constants/fines-mac-employer-details-form';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM } from '../fines-mac-parent-guardian-details/constants/fines-mac-parent-guardian-details-form';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../fines-mac-payment-terms/constants/fines-mac-payment-terms-form';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { FINES_MAC_BUSINESS_UNIT_STATE } from './fines-mac-business-unit-state';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_OFFENCE_DETAILS_FORM_EMPTY } from '../fines-mac-offence-details/constants/fines-mac-offence-details-form-empty.constant';
import { FINES_MAC_FIXED_PENALTY_OFFENCE_DETAILS_FORM } from '../fines-mac-fixed-penalty-details/constants/fines-mac-fixed-penalty-offence-details-form';

export const FINES_MAC_STATE: IFinesMacState = {
  accountDetails: FINES_MAC_ACCOUNT_DETAILS_FORM,
  employerDetails: FINES_MAC_EMPLOYER_DETAILS_FORM,
  contactDetails: FINES_MAC_CONTACT_DETAILS_FORM,
  parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM,
  personalDetails: FINES_MAC_PERSONAL_DETAILS_FORM,
  companyDetails: FINES_MAC_COMPANY_DETAILS_FORM,
  courtDetails: FINES_MAC_COURT_DETAILS_FORM,
  accountCommentsNotes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM,
  offenceDetails: FINES_MAC_OFFENCE_DETAILS_FORM_EMPTY,
  fixedPenaltyOffenceDetails: FINES_MAC_FIXED_PENALTY_OFFENCE_DETAILS_FORM,
  paymentTerms: FINES_MAC_PAYMENT_TERMS_FORM,
  languagePreferences: FINES_MAC_LANGUAGE_PREFERENCES_FORM,
  businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
  deleteFromCheckAccount: false,
};
