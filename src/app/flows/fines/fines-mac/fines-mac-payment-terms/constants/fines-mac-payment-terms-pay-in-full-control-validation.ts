import { Validators } from '@angular/forms';
import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from '../interfaces';
import { optionalValidDateValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_PAY_IN_FULL_CONTROL_VALIDATION: IFinesMacPaymentTermsPaymentTermOptionsControlValidation[] =
  [
    {
      controlName: 'pay_by_date',
      validators: [Validators.required, optionalValidDateValidator()],
    },
  ];
