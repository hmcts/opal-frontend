import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacCourtDetailsForm } from '../interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_COURT_DETAILS_STATE } from './fines-mac-court-details-state';

export const FINES_MAC_COURT_DETAILS_FORM: IFinesMacCourtDetailsForm = {
  formData: FINES_MAC_COURT_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
