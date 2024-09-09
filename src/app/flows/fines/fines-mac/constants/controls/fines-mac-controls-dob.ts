import { optionalValidDateValidator, dateOfBirthValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_DOB: IFinesMacFormControl = {
  fieldName: 'dob',
  validators: [optionalValidDateValidator(), dateOfBirthValidator()],
};
