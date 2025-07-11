import { FINES_MAC_BUSINESS_UNIT_STATE } from '../../../../../src/app/flows/fines/fines-mac/constants/fines-mac-business-unit-state';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-form';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-state';
import { FINES_MAC_COMPANY_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-company-details/constants/fines-mac-company-details-form';
import { FINES_MAC_CONTACT_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/constants/fines-mac-contact-details-form';
import { FINES_MAC_COURT_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-court-details/constants/fines-mac-court-details-form';
import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-employer-details/constants/fines-mac-employer-details-form';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/constants/fines-mac-offence-details-form.constant';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-parent-guardian-details/constants/fines-mac-parent-guardian-details-form';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/constants/fines-mac-payment-terms-form';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { IFinesMacState } from '../../../../../src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FINES_MAC_PERSONAL_DETAILS_STATE } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/constants/fines-mac-personal-details-state';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/constants/fines-mac-offence-details-state.constant';

export const FINES_COMPANY_DETAILS_MOCK: IFinesMacState = {
  accountDetails: {
    ...FINES_MAC_ACCOUNT_DETAILS_FORM,
    formData: {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE,
      fm_create_account_business_unit_id: 17,
      fm_create_account_defendant_type: 'adultOrYouthOnly',
      fm_create_account_account_type: 'fine',
    },
  },
  employerDetails: FINES_MAC_EMPLOYER_DETAILS_FORM,
  contactDetails: FINES_MAC_CONTACT_DETAILS_FORM,
  parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM,
  personalDetails: {
    ...FINES_MAC_PERSONAL_DETAILS_FORM,
    formData: {
      ...FINES_MAC_PERSONAL_DETAILS_STATE,
      fm_personal_details_forenames: 'John',
      fm_personal_details_surname: 'Doe',
      fm_personal_details_dob: '01/01/2000',
      fm_personal_details_address_line_1: '123 Fake Street',
    },
  },
  companyDetails: FINES_MAC_COMPANY_DETAILS_FORM,
  courtDetails: FINES_MAC_COURT_DETAILS_FORM,
  accountCommentsNotes: FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM,

  offenceDetails: [
    {
      ...FINES_MAC_OFFENCE_DETAILS_FORM,
      formData: {
        ...FINES_MAC_OFFENCE_DETAILS_STATE,
        fm_offence_details_id: 0,
        fm_offence_details_date_of_sentence: '01/10/2022',
        fm_offence_details_offence_cjs_code: null,
        fm_offence_details_offence_id: null,
        fm_offence_details_impositions: [],
      },
      nestedFlow: false,
    },
  ],
  paymentTerms: FINES_MAC_PAYMENT_TERMS_FORM,
  languagePreferences: FINES_MAC_LANGUAGE_PREFERENCES_FORM,
  businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
  deleteFromCheckAccount: false,
  deleteAccountConfirmation: {
    formData: {
      fm_delete_account_confirmation_reason: null,
    },
    nestedFlow: false,
  },
};
