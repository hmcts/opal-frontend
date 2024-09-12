import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacCompanyDetailsForm } from '../interfaces/fines-mac-company-details-form.interface';
import { FINES_MAC_COMPANY_DETAILS_STATE } from './fines-mac-company-details-state';

export const FINES_MAC_COMPANY_DETAILS_FORM: IFinesMacCompanyDetailsForm = {
  formData: FINES_MAC_COMPANY_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
