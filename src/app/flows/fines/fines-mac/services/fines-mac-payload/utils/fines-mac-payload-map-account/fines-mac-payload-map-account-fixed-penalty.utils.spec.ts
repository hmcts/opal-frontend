import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_STATE } from '../../../../constants/fines-mac-state';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK } from '../../mocks/fines-mac-payload-add-account-fixed-penalty.mock';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_FORM_MOCK } from '../../../../fines-mac-fixed-penalty-details/mocks/fines-mac-fixed-penalty-details-store-form.mock';
import { finesMacPayloadMapAccountFixedPenalty } from './fines-mac-payload-map-account-fixed-penalty.utils';
import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

const cjsCodes: IOpalFinesOffencesNonSnakeCase[] = [
  { offenceId: 12345, cjsCode: 'CJS12345' },
] as IOpalFinesOffencesNonSnakeCase[];

describe('finesMacPayloadMapAccountFixedPenalty', () => {
  let initialState: IFinesMacState | null;
  beforeEach(() => {
    initialState = structuredClone(FINES_MAC_STATE);
  });

  afterAll(() => {
    initialState = null;
  });

  it('should map fixed penalty details to the state correctly when offence codes are provided', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }
    const expectedFixedPenaltyState = structuredClone(FINES_MAC_FIXED_PENALTY_DETAILS_STORE_FORM_MOCK);

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK);

    const result = finesMacPayloadMapAccountFixedPenalty(initialState, payload, cjsCodes);
    // Mock Date and Time transformation
    result.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '12/12/2024';
    result.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = '12/12/2024';
    result.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '10:12';

    expect(result.fixedPenaltyDetails).toEqual(expectedFixedPenaltyState);
  });

  it('should map fixed penalty details to the state correctly when offence codes are not provided', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const expectedFixedPenaltyState = structuredClone(FINES_MAC_FIXED_PENALTY_DETAILS_STORE_FORM_MOCK);
    expectedFixedPenaltyState.formData.fm_offence_details_offence_cjs_code = null; // No CJS code provided

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK);

    const result = finesMacPayloadMapAccountFixedPenalty(initialState, payload, null);
    // Mock Date and Time transformation
    result.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '12/12/2024';
    result.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = '12/12/2024';
    result.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '10:12';

    expect(result.fixedPenaltyDetails).toEqual(expectedFixedPenaltyState);
  });

  it('should map fixed penalty details to the state correctly when offence type is not vehicle', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const expectedFixedPenaltyState = structuredClone(FINES_MAC_FIXED_PENALTY_DETAILS_STORE_FORM_MOCK);
    expectedFixedPenaltyState.formData.fm_offence_details_vehicle_registration_number = null; // No vehicle registration number provided
    expectedFixedPenaltyState.formData.fm_offence_details_offence_type = 'non-vehicle';

    const payload: IFinesMacAddAccountPayload = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK);
    if (payload.account.fp_ticket_detail) {
      payload.account.fp_ticket_detail.fp_registration_number = null; // Simulate non-vehicle offence type
    }

    const result = finesMacPayloadMapAccountFixedPenalty(initialState, payload, cjsCodes);
    // Mock Date and Time transformation
    result.fixedPenaltyDetails.formData.fm_offence_details_date_of_offence = '12/12/2024';
    result.fixedPenaltyDetails.formData.fm_offence_details_date_nto_issued = '12/12/2024';
    result.fixedPenaltyDetails.formData.fm_offence_details_time_of_offence = '10:12';

    expect(result.fixedPenaltyDetails).toEqual(expectedFixedPenaltyState);
  });
});
