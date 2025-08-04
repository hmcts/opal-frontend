import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { TWO_DECIMAL_PLACES_PATTERN } from '@hmcts/opal-frontend-common/constants';

// regex pattern validator for two decimal places
const TWO_DECIMAL_PLACES_PATTERN_VALIDATOR = patternValidator(TWO_DECIMAL_PLACES_PATTERN, 'invalidDecimal');

export const FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_instalment_amount',
    validators: [Validators.required, TWO_DECIMAL_PLACES_PATTERN_VALIDATOR],
  },
  {
    controlName: 'fm_payment_terms_instalment_period',
    validators: [Validators.required],
  },
  {
    controlName: 'fm_payment_terms_start_date',
    validators: [Validators.required, optionalValidDateValidator()],
  },
];
