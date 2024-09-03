import { FINES_MAC_STATUS } from '../../constants';
import { IFinesMacEmployerDetailsForm } from '../interfaces';
import { FINES_MAC_EMPLOYER_DETAILS_STATE } from './fines-mac-employer-details-state';

export const FINES_MAC_EMPLOYER_DETAILS_FORM: IFinesMacEmployerDetailsForm = {
  formData: FINES_MAC_EMPLOYER_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
