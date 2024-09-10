import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { IFinesMacPaymentTermsForm } from '../interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_PAYMENT_TERMS_STATE } from './fines-mac-payment-terms-state';

export const FINES_MAC_PAYMENT_TERMS_FORM: IFinesMacPaymentTermsForm = {
  formData: FINES_MAC_PAYMENT_TERMS_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
