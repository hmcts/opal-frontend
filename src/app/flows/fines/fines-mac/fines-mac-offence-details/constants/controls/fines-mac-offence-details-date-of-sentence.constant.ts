import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { futureDateValidator } from '@validators/future-date/future-date.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';

export const FINES_MAC_OFFENCE_DETAILS_CONTROLS_DATE_OF_SENTENCE: IAbstractFormArrayControlValidation = {
  controlName: 'date_of_sentence',
  validators: [Validators.required, optionalValidDateValidator(), futureDateValidator()],
};
