import { FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK } from '../../../fines-mac-account-details/mocks/fines-mac-account-details-state.mock';
import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';
import { FINES_MAC_CONTACT_DETAILS_STATE_MOCK } from '../../../fines-mac-contact-details/mocks/fines-mac-contact-details-state.mock';
import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK } from '../../../fines-mac-language-preferences/mocks/fines-mac-language-preferences-state.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../../../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { IFinesMacState } from '../../../interfaces/fines-mac-state.interface';
import { FINES_MAC_STATE_MOCK } from '../../../mocks/fines-mac-state.mock';

export const FINES_MAC_PAYLOAD_FINES_MAC_STATE: IFinesMacState = {
  ...FINES_MAC_STATE_MOCK,
  accountDetails: {
    ...FINES_MAC_STATE_MOCK.accountDetails,
    formData: {
      ...FINES_MAC_ACCOUNT_DETAILS_STATE_MOCK,
      fm_create_account_defendant_type: 'individual',
    },
  },
  personalDetails: {
    ...FINES_MAC_STATE_MOCK.personalDetails,
    formData: {
      ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK,
      fm_personal_details_add_alias: false,
      fm_personal_details_aliases: [],
    },
  },
  contactDetails: {
    ...FINES_MAC_STATE_MOCK.contactDetails,
    formData: {
      ...FINES_MAC_CONTACT_DETAILS_STATE_MOCK,
    },
  },
  employerDetails: {
    ...FINES_MAC_STATE_MOCK.employerDetails,
    formData: {
      ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK,
    },
  },
  languagePreferences: {
    ...FINES_MAC_STATE_MOCK.languagePreferences,
    formData: {
      ...FINES_MAC_LANGUAGE_PREFERENCES_STATE_MOCK,
    },
  },
  companyDetails: {
    ...FINES_MAC_STATE_MOCK.companyDetails,
    formData: {
      ...FINES_MAC_COMPANY_DETAILS_STATE_MOCK,
    },
  },
  parentGuardianDetails: {
    ...FINES_MAC_STATE_MOCK.parentGuardianDetails,
    formData: {
      ...FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    },
  },
  accountCommentsNotes: {
    ...FINES_MAC_STATE_MOCK.accountCommentsNotes,
    formData: {
      fm_account_comments_notes_comments: 'Test comment',
      fm_account_comments_notes_notes: 'Test note',
    },
  },
  paymentTerms: {
    ...FINES_MAC_STATE_MOCK.paymentTerms,
    formData: {
      fm_payment_terms_payment_terms: 'payInFull',
      fm_payment_terms_payment_card_request: true,
      fm_payment_terms_collection_order_made: true,
      fm_payment_terms_has_days_in_default: true,
      fm_payment_terms_add_enforcement_action: true,
      fm_payment_terms_collection_order_date: '2024-10-21',
      fm_payment_terms_pay_by_date: '2024-10-14',
      fm_payment_terms_suspended_committal_date: '2024-10-11',
      fm_payment_terms_default_days_in_jail: 11,
      fm_payment_terms_enforcement_action: 'defendantIsInCustody',
      fm_payment_terms_earliest_release_date: '2024-10-21',
      fm_payment_terms_prison_and_prison_number: 'Test and test',
    },
  },
};
