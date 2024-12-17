import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR } from './mocks/fines-mac-payload-account-offences-with-major-creditor.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from './mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';

import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../mocks/state/fines-mac-payload-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-court-details-state.mock';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { finesMacPayloadBuildAccountOffences } from './fines-mac-payload-build-account-offences.utils';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';

describe('finesMacPayloadBuildAccountOffences', () => {
  it('should build payload with impositions with a major creditor', () => {
    const offencesMockState = [{ ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE }];
    const courtDetailsState = { ...FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK };
    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState);
    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR);
  });

  it('should build payload with a minor creditor', () => {
    // TOD: Make minor creditor state
    const offencesMockState: IFinesMacOffenceDetailsForm[] = [
      {
        ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE,
      },
    ];

    const courtDetailsState = { ...FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK };
    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState);

    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
  });

  it('should build payload with a null response object', () => {
    const offencesMockState: IFinesMacOffenceDetailsForm[] = [
      {
        ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE,
        formData: {
          ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData,
          fm_offence_details_id: 0,
          fm_offence_details_date_of_sentence: null,
          fm_offence_details_offence_id: null,
          fm_offence_details_impositions: [],
        },
        childFormData: null,
      },
    ];

    const courtDetailsState = {
      fm_court_details_originator_id: null,
      fm_court_details_originator_name: null,
      fm_court_details_prosecutor_case_reference: null,
      fm_court_details_imposing_court_id: null,
    };
    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState);
    expect(results).toEqual([
      {
        date_of_sentence: null,
        imposing_court_id: null,
        offence_id: null,
        impositions: null,
      },
    ]);
  });

  it('should build payload with null values', () => {
    const offencesMockState: IFinesMacOffenceDetailsForm[] = [
      {
        ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE,
        formData: {
          ...FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData,
          fm_offence_details_id: 0,
          fm_offence_details_date_of_sentence: null,
          fm_offence_details_offence_id: null,
          fm_offence_details_impositions: [
            {
              fm_offence_details_imposition_id: null,
              fm_offence_details_result_id: null,
              fm_offence_details_amount_imposed: null,
              fm_offence_details_amount_paid: null,
              fm_offence_details_balance_remaining: null,
              fm_offence_details_needs_creditor: null,
              fm_offence_details_creditor: null,
              fm_offence_details_major_creditor_id: null,
            },
          ],
        },
        childFormData: [
          {
            formData: {
              fm_offence_details_minor_creditor_creditor_type: null,
              fm_offence_details_minor_creditor_title: null,
              fm_offence_details_minor_creditor_forenames: null,
              fm_offence_details_minor_creditor_surname: null,
              fm_offence_details_minor_creditor_company_name: null,
              fm_offence_details_minor_creditor_address_line_1: null,
              fm_offence_details_minor_creditor_address_line_2: null,
              fm_offence_details_minor_creditor_address_line_3: null,
              fm_offence_details_minor_creditor_post_code: null,
              fm_offence_details_minor_creditor_pay_by_bacs: null,
              fm_offence_details_minor_creditor_bank_account_name: null,
              fm_offence_details_minor_creditor_bank_sort_code: null,
              fm_offence_details_minor_creditor_bank_account_number: null,
              fm_offence_details_minor_creditor_bank_account_ref: null,
              fm_offence_details_imposition_position: 0,
            },
            nestedFlow: false,
            status: 'Provided',
          },
        ],
      },
    ];

    const courtDetailsState = {
      fm_court_details_originator_id: null,
      fm_court_details_originator_name: null,
      fm_court_details_prosecutor_case_reference: null,
      fm_court_details_imposing_court_id: null,
    };
    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState);

    expect(results).toEqual([
      {
        date_of_sentence: null,
        imposing_court_id: null,
        offence_id: null,
        impositions: [
          {
            result_id: null,
            amount_imposed: null,
            amount_paid: null,
            major_creditor_id: null,
            minor_creditor: null,
          },
        ],
      },
    ]);
  });
});
