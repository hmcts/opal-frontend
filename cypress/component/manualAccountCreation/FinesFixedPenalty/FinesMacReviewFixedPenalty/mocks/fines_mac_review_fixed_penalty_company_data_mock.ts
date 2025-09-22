import { FINES_MAC_BUSINESS_UNIT_STATE } from '../../../../../../src/app/flows/fines/fines-mac/constants/fines-mac-business-unit-state';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-form';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-state';
import { FINES_MAC_COMPANY_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-company-details/constants/fines-mac-company-details-form';
import { FINES_MAC_CONTACT_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-contact-details/constants/fines-mac-contact-details-form';
import { FINES_MAC_COURT_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-court-details/constants/fines-mac-court-details-form';
import { FINES_MAC_EMPLOYER_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-employer-details/constants/fines-mac-employer-details-form';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-form';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/constants/fines-mac-offence-details-form.constant';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-parent-guardian-details/constants/fines-mac-parent-guardian-details-form';
import { FINES_MAC_PAYMENT_TERMS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-payment-terms/constants/fines-mac-payment-terms-form';
import { FINES_MAC_PERSONAL_DETAILS_FORM } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/constants/fines-mac-personal-details-form';
import { IFinesMacState } from '../../../../../../src/app/flows/fines/fines-mac/interfaces/fines-mac-state.interface';
import { FINES_MAC_PERSONAL_DETAILS_STATE } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-personal-details/constants/fines-mac-personal-details-state';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/constants/fines-mac-offence-details-state.constant';
import { FINES_MAC_ACCOUNT_TYPES } from 'src/app/flows/fines/fines-mac/constants/fines-mac-account-types';

export const FINES_COMPANY_FIXED_PENALTY_ACCOUNT_MOCK: IFinesMacState = {
  accountDetails: {
    ...FINES_MAC_ACCOUNT_DETAILS_FORM,
    formData: {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE,
      fm_create_account_business_unit_id: 77,
      fm_create_account_defendant_type: 'company',
      fm_create_account_account_type: FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'],
    },
  },
  employerDetails: {
    ...FINES_MAC_EMPLOYER_DETAILS_FORM,
    formData: {
      fm_employer_details_employer_company_name: null,
      fm_employer_details_employer_reference: null,
      fm_employer_details_employer_email_address: null,
      fm_employer_details_employer_telephone_number: null,
      fm_employer_details_employer_address_line_1: null,
      fm_employer_details_employer_address_line_2: null,
      fm_employer_details_employer_address_line_3: null,
      fm_employer_details_employer_address_line_4: null,
      fm_employer_details_employer_address_line_5: null,
      fm_employer_details_employer_post_code: null,
    },
  },
  contactDetails: {
    ...FINES_MAC_CONTACT_DETAILS_FORM,
    formData: {
      fm_contact_details_email_address_1: 'company@example.com',
      fm_contact_details_email_address_2: 'accounts@example.com',
      fm_contact_details_telephone_number_mobile: '07123456789',
      fm_contact_details_telephone_number_home: null,
      fm_contact_details_telephone_number_business: '02012345678',
    },
  },
  parentGuardianDetails: FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM,
  personalDetails: FINES_MAC_PERSONAL_DETAILS_FORM,
  companyDetails: {
    ...FINES_MAC_COMPANY_DETAILS_FORM,
    formData: {
      fm_company_details_company_name: 'Example Corporation Ltd',
      fm_company_details_add_alias: true,
      fm_company_details_aliases: [{ fm_company_details_alias_company_name_0: 'ExCorp Limited' }],
      fm_company_details_address_line_1: '123 Business Park',
      fm_company_details_address_line_2: 'Commerce Way',
      fm_company_details_address_line_3: 'London',
      fm_company_details_postcode: 'EC1A 1BB',
    },
  },
  courtDetails: {
    ...FINES_MAC_COURT_DETAILS_FORM,
    formData: {
      fm_court_details_originator_id: '9985',
      fm_court_details_originator_name: 'Asylum & Immigration Tribunal',
      fm_court_details_prosecutor_case_reference: 'CORP2025/123',
      fm_court_details_imposing_court_id: '1865',
    },
  },
  accountCommentsNotes: {
    ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM,
    formData: {
      fm_account_comments_notes_comments: 'Corporate fixed penalty notice',
      fm_account_comments_notes_notes: 'Contact company secretary for all correspondence',
      fm_account_comments_notes_system_notes: '',
    },
  },

  offenceDetails: [
    {
      ...FINES_MAC_OFFENCE_DETAILS_FORM,
      formData: {
        ...FINES_MAC_OFFENCE_DETAILS_STATE,
        fm_offence_details_id: 0,
        fm_offence_details_date_of_sentence: '15/07/2025',
        fm_offence_details_offence_cjs_code: 'CR71001',
        fm_offence_details_offence_id: 456,
        fm_offence_details_impositions: [
          {
            fm_offence_details_imposition_id: 0,
            fm_offence_details_result_id: 'FCC',
            fm_offence_details_amount_imposed: 500,
            fm_offence_details_amount_paid: 0,
            fm_offence_details_balance_remaining: 500,
            fm_offence_details_needs_creditor: true,
            fm_offence_details_creditor: 'major',
            fm_offence_details_major_creditor_id: 4567,
          },
        ],
      },
      nestedFlow: false,
    },
  ],
  paymentTerms: {
    ...FINES_MAC_PAYMENT_TERMS_FORM,
    formData: {
      fm_payment_terms_payment_terms: 'payInFull',
      fm_payment_terms_pay_by_date: '15/08/2025',
      fm_payment_terms_lump_sum_amount: null,
      fm_payment_terms_instalment_amount: null,
      fm_payment_terms_instalment_period: '',
      fm_payment_terms_start_date: '',
      fm_payment_terms_payment_card_request: false,
      fm_payment_terms_has_days_in_default: null,
      fm_payment_terms_suspended_committal_date: '',
      fm_payment_terms_default_days_in_jail: null,
      fm_payment_terms_add_enforcement_action: null,
      fm_payment_terms_hold_enforcement_on_account: null,
      fm_payment_terms_reason_account_is_on_noenf: '',
      fm_payment_terms_earliest_release_date: '',
      fm_payment_terms_prison_and_prison_number: '',
      fm_payment_terms_enforcement_action: '',
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_collection_order_date: '15/07/2025',
      fm_payment_terms_collection_order_made_today: true,
    },
  },
  languagePreferences: {
    ...FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    formData: {
      fm_language_preferences_document_language: 'english',
      fm_language_preferences_hearing_language: 'english',
    },
  },
  businessUnit: {
    ...FINES_MAC_BUSINESS_UNIT_STATE,
    business_unit_id: 77,
    business_unit_name: 'Corporate Penalties Unit',
  },
  unsavedChanges: false,
  stateChanges: false,
  deleteFromCheckAccount: false,
  deleteAccountConfirmation: {
    formData: {
      fm_delete_account_confirmation_reason: null,
    },
    nestedFlow: false,
  },
  fixedPenaltyDetails: {
    nestedFlow: false,
    formData: {
      // Offence Details Section for corporate fixed penalty
      fm_offence_details_notice_number: 'FPC20250715',
      fm_offence_details_offence_type: 'vehicle',
      fm_offence_details_date_of_offence: '01/07/2025',
      fm_offence_details_offence_id: 314441,
      fm_offence_details_offence_cjs_code: 'AK123456',
      fm_offence_details_time_of_offence: '10:15',
      fm_offence_details_place_of_offence: 'London Borough of Westminster',
      fm_offence_details_amount_imposed: 500,
      fm_offence_details_vehicle_registration_number: 'CP12 COR',
      fm_offence_details_driving_licence_number: 'DRIVER123',
      fm_offence_details_nto_nth: 'CORP2025/456',
      fm_offence_details_date_nto_issued: '05/07/2025',
    },
  },
};
