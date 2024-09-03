import { FINES_MAC_STATUS } from '../../constants';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE } from './fines-mac-parent-guardian-details-state';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM: IFinesMacParentGuardianDetailsForm = {
  formData: FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
