import { finesMacPayloadBuildAccountBase } from './fines-mac-payload-build-account-fixed-penalty.utils';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK } from '../../../../fines-mac-fixed-penalty-details/mocks/fines-mac-fixed-penalty-details-store-state.mock';

describe('finesMacPayloadBuildAccountBase', () => {
  it('should map all fields from state to payload', () => {
    const fixedPenaltyDetails: IFinesMacFixedPenaltyDetailsStoreState =
      FINES_MAC_FIXED_PENALTY_DETAILS_STORE_STATE_MOCK;

    const result = finesMacPayloadBuildAccountBase(fixedPenaltyDetails);

    expect(result).toEqual({
      noticeNumber: fixedPenaltyDetails.fm_offence_details_notice_number,
      offenceType: fixedPenaltyDetails.fm_offence_details_offence_type,
      dateOfOffence: fixedPenaltyDetails.fm_offence_details_date_of_offence,
      offenceId: fixedPenaltyDetails.fm_offence_details_offence_id,
      offenceCjsCode: fixedPenaltyDetails.fm_offence_details_offence_cjs_code,
      timeOfOffence: fixedPenaltyDetails.fm_offence_details_time_of_offence,
      placeOfOffence: fixedPenaltyDetails.fm_offence_details_place_of_offence,
      amountImposed: fixedPenaltyDetails.fm_offence_details_amount_imposed,
      vehicleRegistrationNumber: fixedPenaltyDetails.fm_offence_details_vehicle_registration_number,
      drivingLicenceNumber: fixedPenaltyDetails.fm_offence_details_driving_licence_number,
      ntoNth: fixedPenaltyDetails.fm_offence_details_nto_nth,
      dateNtoIssued: fixedPenaltyDetails.fm_offence_details_date_nto_issued,
      issuingAuthorityId: fixedPenaltyDetails.fm_court_details_originator_id,
    });
  });

  it('should return undefined for missing fields', () => {
    const input = {} as IFinesMacFixedPenaltyDetailsStoreState;
    const result = finesMacPayloadBuildAccountBase(input);

    expect(result).toEqual({
      noticeNumber: undefined,
      offenceType: undefined,
      dateOfOffence: undefined,
      offenceId: undefined,
      offenceCjsCode: undefined,
      timeOfOffence: undefined,
      placeOfOffence: undefined,
      amountImposed: undefined,
      vehicleRegistrationNumber: undefined,
      drivingLicenceNumber: undefined,
      ntoNth: undefined,
      dateNtoIssued: undefined,
      issuingAuthorityId: undefined,
    });
  });
});
