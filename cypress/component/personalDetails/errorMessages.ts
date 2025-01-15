export const PERSONAL_DETAILS_MISSING_ERRORS: { [key: string]: string } = {
  missingTitle: 'Select a title',
  missingFirstName: "Enter defendant's first name(s)",
  missingLastName: "Enter defendant's last name",
  missingAddressLine1: 'Enter address line 1, typically the building and street',
  missingAlias: 'Enter first name(s) for alias',
  missingAliasLastName: 'Enter last name for alias',
};

export const PERSONAL_DETAILS_INVALID_ERRORS: { [key: string]: string } = {
  dateOfBirthInFuture: 'Enter a valid date of birth in the past',
  dateOfBirthInvalid: 'Enter date of birth in the format DD/MM/YYYY',
  invalidNationalInsuranceNumber: 'Enter a National Insurance number in the format AANNNNNNA',
};

export const PERSONAL_DETAILS_LENGTH_ERRORS: { [key: string]: string } = {
  firstNameTooLong: "The defendant's first name(s) must be 20 characters or fewer",
  lastNameTooLong: "The defendant's last name must be 30 characters or fewer",
  addressLine1TooLong: 'The address line 1 must be 30 characters or fewer',
  addressLine2TooLong: 'The address line 2 must be 30 characters or fewer',
  addressLine3TooLong: 'The address line 3 must be 16 characters or fewer',
};

export const PERSONAL_DETAILS_SPECIAL_CHARACTER_ERRORS: { [key: string]: string } = {
  addressLine1ContainsSpecialCharacters: 'The address line 1 must not contain special characters',
  addressLine2ContainsSpecialCharacters: 'The address line 2 must not contain special characters',
  addressLine3ContainsSpecialCharacters: 'The address line 3 must not contain special characters',
};
