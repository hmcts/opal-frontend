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
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/constants/fines-mac-offence-details-state.constant';

export const FINES_COMMENT_AND_NOTES_AY_MANDATORY_MISSING_MOCK: IFinesMacState = {
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
  personalDetails: FINES_MAC_PERSONAL_DETAILS_FORM,
  companyDetails: FINES_MAC_COMPANY_DETAILS_FORM,
  courtDetails: {
    ...FINES_MAC_COURT_DETAILS_FORM,
    formData: {
      fm_court_details_originator_id: '1080',
      fm_court_details_originator_name: 'Bedfordshire Magistrates Court (1080)',
      fm_court_details_prosecutor_case_reference: '123',
      fm_court_details_imposing_court_id: 'Aberystwyth (1155)',
    },
  },
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
  paymentTerms: {
    ...FINES_MAC_PAYMENT_TERMS_FORM,
    formData: {
      fm_payment_terms_payment_terms: 'payInFull',
      fm_payment_terms_pay_by_date: '01/01/2022',
      fm_payment_terms_lump_sum_amount: null,
      fm_payment_terms_instalment_amount: null,
      fm_payment_terms_instalment_period: '',
      fm_payment_terms_start_date: '',
      fm_payment_terms_payment_card_request: null,
      fm_payment_terms_has_days_in_default: null,
      fm_payment_terms_suspended_committal_date: '',
      fm_payment_terms_default_days_in_jail: null,
      fm_payment_terms_add_enforcement_action: null,
      fm_payment_terms_hold_enforcement_on_account: null,
      fm_payment_terms_reason_account_is_on_noenf: '',
      fm_payment_terms_earliest_release_date: '',
      fm_payment_terms_prison_and_prison_number: '',
      fm_payment_terms_enforcement_action: '',
      fm_payment_terms_collection_order_made: false,
      fm_payment_terms_collection_order_date: '',
      fm_payment_terms_collection_order_made_today: true,
    },
  },
  languagePreferences: FINES_MAC_LANGUAGE_PREFERENCES_FORM,
  businessUnit: FINES_MAC_BUSINESS_UNIT_STATE,
  unsavedChanges: false,
  stateChanges: false,
  deleteFromCheckAccount: false,
};
