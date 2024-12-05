import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';

export const finesMacPayloadMapAccountOffences = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const accountOffencesPayload = payload.account.offences;

  accountOffencesPayload?.forEach((offence) => {
    const formData = '';
    // For each offence we need to create a new form data object
    const offenceDetails = {
      fm_offence_details_id: offence.offence_id,
      fm_offence_details_date_of_sentence: offence.date_of_sentence,
      fm_offence_details_offence_id: offence.offence_id,
      fm_offence_details_impositions: [],
    };
  });

  return mappedFinesMacState;
};
