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

export const FINES_AYG_CHECK_ACCOUNT_MOCK: IFinesMacState = {
  accountDetails: {
    ...FINES_MAC_ACCOUNT_DETAILS_FORM,
    formData: {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE,
      fm_create_account_business_unit_id: 61,
      fm_create_account_defendant_type: 'adultOrYouthOnly',
      fm_create_account_account_type: 'fine',
    },
  },
  employerDetails: {
    ...FINES_MAC_EMPLOYER_DETAILS_FORM,
    formData: {
      fm_employer_details_employer_company_name: 'Test Company',
      fm_employer_details_employer_reference: 'Test Reference',
      fm_employer_details_employer_email_address: 'test@test.com',
      fm_employer_details_employer_telephone_number: '0123456789',
      fm_employer_details_employer_address_line_1: 'test address line 1',
      fm_employer_details_employer_address_line_2: 'test address line 2',
      fm_employer_details_employer_address_line_3: 'test address line 3',
      fm_employer_details_employer_address_line_4: 'test address line 4',
      fm_employer_details_employer_address_line_5: 'test address line 5',
      fm_employer_details_employer_post_code: 'test post code',
    },
  },
  contactDetails: {
    ...FINES_MAC_CONTACT_DETAILS_FORM,
    formData: {
      fm_contact_details_email_address_1: 'test@test.com',
      fm_contact_details_email_address_2: 'test@test.com',
      fm_contact_details_telephone_number_mobile: '0123456789',
      fm_contact_details_telephone_number_home: '0123456789',
      fm_contact_details_telephone_number_business: '0123456789',
    },
  },
  parentGuardianDetails: {
    ...FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM,
    formData: {
      fm_parent_guardian_details_forenames: 'Test',
      fm_parent_guardian_details_surname: 'test',
      fm_parent_guardian_details_add_alias: true,
      fm_parent_guardian_details_aliases: [
        { fm_parent_guardian_details_alias_forenames_0: 'test', fm_parent_guardian_details_alias_surname_0: 'test' },
      ],
      fm_parent_guardian_details_dob: '01/02/1990',
      fm_parent_guardian_details_national_insurance_number: 'AB123456C',
      fm_parent_guardian_details_address_line_1: 'test address line 1',
      fm_parent_guardian_details_address_line_2: 'test address line 2',
      fm_parent_guardian_details_address_line_3: 'test address line 3',
      fm_parent_guardian_details_post_code: 'test post code',
      fm_parent_guardian_details_vehicle_make: 'renault',
      fm_parent_guardian_details_vehicle_registration_mark: 'cd12 efg',
    },
  },
  personalDetails: {
    ...FINES_MAC_PERSONAL_DETAILS_FORM,
    formData: {
      ...FINES_MAC_PERSONAL_DETAILS_STATE,
      fm_personal_details_title: 'Mr',
      fm_personal_details_forenames: 'John',
      fm_personal_details_surname: 'Doe',
      fm_personal_details_dob: '01/01/2000',
      fm_personal_details_add_alias: true,
      fm_personal_details_aliases: [
        { fm_personal_details_alias_forenames_0: 'Rebecca', fm_personal_details_alias_surname_0: 'Johnson' },
      ],
      fm_personal_details_address_line_1: '123 Fake Street',
      fm_personal_details_address_line_2: 'Fake Town',
      fm_personal_details_address_line_3: 'Fake City',
      fm_personal_details_post_code: 'AB12 3CD',
      fm_personal_details_national_insurance_number: 'AB123456C',
      fm_personal_details_vehicle_make: 'Ford',
      fm_personal_details_vehicle_registration_mark: 'AB12 CDE',
    },
  },
  companyDetails: {
    ...FINES_MAC_COMPANY_DETAILS_FORM,
    formData: {
      fm_company_details_company_name: 'test company',
      fm_company_details_add_alias: true,
      fm_company_details_aliases: [{ fm_company_details_alias_company_name_0: 'test alias' }],
      fm_company_details_address_line_1: 'test address line 1',
      fm_company_details_address_line_2: 'test address line 2',
      fm_company_details_address_line_3: 'test address line 3',
      fm_company_details_postcode: 'test post code',
    },
  },
  courtDetails: {
    ...FINES_MAC_COURT_DETAILS_FORM,
    formData: {
      fm_court_details_originator_id: '9985',
      fm_court_details_originator_name: 'Asylum & Immigration Tribunal',
      fm_court_details_prosecutor_case_reference: 'O1AT204003',
      fm_court_details_imposing_court_id: '1865',
    },
  },
  accountCommentsNotes: {
    ...FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM,
    formData: {
      fm_account_comments_notes_comments: 'test comments',
      fm_account_comments_notes_notes: 'test notes',
      fm_account_comments_notes_system_notes: '',
    },
  },

  offenceDetails: [
    {
      ...FINES_MAC_OFFENCE_DETAILS_FORM,
      formData: {
        ...FINES_MAC_OFFENCE_DETAILS_STATE,
        fm_offence_details_id: 0,
        fm_offence_details_date_of_sentence: '01/10/2022',
        fm_offence_details_offence_cjs_code: 'AK123456',
        fm_offence_details_offence_id: 123,
        fm_offence_details_impositions: [
          {
            fm_offence_details_imposition_id: 0,
            fm_offence_details_result_id: 'FCC',
            fm_offence_details_amount_imposed: 200,
            fm_offence_details_amount_paid: 50,
            fm_offence_details_balance_remaining: 150,
            fm_offence_details_needs_creditor: true,
            fm_offence_details_creditor: 'major',
            fm_offence_details_major_creditor_id: 3856,
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
      fm_payment_terms_pay_by_date: '01/01/2022',
      fm_payment_terms_lump_sum_amount: null,
      fm_payment_terms_instalment_amount: 1200,
      fm_payment_terms_instalment_period: '4',
      fm_payment_terms_start_date: '12/01/2025',
      fm_payment_terms_payment_card_request: true,
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
  languagePreferences: {
    ...FINES_MAC_LANGUAGE_PREFERENCES_FORM,
    formData: {
      fm_language_preferences_document_language: 'english',
      fm_language_preferences_hearing_language: 'english',
    },
  },
  businessUnit: { ...FINES_MAC_BUSINESS_UNIT_STATE, business_unit_id: 61, business_unit_name: 'Test Business Unit' },
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
