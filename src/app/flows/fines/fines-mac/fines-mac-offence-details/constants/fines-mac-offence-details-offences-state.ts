import { IFinesMacOffenceDetailsOffenceState } from '../interfaces/fines-mac-offence-details-offence-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_STATE } from './fines-mac-offence-details-impositions-state';

export const FINES_MAC_OFFENCE_DETAILS_OFFENCES_STATE: IFinesMacOffenceDetailsOffenceState = {
  date_of_offence: null,
  offence_code: null,
  impositions: FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_STATE,
};
