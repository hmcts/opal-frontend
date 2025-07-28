import { finesMacPayloadBuildAccountFixedPenalty } from './fines-mac-payload-build-account-fixed-penalty.utils';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK } from '../../../../fines-mac-fixed-penalty-details/mocks/fines-mac-fixed-penalty-details-store-state.mock';
import { FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK } from '../mocks/state/fines-mac-payload-fixed-penalty-details-state.mock';
describe('finesMacPayloadBuildFixedPenaltyDetails', () => {
  it('should map all fields from state to payload', () => {
    const fixedPenaltyDetailsMock: IFinesMacFixedPenaltyDetailsStoreState =
      FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK;
    const fixedPenaltyDetailsPayloadMock: IFinesMacFixedPenaltyDetailsStoreState =
      FINES_MAC_PAYLOAD_FIXED_PENALTY_DETAILS_STATE_MOCK;

    const result = finesMacPayloadBuildAccountFixedPenalty(fixedPenaltyDetailsMock);

    expect(result).toEqual({
      notice_number: fixedPenaltyDetailsPayloadMock.fm_offence_details_notice_number,
      date_of_issue: fixedPenaltyDetailsPayloadMock.fm_offence_details_date_nto_issued,
      fp_registration_number: fixedPenaltyDetailsPayloadMock.fm_offence_details_vehicle_registration_number,
      notice_to_owner_hirer: fixedPenaltyDetailsPayloadMock.fm_offence_details_nto_nth,
      place_of_offence: fixedPenaltyDetailsPayloadMock.fm_offence_details_place_of_offence,
      time_of_issue: fixedPenaltyDetailsPayloadMock.fm_offence_details_time_of_offence,
      fp_driving_licence_number: fixedPenaltyDetailsPayloadMock.fm_offence_details_driving_licence_number,
    });
  });
});
