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
  toRfc3339Date: (date: string | null) => string | null,
): IFinesMacPayloadAcountFixedPenaltyDetails => {
  const {
    fm_offence_details_notice_number: ticket_number,
    fm_offence_details_date_nto_issued: issued_date,
    fm_offence_details_vehicle_registration_number: vehicle_registration,
    fm_offence_details_nto_nth: notice_number,
    fm_offence_details_place_of_offence: offence_location,
    fm_offence_details_date_of_offence: offence_date,
    fm_offence_details_time_of_offence: offence_time,
    fm_offence_details_driving_licence_number: licence_number,
    // fm_offence_details_offence_type: offence_type,
    // fm_offence_details_offence_id: offence_id,
    // fm_offence_details_offence_cjs_code: offence_cjs_code,
    // fm_offence_details_amount_imposed: amount_imposed,
    // fm_court_details_originator_id: originator_id,
  } = fixedPenaltyDetails;

  return {
    ticket_number,
    issued_date: toRfc3339Date(issued_date),
    vehicle_registration,
    notice_number,
    offence_location,
    offence_date: toRfc3339Date(offence_date),
    offence_time,
    licence_number,
  };
};
