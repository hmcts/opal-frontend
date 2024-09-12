import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { FINES_MAC_EMPLOYER_DETAILS_STATE } from './fines-mac-employer-details-state';

export const FINES_MAC_EMPLOYER_DETAILS_FORM: IFinesMacEmployerDetailsForm = {
  formData: FINES_MAC_EMPLOYER_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
