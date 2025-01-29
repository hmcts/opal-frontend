import { IFinesMacOffenceDetailsForm } from '../interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_STATE_MOCK } from './fines-mac-offence-details-state.mock';

export const FINES_MAC_OFFENCE_DETAILS_FORM_MOCK: IFinesMacOffenceDetailsForm = {
  formData: { ...FINES_MAC_OFFENCE_DETAILS_STATE_MOCK },
  nestedFlow: false,
  childFormData: null,
};
