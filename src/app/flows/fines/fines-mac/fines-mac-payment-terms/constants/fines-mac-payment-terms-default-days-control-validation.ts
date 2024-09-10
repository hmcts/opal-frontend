import { Validators } from '@angular/forms';
import { dateOfBirthValidator, optionalValidDateValidator, numericalTextValidator } from '@validators';
import { IFinesMacPaymentTermsDefaultDaysControlValidation } from '../interfaces/';

export const FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION: IFinesMacPaymentTermsDefaultDaysControlValidation[] =
  [
    {
      controlName: 'days_in_default_date',
      validators: [Validators.required, dateOfBirthValidator(), optionalValidDateValidator()],
    },
    {
      controlName: 'days_in_default',
      validators: [Validators.required, Validators.maxLength(5), numericalTextValidator()],
    },
  ];
