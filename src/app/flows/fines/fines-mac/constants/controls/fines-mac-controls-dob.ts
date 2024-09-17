import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { dateOfBirthValidator } from '@validators/date-of-birth/date-of-birth.validator';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_DOB: IAbstractFormArrayControlValidation = {
  controlName: 'dob',
  validators: [optionalValidDateValidator(), dateOfBirthValidator()],
};
