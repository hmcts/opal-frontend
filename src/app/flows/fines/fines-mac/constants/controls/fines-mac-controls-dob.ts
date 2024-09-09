import { optionalValidDateValidator, dateOfBirthValidator } from '@validators';

export const FINES_MAC_CONTROLS_DOB = {
  fieldName: 'dob',
  validators: [optionalValidDateValidator(), dateOfBirthValidator()],
};
