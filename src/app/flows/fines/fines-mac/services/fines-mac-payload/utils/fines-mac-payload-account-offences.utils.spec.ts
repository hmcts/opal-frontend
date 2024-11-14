import { FINES_MAC_COURT_DETAILS_STATE_MOCK } from '../../../fines-mac-court-details/mocks/fines-mac-court-details-state.mock';

import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR } from './mocks/fines-mac-payload-account-offences-with-major-creditor.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR } from './mocks/fines-mac-payload-account-offences-with-minor-creditor.mock';
import { buildAccountOffencesPayload } from './fines-mac-payload-account-offences.utils';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_OFFENCE_DETAILS_STATE } from './mocks/fines-mac-payload-account-offences-offence-details-state.mock';
import { FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_COURT_DETAILS_STATE_MOCK } from './mocks/fines-mac-payload-account-offences-court-details-state.mock';

describe('buildAccountOffencesPayload', () => {
  it('should build payload with impositions with a major creditor', () => {
    const offencesMockState = [{ ...FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_OFFENCE_DETAILS_STATE }];
    const courtDetailsState = { ...FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_COURT_DETAILS_STATE_MOCK };
    const results = buildAccountOffencesPayload(offencesMockState, courtDetailsState);
    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR);
  });

  it('should build payload with a minor creditor', () => {
    const offencesMockState = [
      {
        ...FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_OFFENCE_DETAILS_STATE,
        fm_offence_details_major_creditor_id: null,
        childFormData: [
          {
            formData: {
              fm_offence_details_minor_creditor_creditor_type: 'individual',
              fm_offence_details_minor_creditor_title: 'Mr',
              fm_offence_details_minor_creditor_forenames: 'Test',
              fm_offence_details_minor_creditor_surname: 'Test',
              fm_offence_details_minor_creditor_company_name: null,
              fm_offence_details_minor_creditor_address_line_1: 'Test',
              fm_offence_details_minor_creditor_address_line_2: 'Test2',
              fm_offence_details_minor_creditor_address_line_3: null,
              fm_offence_details_minor_creditor_post_code: 'SN254ED',
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

    const courtDetailsState = { ...FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_COURT_DETAILS_STATE_MOCK };
    const results = buildAccountOffencesPayload(offencesMockState, courtDetailsState);
    expect(results).toEqual(FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR);
  });
});
