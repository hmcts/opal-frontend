import { finesMacPayloadBuildAccountFixedPenalty } from './fines-mac-payload-build-account-fixed-penalty.utils';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK } from '../../../../fines-mac-fixed-penalty-details/mocks/fines-mac-fixed-penalty-details-store-state.mock';
function toRfc3339Date(date: string | null): string | null {
  if (date === null) {
    return null;
  }
  return '2025-01-01';
}
describe('finesMacPayloadBuildAccountBase', () => {
  it('should map all fields from state to payload', () => {
    const fixedPenaltyDetails: IFinesMacFixedPenaltyDetailsStoreState =
      FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK;

    const result = finesMacPayloadBuildAccountFixedPenalty(fixedPenaltyDetails, toRfc3339Date);

    expect(result).toEqual({
      notice_number: fixedPenaltyDetails.fm_offence_details_notice_number,
      date_of_issue: fixedPenaltyDetails.fm_offence_details_date_nto_issued,
      fp_registration_number: fixedPenaltyDetails.fm_offence_details_vehicle_registration_number,
      notice_to_owner_hirer: fixedPenaltyDetails.fm_offence_details_nto_nth,
      place_of_offence: fixedPenaltyDetails.fm_offence_details_place_of_offence,
      time_of_issue: fixedPenaltyDetails.fm_offence_details_time_of_offence,
      fp_driving_licence_number: fixedPenaltyDetails.fm_offence_details_driving_licence_number,
    });
  });
});

