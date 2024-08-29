import { FINES_MAC_STATUS } from '../../constants';
import { IFinesMacContactDetailsForm } from '../interfaces';
import { FINES_MAC_CONTACT_DETAILS_STATE } from './fines-mac-contact-details-state';

export const FINES_MAC_CONTACT_DETAILS_FORM: IFinesMacContactDetailsForm = {
  formData: FINES_MAC_CONTACT_DETAILS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
