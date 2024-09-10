import { Validators } from '@angular/forms';
import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from '../interfaces';
import { optionalValidDateValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION: IFinesMacPaymentTermsPaymentTermOptionsControlValidation[] =
  [
    {
      controlName: 'instalment',
      validators: [Validators.required],
    },
    {
      controlName: 'frequency',
      validators: [Validators.required],
    },
    {
      controlName: 'start_date',
      validators: [Validators.required, optionalValidDateValidator()],
    },
  ];
