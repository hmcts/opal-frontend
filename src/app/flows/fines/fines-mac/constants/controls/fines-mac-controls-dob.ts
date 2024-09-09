import { optionalValidDateValidator, dateOfBirthValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_DOB: IFlowFormControl = {
  fieldName: 'dob',
  validators: [optionalValidDateValidator(), dateOfBirthValidator()],
};
