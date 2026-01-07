import { IFinesMacOffenceDetailsState } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK } from './fines-mac-offence-details-state-impositions.mock';

export const FINES_MAC_OFFENCE_DETAILS_STATE_MOCK: IFinesMacOffenceDetailsState = {
  fm_offence_details_id: 0,
  fm_offence_details_date_of_sentence: '01/09/2024',
  fm_offence_details_offence_cjs_code: 'AK123456',
  fm_offence_details_offence_id: 123,
  fm_offence_details_impositions: structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK),
};
