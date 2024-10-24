import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from './fines-mac-offence-details-state.constant';

export const FINES_MAC_OFFENCE_DETAILS_FORM: IFinesMacOffenceDetailsForm[] = [
  {
    formData: FINES_MAC_OFFENCE_DETAILS_STATE,
    nestedFlow: false,
    status: FINES_MAC_STATUS.NOT_PROVIDED,
  },
];
