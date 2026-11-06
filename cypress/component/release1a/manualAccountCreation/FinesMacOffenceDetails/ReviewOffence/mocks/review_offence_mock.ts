import { IFinesMacOffenceDetailsForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_STATE_MOCK } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/mocks/fines-mac-offence-details-state.mock';

export const FINES_MAC_OFFENCE_DETAILS_FORM_MOCK: IFinesMacOffenceDetailsForm = {
  formData: { ...FINES_MAC_OFFENCE_DETAILS_STATE_MOCK },
  nestedFlow: false,
  childFormData: null,
};
