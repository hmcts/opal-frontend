import { FINES_MAC_STATUS } from '../../constants';
import { IFinesMacPersonalDetailsForm } from '../interfaces';
import { FINES_MAC_PERSONAL_DETAILS_STATE } from './fines-mac-personal-details-state';

export const FINES_MAC_PERSONAL_DETAILS_FORM: IFinesMacPersonalDetailsForm = {
  formData: FINES_MAC_PERSONAL_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
