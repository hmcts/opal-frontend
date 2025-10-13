import { IOpalFinesAccountDefendantAtAGlance } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { IOpalFinesDefendantAccountIndividualDetails } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IOpalFinesAccountDefendantDetailsHeader } from '../../../../../src/app/flows/fines/fines-acc/fines-acc-defendant-details/interfaces/fines-acc-defendant-details-header.interface';
import { IOpalFinesDefendantAccountAlias } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
import { IFinesAccountState } from '../../../../../src/app/flows/fines/fines-acc/interfaces/fines-acc-state-interface';
import { IOpalFinesDefendantAccountIndividualAlias } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-defendant-account.interface';
const INDIVIDUAL_ALIASES: IOpalFinesDefendantAccountIndividualAlias[] = [
  { alias_id: '2', sequence_number: 1, surname: 'Smith', forenames: 'B' },
  { alias_id: '1', sequence_number: 2, surname: 'Graham', forenames: 'A' },
];

export const MOCK_FINES_ACCOUNT_STATE: IFinesAccountState = {
  account_number: '123',
  account_id: 123,
  party_type: 'individual',
  party_name: 'John Doe',
  party_id: '456',
  base_version: '1',
  business_unit_id: '77',
  business_unit_user_id: 'BU-USER-123',
  welsh_speaking: 'Y',
};

export const OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK: IOpalFinesAccountDefendantAtAGlance = {
  version: null,
  defendant_account_id: 'DEF-001',
  account_number: 'ACC-123456',
  debtor_type: 'PERSON',
  is_youth: false,
  party_details: {
    party_id: '77',

    organisation_flag: false,
    organisation_details: null,
    individual_details: {
      title: 'Ms',
      forenames: 'Anna',
      surname: 'Graham',
      date_of_birth: '1980-02-03',
      age: '45',
      national_insurance_number: 'QA 12 34 56C',
      individual_aliases: INDIVIDUAL_ALIASES,
    },
  },
  address: {
    address_line_1: '123 Main Street',
    address_line_2: 'Apt 4',
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    postcode: 'AB12 3CD',
  },
  language_preferences: {
    document_language_preference: {
      language_code: 'CY',
      language_display_name: 'Welsh and English',
    },
    hearing_language_preference: {
      language_code: 'CY',
      language_display_name: 'Welsh and English',
    },
  },
  payment_terms: {
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'By date',
    },
    effective_date: '01/01/2024',
    instalment_period: {
      instalment_period_code: 'M',
      instalment_period_display_name: 'Monthly',
    },
    lump_sum_amount: 1000,
    instalment_amount: 100,
  },
  enforcement_status: {
    last_enforcement_action: {
      last_enforcement_action_id: 'EA-001',
      last_enforcement_action_title: 'Warrant Issued',
    },
    collection_order_made: true,
    default_days_in_jail: 0,
    enforcement_override: {
      enforcement_override_result: {
        enforcement_override_result_id: 'EOR-001',
        enforcement_override_result_title: 'Override Approved',
      },
      enforcer: {
        enforcer_id: 10,
        enforcer_name: 'Court Officer',
      },
      lja: {
        lja_id: 20,
        lja_name: 'Central LJA',
      },
    },
    last_movement_date: '01/05/2024',
  },
  comments_and_notes: {
    account_comment: 'Account reviewed.',
    free_text_note_1: 'First note.',
    free_text_note_2: 'Second note.',
    free_text_note_3: null,
  },
};
