import { IFinesMacState } from '../../../interfaces/fines-mac-state.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-account-details-state.mock';
import { FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-company-details-state.mock';
import { FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-court-details-state.mock';
import { FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../utils/mocks/state/fines-mac-payload-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-parent-guardian-details-state.mock';
import { FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK } from '../utils/mocks/state/fines-mac-payload-payment-terms-state.mock';
import { FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-personal-details-state.mock';
import { FINES_MAC_PAYLOAD_DELETE_ACCOUNT_CONFIRMATION_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-delete-account-confirmation-state.mock';
import { FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK } from '../utils/mocks/state/fines-mac-payload-fixed-penalty-details-state.mock';

export const FINES_MAC_PAYLOAD_FINES_MAC_STATE: IFinesMacState = {
  accountDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  employerDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_EMPLOYER_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  contactDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_CONTACT_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  parentGuardianDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  personalDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_PERSONAL_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  companyDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_COMPANY_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  courtDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
  accountCommentsNotes: {
    formData: {
      fm_account_comments_notes_comments: 'Follow-up required for next meeting',
      fm_account_comments_notes_notes: 'Client prefers email communication over phone calls',
      fm_account_comments_notes_system_notes: null,
    },
    nestedFlow: false,
  },
  offenceDetails: [
    {
      ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE,
    },
  ],
  paymentTerms: {
    formData: {
      ...FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK,
    },
    nestedFlow: false,
    status: null,
  },
  languagePreferences: {
    formData: {
      ...FINES_MAC_PAYLOAD_LANGUAGE_PREFERENCES_STATE_MOCK,
    },
    nestedFlow: false,
  },
  deleteAccountConfirmation: {
    formData: {
      ...FINES_MAC_PAYLOAD_DELETE_ACCOUNT_CONFIRMATION_STATE_MOCK,
    },
    nestedFlow: false,
  },
  businessUnit: {
    business_unit_code: '',
    business_unit_type: '',
    account_number_prefix: null,
    opal_domain: null,
    business_unit_id: 0,
    business_unit_name: '',
    configuration_items: [],
    welsh_language: false,
  },
  unsavedChanges: false,
  stateChanges: false,
  deleteFromCheckAccount: false,
  fixedPenaltyDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
  },
};
