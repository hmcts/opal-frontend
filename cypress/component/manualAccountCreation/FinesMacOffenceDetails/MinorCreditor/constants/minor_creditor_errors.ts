export const LENGTH_CHECK = {
  forenamesMaxLength: `First name(s) must be 20 characters or fewer`,
  surnameMaxLength: `Last name must be 30 characters or fewer`,
  companyNameMaxLength: `Company name must be 50 characters or fewer`,
  addressLine1MaxLength: 'Address line 1 must be 30 characters or fewer',
  addressLine2MaxLength: 'Address line 2 must be 30 characters or fewer',
  addressLine3MaxLength: `Address line 3 must be 16 characters or fewer`,
  postCodeMaxLength: `Postcode must be 8 characters or fewer`,
  bankAccountNameMaxLength: 'Name on the account must be 18 characters or fewer',
  bankSortCodeMaxLength: 'Sort code must be 6 characters or fewer',
  bankAccountNumberMaxLength: 'Account number must be 8 characters or fewer',
  bankAccountRefMaxLength: 'Payment reference must be 18 characters or fewer',
};

export const FORMAT_CHECK = {
  bankAccountRefAlphabeticalTextPattern: 'Payment reference must only contain letters',
  bankAccountNumberNumericalTextPattern: 'Account number must only contain numbers',
  bankSortCodeNumericalTextPattern: 'Sort code must only contain numbers',
  surnameRequired: `Enter last name`,
  bankAccountNameAlphabeticalTextPattern: 'Name on account must only contain letters',
  addressLine1SpecialCharactersPattern: 'Address line 1 must only contain letters or numbers',
  addressLine2SpecialCharactersPattern: 'Address line 2 must only contain letters or numbers',
  addressLine3SpecialCharactersPattern: 'Address line 3 must only contain letters or numbers',
  companyNameAlphabeticalTextPattern: `Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
  surnameAlphabeticalTextPattern: `Last name must only contain letters`,
  forenamesAlphabeticalTextPattern: `First name(s) must only contain letters`,
};

export const REQUIRED_FIELDS = {
  bankSortCodeRequired: 'Enter sort code',
  bankAccountRefRequired: 'Enter payment reference',
  bankAccountNumberRequired: 'Enter account number',
  bankAccountNameRequired: 'Enter name on the account',
  companyNameRequired: `Enter company name`,
  creditorTypeRequired: 'Select whether minor creditor is an individual or company',
  individualTitleRequired: 'Select title',
  individualFirstNameRequired: 'Enter first name(s)',
  individualLastNameRequired: 'Enter last name',
};
