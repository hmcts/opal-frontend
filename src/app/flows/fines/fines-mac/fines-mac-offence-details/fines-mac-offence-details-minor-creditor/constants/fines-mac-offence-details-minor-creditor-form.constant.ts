import { FINES_MAC_STATUS } from '../../../constants/fines-mac-status';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from './fines-mac-offence-details-minor-creditor-state.constant';

export const FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM: IFinesMacOffenceDetailsMinorCreditorForm = {
  formData: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
