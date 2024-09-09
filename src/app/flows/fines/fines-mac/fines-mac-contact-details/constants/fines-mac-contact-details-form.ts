import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacContactDetailsForm } from '../interfaces/fines-mac-contact-details-form.interface';
import { FINES_MAC_CONTACT_DETAILS_STATE } from './fines-mac-contact-details-state';

export const FINES_MAC_CONTACT_DETAILS_FORM: IFinesMacContactDetailsForm = {
  formData: FINES_MAC_CONTACT_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
