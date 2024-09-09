import { FINES_MAC_STATUS } from '../../constants';
import { IFinesMacOffenceDetailsForm } from '../interfaces';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from './fines-mac-offence-details-state';

export const FINES_MAC_OFFENCE_DETAILS_FORM: IFinesMacOffenceDetailsForm = {
  formData: FINES_MAC_OFFENCE_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};