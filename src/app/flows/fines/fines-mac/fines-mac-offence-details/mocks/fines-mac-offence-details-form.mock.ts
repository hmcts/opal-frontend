import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_STATE_MOCK } from './fines-mac-offence-details-state.mock';

export const FINES_MAC_OFFENCE_DETAILS_FORM_MOCK: IFinesMacOffenceDetailsForm = {
  formData: { ...FINES_MAC_OFFENCE_DETAILS_STATE_MOCK },
  nestedFlow: false,
  status: FINES_MAC_STATUS.PROVIDED,
  childFormData: null,
};
