import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { pastDateValidator } from '@validators/past-date/past-date.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_EARLIEST_RELEASE_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'earliest_release_date',
  validators: [optionalValidDateValidator(), pastDateValidator()],
};
