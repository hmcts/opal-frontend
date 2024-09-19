import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { dateAfterYearValidator } from '@validators/date-after-year/date-after-year.validator';
import { futureDateValidator } from '@validators/future-date/future-date.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_COLLECTION_ORDER_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'collection_order_date',
  validators: [Validators.required, optionalValidDateValidator(), futureDateValidator(), dateAfterYearValidator(2003)],
};
