import { IFinesMacState } from '@interfaces/fines/mac';
import {
  FINES_MAC__ACCOUNT_COMMENTS_NOTES_STATE,
  FINES_MAC__ACCOUNT_DETAILS_STATE,
  FINES_MAC__BUSINESS_UNIT_STATE,
  FINES_MAC__COMPANY_DETAILS_STATE,
  FINES_MAC__CONTACT_DETAILS_STATE,
  FINES_MAC__COURT_DETAILS_STATE,
  FINES_MAC__EMPLOYER_DETAILS_STATE,
  FINES_MAC__OFFENCE_DETAILS_STATE,
  FINES_MAC__PARENT_GUARDIAN_DETAILS_STATE,
  FINES_MAC__PAYMENT_TERMS_STATE,
  FINES_MAC__PERSONAL_DETAILS_STATE,
} from '@constants/fines/mac';

export const FINES_MAC__STATE_MOCK: IFinesMacState = {
  accountDetails: { ...FINES_MAC__ACCOUNT_DETAILS_STATE, DefendantType: 'adultOrYouthOnly' },
  employerDetails: FINES_MAC__EMPLOYER_DETAILS_STATE,
  contactDetails: FINES_MAC__CONTACT_DETAILS_STATE,
  parentGuardianDetails: FINES_MAC__PARENT_GUARDIAN_DETAILS_STATE,
  personalDetails: FINES_MAC__PERSONAL_DETAILS_STATE,
  companyDetails: FINES_MAC__COMPANY_DETAILS_STATE,
  courtDetails: FINES_MAC__COURT_DETAILS_STATE,
  accountCommentsNotes: FINES_MAC__ACCOUNT_COMMENTS_NOTES_STATE,
  offenceDetails: FINES_MAC__OFFENCE_DETAILS_STATE,
  paymentTerms: FINES_MAC__PAYMENT_TERMS_STATE,
  businessUnit: FINES_MAC__BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
};
