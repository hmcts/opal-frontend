import { IOpalFinesAccountDefendantAtAGlance } from 'src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-at-a-glance.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-account-defendant-at-a-glance.mock';

/** Synthetic account details; clone before changing data in an individual test. */
export const MCI_CONFIRM_INDIVIDUAL_MOCK: IOpalFinesAccountDefendantAtAGlance = {
  ...structuredClone(OPAL_FINES_ACCOUNT_DEFENDANT_AT_A_GLANCE_MOCK),
  defendant_account_id: '1',
  account_number: '130001BU',
  account_status_code: 'L',
  account_balance: 1234.56,
  comments_and_notes: {
    account_comment: 'Account reviewed.',
    free_text_note_1: 'First note.',
    free_text_note_2: 'Second note.',
    free_text_note_3: 'Third note.',
  },
  party_details: {
    party_id: '1',
    organisation_flag: false,
    organisation_details: null,
    individual_details: {
      title: 'Ms',
      forenames: 'Alex Morgan',
      surname: 'Example',
      date_of_birth: '1980-02-03',
      age: null,
      national_insurance_number: null,
      individual_aliases: [
        { alias_id: '2', sequence_number: 2, forenames: 'Second', surname: 'Alias' },
        { alias_id: '1', sequence_number: 1, forenames: 'First', surname: 'Example' },
      ],
    },
  },
  address: {
    address_line_1: '1 Example Street',
    address_line_2: 'Example District',
    address_line_3: 'Example Town',
    address_line_4: null,
    address_line_5: null,
    postcode: 'AB1 2CD',
  },
  payment_terms: {
    payment_terms_type: { payment_terms_type_code: 'B', payment_terms_type_display_name: 'By date' },
    effective_date: '2026-12-15',
    lump_sum_amount: null,
    instalment_amount: null,
    instalment_period: null,
  },
};

export const MCI_CONFIRM_COMPANY_MOCK: IOpalFinesAccountDefendantAtAGlance = {
  ...structuredClone(MCI_CONFIRM_INDIVIDUAL_MOCK),
  debtor_type: 'COMPANY',
  party_details: {
    party_id: '1',
    organisation_flag: true,
    individual_details: null,
    organisation_details: {
      organisation_name: 'Example Trading Ltd',
      organisation_aliases: [
        { alias_id: '2', sequence_number: 2, organisation_name: 'Second Trading Name' },
        { alias_id: '1', sequence_number: 1, organisation_name: 'First Trading Name' },
      ],
    },
  },
};
