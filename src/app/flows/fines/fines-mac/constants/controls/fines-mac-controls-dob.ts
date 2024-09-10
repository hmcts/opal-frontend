import { optionalValidDateValidator, dateOfBirthValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_DOB: IAbstractFormArrayControlValidation = {
  controlName: 'dob',
  validators: [optionalValidDateValidator(), dateOfBirthValidator()],
};
