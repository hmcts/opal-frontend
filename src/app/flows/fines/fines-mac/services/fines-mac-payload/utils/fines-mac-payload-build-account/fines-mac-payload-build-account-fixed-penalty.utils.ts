import { IFinesMacFixedPenaltyDetailsStoreState } from '../../../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { IFinesMacPayloadAcountFixedPenaltyDetails } from '../interfaces/fines-mac-payload-fixed-penalty-details-state.interface';

/**
 * Builds the fixed penalty details payload for fines MAC based on the provided state object.
 *
 * @param fixedPenaltyDetails - The state object containing fixed penalty details.
 * @returns The fixed penalty details payload section for fines MAC.
 */
export const finesMacPayloadBuildAccountFixedPenalty = (
  fixedPenaltyDetails: IFinesMacFixedPenaltyDetailsStoreState,
): IFinesMacPayloadAcountFixedPenaltyDetails => {
  const {
    fm_offence_details_notice_number: notice_number,
    fm_offence_details_date_nto_issued: date_of_issue,
    fm_offence_details_vehicle_registration_number: fp_registration_number,
    fm_offence_details_nto_nth: notice_to_owner_hirer,
    fm_offence_details_place_of_offence: place_of_offence,
    fm_offence_details_time_of_offence: time_of_issue,
    fm_offence_details_driving_licence_number: fp_driving_licence_number,
  } = fixedPenaltyDetails;

  return {
    notice_number,
    date_of_issue,
    time_of_issue,
    fp_registration_number,
    notice_to_owner_hirer,
    place_of_offence,
    fp_driving_licence_number,
  };
};
