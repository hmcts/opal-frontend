import { IFinesMacOffenceDetailsDraftState } from '../interfaces/fines-mac-offence-details-draft-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from './fines-mac-offence-details-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK } from './fines-mac-offence-details-remove-imposition.mock';

export const FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK: IFinesMacOffenceDetailsDraftState = {
  offenceDetailsDraft: [FINES_MAC_OFFENCE_DETAILS_FORM_MOCK],
  removeImposition: FINES_MAC_OFFENCE_DETAILS_REMOVE_IMPOSITION_MOCK,
};
