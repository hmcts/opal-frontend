import { IFinesMacState } from '@interfaces/fines/mac';
import {
  FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE,
  FINES_MAC_ACCOUNT_DETAILS_STATE,
  FINES_MAC_BUSINESS_UNIT_STATE,
  FINES_MAC_COMPANY_DETAILS_STATE,
  FINES_MAC_CONTACT_DETAILS_STATE,
  FINES_MAC_COURT_DETAILS_STATE,
  FINES_MAC_EMPLOYER_DETAILS_STATE,
  FINES_MAC_OFFENCE_DETAILS_STATE,
  FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE,
  FINES_MAC_PAYMENT_TERMS_STATE,
  FINES_MAC_PERSONAL_DETAILS_STATE,
} from '@constants/fines/mac';

export const FINES_MAC_STATE_MOCK: IFinesMacState = {
  accountDetails: { ...FINES_MAC_ACCOUNT_DETAILS_STATE, DefendantType: 'adultOrYouthOnly' },
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
