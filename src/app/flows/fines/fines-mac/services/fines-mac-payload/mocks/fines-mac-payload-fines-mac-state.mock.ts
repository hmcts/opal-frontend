import { IFinesMacState } from '../../../interfaces/fines-mac-state.interface';
import { FINES_MAC_PAYLOAD_BUILD_ACCOUNT_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-account-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_COMPANY_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-company-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-contact-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_COURT_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-court-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_EMPLOYER_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-employer-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-language-preferences-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_STATE } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-parent-guardian-details-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_PAYMENT_TERMS_IN_FULL_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-payment-terms-state.mock';
import { FINES_MAC_PAYLOAD_BUILD_PERSONAL_DETAILS_STATE_MOCK } from '../utils/fines-mac-payload-build-account/mocks/state/fines-mac-payload-build-personal-details-state.mock';

export const FINES_MAC_PAYLOAD_FINES_MAC_STATE: IFinesMacState = {
  accountDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_ACCOUNT_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  employerDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_EMPLOYER_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  contactDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_CONTACT_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  parentGuardianDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_PARENT_GUARDIAN_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  personalDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_PERSONAL_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  companyDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_COMPANY_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  courtDetails: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_COURT_DETAILS_STATE_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  accountCommentsNotes: {
    formData: {
      fm_account_comments_notes_comments: 'Follow-up required for next meeting',
      fm_account_comments_notes_notes: 'Client prefers email communication over phone calls',
    },
    nestedFlow: false,
    status: 'Provided',
  },
  offenceDetails: [
    {
      ...FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_STATE,
    },
  ],
  paymentTerms: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_PAYMENT_TERMS_IN_FULL_MOCK,
    },
    nestedFlow: false,
    status: 'Provided',
  },
  languagePreferences: {
    formData: {
      ...FINES_MAC_PAYLOAD_BUILD_LANGUAGE_PREFERENCES_STATE_MOCK,
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
    configurationItems: [],
    welsh_language: false,
  },
  unsavedChanges: false,
  stateChanges: false,
  deleteFromCheckAccount: false,
};
