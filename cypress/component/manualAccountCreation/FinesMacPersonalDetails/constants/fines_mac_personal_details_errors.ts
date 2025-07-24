export const FORMAT_CHECK: { [key: string]: string } = {
  dateOfBirthInFuture: 'Enter a valid date of birth in the past',
  dateOfBirthInvalid: 'Enter date of birth in the format DD/MM/YYYY',
  addressLine1ContainsSpecialCharacters: 'Address line 1 must only contain letters or numbers',
  addressLine2ContainsSpecialCharacters: 'Address line 2 must only contain letters or numbers',
  addressLine3ContainsSpecialCharacters: 'Address line 3 must only contain letters or numbers',
  validNationalInsuranceNumber: 'Enter a National Insurance number in the format AANNNNNNA',
};

export const MAIN_PERSONAL_DETAILS = {
  missingTitle: 'Select a title',
  missingFirstName: "Enter defendant's first name(s)",
  missingLastName: "Enter defendant's last name",
  missingAddressLine1: 'Enter address line 1, typically the building and street',
};

export const ALIAS_PERSONAL_DETAILS = {
  missingAliasFirstNameOne: 'Enter alias 1 first name(s)',
  missingAliasFirstNameTwo: 'Enter alias 2 first name(s)',
  missingAliasFirstNameThree: 'Enter alias 3 first name(s)',
  missingAliasFirstNameFour: 'Enter alias 4 first name(s)',
  missingAliasFirstNameFive: 'Enter alias 5 first name(s)',
  missingAliasLastNameOne: 'Enter alias 1 last name',
  missingAliasLastNameTwo: 'Enter alias 2 last name',
  missingAliasLastNameThree: 'Enter alias 3 last name',
  missingAliasLastNameFour: 'Enter alias 4 last name',
  missingAliasLastNameFive: 'Enter alias 5 last name',
};

export const LENGTH_VALIDATION = {
  firstNameTooLong: "Defendant's first name(s) must be 20 characters or fewer",
  lastNameTooLong: "Defendant's last name must be 30 characters or fewer",
  addressLine1TooLong: 'Address line 1 must be 30 characters or fewer',
  addressLine2TooLong: 'Address line 2 must be 30 characters or fewer',
  addressLine3TooLong: 'Address line 3 must be 16 characters or fewer',
};

export const CORRECTION_TEST_MESSAGES = {
  missingTitle: 'Select a title',
  firstNameTooLong: "Defendant's first name(s) must be 20 characters or fewer",
  lastNameTooLong: "Defendant's last name must be 30 characters or fewer",
  addressLine1ContainsSpecialCharacters: 'Address line 1 must only contain letters or numbers',
};

export const VEHICLE_DETAILS_ERRORS = {
  vehicleMake: 'Make and model must be 30 characters or fewer',
  vehicleRegistration: 'Registration number must be 11 characters or fewer',
};
