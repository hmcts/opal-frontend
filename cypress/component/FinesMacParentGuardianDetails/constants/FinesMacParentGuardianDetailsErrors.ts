export const FORMAT_CHECK: { [key: string]: string } = {
  dateOfBirthInFuture: 'Enter a valid date of birth in the past',
  dateOfBirthInvalid: 'Enter date of birth in the format DD/MM/YYYY',
  addressLine1ContainsSpecialCharacters: 'The address line 1 must not contain special characters',
  addressLine2ContainsSpecialCharacters: 'The address line 2 must not contain special characters',
  addressLine3ContainsSpecialCharacters: 'The address line 3 must not contain special characters',
  validNationalInsuranceNumber: 'Enter a National Insurance number in the format AANNNNNNA',
};

export const MAIN_PERSONAL_DETAILS: { [key: string]: string } = {
  missingFirstName: "Enter parent or guardian's first name(s)",
  missingLastName: "Enter parent or guardian's last name",
  missingAddressLine1: 'Enter address line 1, typically the building and street',
};

export const ALIAS_PERSONAL_DETAILS: { [key: string]: string } = {
  missingAlias: 'Enter first name(s) for alias',
  missingAliasLastName: 'Enter last name for alias',
};

export const LENGTH_VALIDATION: { [key: string]: string } = {
  firstNameTooLong: "The parent or guardian's first name(s) must be 20 characters or fewer",
  lastNameTooLong: "The parent or guardian's last name must be 30 characters or fewer",
  addressLine1TooLong: 'The address line 1 must be 25 characters or fewer',
  addressLine2TooLong: 'The address line 2 must be 25 characters or fewer',
  addressLine3TooLong: 'The address line 3 must be 13 characters or fewer',
  vehicleRegistrationTooLong: 'The registration number must be 11 characters or fewer',
};

export const CORRECTION_TEST_MESSAGES: { [key: string]: string } = {
  firstNameTooLong: "The parent or guardian's first name(s) must be 20 characters or fewer",
  lastNameTooLong: "The parent or guardian's last name must be 30 characters or fewer",
  addressLine1ContainsSpecialCharacters: 'The address line 1 must not contain special characters',
};
