import { FINES_MAC_COURT_DETAILS_STATE_MOCK } from '../../../fines-mac-court-details/mocks/fines-mac-court-details-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../../fines-mac-offence-details/mocks/fines-mac-offence-details-form.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR } from './mocks/fines-mac-payload-account-offences-with-major-creditor.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from './mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';
import { buildAccountOffencesPayload } from './fines-mac-payload-account-offences.utils';
import { TestBed } from '@angular/core/testing';

const MOCK_OBJ = [
  {
    formData: {
      fm_offence_details_id: 0,
      fm_offence_details_date_of_sentence: '01/09/2024',
      fm_offence_details_offence_id: 'OFF1234',
      fm_offence_details_impositions: [
        {
          fm_offence_details_imposition_id: 0,
          fm_offence_details_result_id: 'FCC',
          fm_offence_details_amount_imposed: 900,
          fm_offence_details_amount_paid: 500,
          fm_offence_details_balance_remaining: 400,
          fm_offence_details_needs_creditor: true,
          fm_offence_details_creditor: 'major',
          fm_offence_details_major_creditor_id: 3999,
        },
        {
          fm_offence_details_imposition_id: 1,
          fm_offence_details_result_id: 'FO',
          fm_offence_details_amount_imposed: 0,
          fm_offence_details_amount_paid: 0,
          fm_offence_details_balance_remaining: 0,
          fm_offence_details_needs_creditor: false,
          fm_offence_details_creditor: null,
          fm_offence_details_major_creditor_id: null,
        },
      ],
    },
    nestedFlow: false,
    status: 'Provided',
    childFormData: null,
  },
];

describe('buildAccountOffencesPayload', () => {
  it('should build payload with impositions with a major creditor', () => {
    // const offencesMockState = [{ ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK }];
    const courtDetailsState = { ...FINES_MAC_COURT_DETAILS_STATE_MOCK };
    // console.log(offencesMockState);
    const results = buildAccountOffencesPayload(MOCK_OBJ, courtDetailsState);

    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR);
  });

  // it('should build payload with a minor creditor', () => {
  //   const offencesMockState = [
  //     {
  //       ...FINES_MAC_OFFENCE_DETAILS_FORM_MOCK,
  //       childFormData: [
  //         {
  //           formData: {
  //             fm_offence_details_minor_creditor_creditor_type: 'individual',
  //             fm_offence_details_minor_creditor_title: 'Mr',
  //             fm_offence_details_minor_creditor_forenames: 'Test',
  //             fm_offence_details_minor_creditor_surname: 'Test',
  //             fm_offence_details_minor_creditor_company_name: null,
  //             fm_offence_details_minor_creditor_address_line_1: 'Test',
  //             fm_offence_details_minor_creditor_address_line_2: 'Test2',
  //             fm_offence_details_minor_creditor_address_line_3: null,
  //             fm_offence_details_minor_creditor_post_code: 'SN254ED',
  //             fm_offence_details_minor_creditor_pay_by_bacs: null,
  //             fm_offence_details_minor_creditor_bank_account_name: null,
  //             fm_offence_details_minor_creditor_bank_sort_code: null,
  //             fm_offence_details_minor_creditor_bank_account_number: null,
  //             fm_offence_details_minor_creditor_bank_account_ref: null,
  //             fm_offence_details_imposition_position: 0,
  //           },
  //           nestedFlow: false,
  //           status: 'Provided',
  //         },
  //       ],
  //     },
  //   ];

  //   const courtDetailsState = { ...FINES_MAC_COURT_DETAILS_STATE_MOCK };
  //   const results = buildAccountOffencesPayload(offencesMockState, courtDetailsState);

  //   expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
  // });
});
