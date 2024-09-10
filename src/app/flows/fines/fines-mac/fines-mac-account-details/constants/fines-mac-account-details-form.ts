import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacAccountDetailsForm } from '../interfaces/fines-mac-account-details-form.interface';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from './fines-mac-account-details-state';

export const FINES_MAC_ACCOUNT_DETAILS_FORM: IFinesMacAccountDetailsForm = {
  formData: FINES_MAC_ACCOUNT_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
