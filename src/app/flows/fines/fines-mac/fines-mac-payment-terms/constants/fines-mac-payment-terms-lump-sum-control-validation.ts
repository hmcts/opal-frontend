import { FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION as FM_PAYMENT_TERMS_INSTALMENT_AMOUNT_CONTROLS } from './fines-mac-payment-terms-instalments-only-control-validation';
import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { TWO_DECIMAL_PLACES_PATTERN } from '@hmcts/opal-frontend-common/constants';

// regex pattern validator for two decimal places
const TWO_DECIMAL_PLACES_PATTERN_VALIDATOR = patternValidator(TWO_DECIMAL_PLACES_PATTERN, 'invalidDecimal');

export const FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_lump_sum_amount',
    validators: [Validators.required, TWO_DECIMAL_PLACES_PATTERN_VALIDATOR],
  },
  ...FM_PAYMENT_TERMS_INSTALMENT_AMOUNT_CONTROLS,
];
