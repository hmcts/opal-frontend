import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';

/**
 * Maps the fixed penalty payload data to the fines MAC state.
 *
 * @param fixedPenaltyDetailsState - The current state of fines MAC fixed penalty details.
 * @param payload - The payload containing account details to be mapped.
 * @returns The updated fines MAC state with the new account details.
 *
 * @remarks
 * This function updates the following sections of the fines MAC state:
 * - Fixed Penalty Details
 */
export const finesMacPayloadMapAccountFixedPenalty = (
  finesMacstate: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
  offencesRefData: IOpalFinesOffencesNonSnakeCase[] | null,
): IFinesMacState => {
  const { account: payloadAccount } = payload;
  const fp_ticket_detail = payloadAccount.fp_ticket_detail;
  const offence = payloadAccount.offences?.[0];

  if (fp_ticket_detail && offence?.impositions) {
    let offenceRefData;
    if (offencesRefData) {
      offenceRefData = offencesRefData.find((refData) => refData.offenceId === offence.offence_id);
    }

    // Update fixed penalty details
    finesMacstate.fixedPenaltyDetails.formData = {
      fm_offence_details_amount_imposed: offence.impositions?.[0].amount_imposed,
      fm_offence_details_date_of_offence: offence.date_of_sentence,
      fm_offence_details_offence_id: offence.offence_id,
      fm_offence_details_date_nto_issued: fp_ticket_detail.date_of_issue,
      fm_offence_details_time_of_offence: fp_ticket_detail.time_of_issue,
      fm_offence_details_notice_number: fp_ticket_detail.notice_number,
      fm_offence_details_place_of_offence: fp_ticket_detail.place_of_offence,
      fm_offence_details_vehicle_registration_number: fp_ticket_detail.fp_registration_number,
      fm_offence_details_driving_licence_number: fp_ticket_detail.fp_driving_licence_number,
      fm_offence_details_nto_nth: fp_ticket_detail.notice_to_owner_hirer,
      fm_offence_details_offence_type: fp_ticket_detail.fp_registration_number ? 'vehicle' : 'non-vehicle',
      fm_offence_details_offence_cjs_code: offenceRefData ? offenceRefData.cjsCode : null,
    };
  }

  return finesMacstate;
};
