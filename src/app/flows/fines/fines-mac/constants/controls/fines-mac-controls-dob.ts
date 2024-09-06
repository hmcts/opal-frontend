import { optionalValidDateValidator, dateOfBirthValidator } from '@validators';

export const FINES_MAC_CONTROLS_DOB = {
  controlName: 'dob',
  initialValue: null,
  validators: [optionalValidDateValidator(), dateOfBirthValidator()],
};
