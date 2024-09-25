import { IFinesMacCourtDetailsState } from '../interfaces/fines-mac-court-details-state.interface';
import { FINES_MAC_COURT_DETAILS_CONTROLS_SENDING_COURT as F_M_COURT_DETAILS_SENDING_COURT } from '../constants/controls/fines-mac-court-details-controls-sending-court';
import { FINES_MAC_COURT_DETAILS_CONTROLS_PROSECUTOR_COURT_REFERENCE as F_M_COURT_DETAILS_PROSECUTOR_COURT_REFERENCE } from '../constants/controls/fines-mac-court-details-controls-prosecutor-case-reference';
import { FINES_MAC_COURT_DETAILS_CONTROLS_ENFORCING_COURT as F_M_COURT_DETAILS_ENFORCING_COURT } from '../constants/controls/fines-mac-court-details-controls-enforcing-court';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state';

export const FINES_MAC_COURT_DETAILS_STATE: IFinesMacFormState = {
  [F_M_COURT_DETAILS_SENDING_COURT.controlName]: null,
  [F_M_COURT_DETAILS_PROSECUTOR_COURT_REFERENCE.controlName]: null,
  [F_M_COURT_DETAILS_ENFORCING_COURT.controlName]: null,
};
