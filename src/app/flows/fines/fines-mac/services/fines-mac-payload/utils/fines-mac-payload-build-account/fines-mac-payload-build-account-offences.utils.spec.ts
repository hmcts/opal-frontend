import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR } from '../mocks/fines-mac-payload-account-offences-with-major-creditor.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from '../mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';

import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE } from '../mocks/state/fines-mac-payload-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-court-details-state.mock';
import { IFinesMacOffenceDetailsForm } from '../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { finesMacPayloadBuildAccountOffences } from './fines-mac-payload-build-account-offences.utils';
import { FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../mocks/state/fines-mac-payload-offence-details-minor-creditor-state.mock';
import { IFinesMacCourtDetailsState } from '../../../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-fixed-penalty-details-state.mock';

describe('finesMacPayloadBuildAccountOffences', () => {
  let offencesMockState: IFinesMacOffenceDetailsForm[] | null;
  let offencesMockStateMinorCreditor: IFinesMacOffenceDetailsForm[] | null;
  let fixedPenaltyMockState: IFinesMacFixedPenaltyDetailsStoreState | null;
  let courtDetailsState: IFinesMacCourtDetailsState | null;

  beforeEach(() => {
    offencesMockState = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE]);
    courtDetailsState = structuredClone(FINES_MAC_PAYLOAD_COURT_DETAILS_STATE_MOCK);
    offencesMockStateMinorCreditor = structuredClone([FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE]);
    fixedPenaltyMockState = structuredClone(FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK);
  });

  afterAll(() => {
    offencesMockState = null;
    courtDetailsState = null;
    offencesMockStateMinorCreditor = null;
  });

  it('should build payload with impositions with a major creditor', () => {
    if (!offencesMockState || !courtDetailsState || !offencesMockStateMinorCreditor) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState, (val) => val);
    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR);
  });

  it('should build payload with a minor creditor', () => {
    if (!offencesMockState || !courtDetailsState || !offencesMockStateMinorCreditor) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const results = finesMacPayloadBuildAccountOffences(
      offencesMockStateMinorCreditor,
      courtDetailsState,
      () => '2024-09-01',
    );

    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
  });

  it('should build payload with a null response object', () => {
    if (!offencesMockState || !offencesMockStateMinorCreditor) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offencesMockState = [
      {
        ...structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE),
        formData: {
          ...structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData),
          fm_offence_details_id: 0,
          fm_offence_details_date_of_sentence: null,
          fm_offence_details_offence_cjs_code: null,
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
    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState, () => null);
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
    if (!offencesMockState || !offencesMockStateMinorCreditor) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offencesMockState = [
      {
        ...structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE),
        formData: {
          ...structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData),
          fm_offence_details_id: 0,
          fm_offence_details_date_of_sentence: null,
          fm_offence_details_offence_cjs_code: null,
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
    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState, () => null);

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

  it('should fallback to null and false when optional fields are undefined in minor creditor childFormData', () => {
    if (!offencesMockState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    offencesMockState = [
      {
        ...structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE),
        formData: {
          ...structuredClone(FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE.formData),
          fm_offence_details_id: 0,
          fm_offence_details_date_of_sentence: null,
          fm_offence_details_offence_cjs_code: null,
          fm_offence_details_offence_id: null,
          fm_offence_details_impositions: [
            {
              fm_offence_details_imposition_id: 0,
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

    const results = finesMacPayloadBuildAccountOffences(offencesMockState, courtDetailsState, () => null);

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
            minor_creditor: {
              company_flag: false,
              title: null,
              company_name: null,
              surname: null,
              forenames: null,
              dob: null,
              address_line_1: null,
              address_line_2: null,
              address_line_3: null,
              post_code: null,
              telephone: null,
              email_address: null,
              payout_hold: false,
              pay_by_bacs: false,
              bank_account_type: 1,
              bank_sort_code: null,
              bank_account_number: null,
              bank_account_name: null,
              bank_account_ref: null,
            },
          },
        ],
      },
    ]);
  });

  it('should build payload with fixed penalty details', () => {
    if (!offencesMockState || !courtDetailsState || !fixedPenaltyMockState) {
      fail('Required mock states are not properly initialised');
      return;
    }

    const results = finesMacPayloadBuildAccountOffences(
      offencesMockState,
      courtDetailsState,
      (val) => val,
      fixedPenaltyMockState,
      'fixedPenalty',
    );

    expect(results).toEqual([
      {
        date_of_sentence: '12/12/2024',
        imposing_court_id: 'Magistrates Court Database (204)',
        offence_id: 12345,
        impositions: [
          {
            result_id: 'FO',
            amount_imposed: 100.55,
            amount_paid: 0,
            major_creditor_id: null,
            minor_creditor: null,
          },
        ],
      },
    ]);
  });
});
