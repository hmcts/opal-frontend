import { Validators } from '@angular/forms';
import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from '../interfaces';
import { FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION } from './fines-mac-payment-terms-instalments-only-control-validation';

export const FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION: IFinesMacPaymentTermsPaymentTermOptionsControlValidation[] =
  [
    {
      controlName: 'lumpSum',
      validators: [Validators.required],
    },
    ...FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION,
  ];
