export const LENGTH_CHECK = {
  forenamesMaxLength: `The minor creditor's first name(s) must be 20 characters or fewer`,
  surnameMaxLength: `The minor creditor's last name must be 30 characters or fewer`,
  companyNameMaxLength: `The company name must be 50 characters or fewer`,
  addressLine1MaxLength: 'The address line 1 must be 30 characters or fewer',
  addressLine2MaxLength: 'The address line 2 must be 30 characters or fewer',
  addressLine3MaxLength: `The address line 3 must be 16 characters or fewer`,
  postCodeMaxLength: `The postcode must be 8 characters or fewer`,
  bankAccountNameMaxLength: 'Name on the account must be 18 characters or fewer',
  bankSortCodeMaxLength: 'Sort code must be 6 characters or fewer',
  bankAccountNumberMaxLength: 'Account number must be 8 characters or fewer',
  bankAccountRefMaxLength: 'Payment reference must be 18 characters or fewer',
};

export const FORMAT_CHECK = {
  bankAccountRefAlphabeticalTextPattern: 'Payment reference must only contain letters',
  bankAccountNumberNumericalTextPattern: 'Account number must only contain numbers',
  bankSortCodeNumericalTextPattern: 'Sort code must only contain numbers',
  surnameRequired: `Enter minor creditor's last name`,
  bankAccountNameAlphabeticalTextPattern: 'Name on account must only contain letters',
  addressLine3SpecialCharactersPattern: 'The address line 3 must not contain special characters',
  addressLine2SpecialCharactersPattern: 'The address line 2 must not contain special characters',
  addressLine1SpecialCharactersPattern: 'The address line 1 must not contain special characters',
  companyNameAlphabeticalTextPattern: `The company name must only contain alphabetical text`,
  surnameAlphabeticalTextPattern: `The minor creditor's last name must only contain alphabetical text`,
  forenamesAlphabeticalTextPattern: `The minor creditor's first name(s) must only contain alphabetical text`,
};

export const REQUIRED_FIELDS = {
  bankSortCodeRequired: 'Enter sort code',
  bankAccountRefRequired: 'Enter payment reference',
  bankAccountNumberRequired: 'Enter account number',
  bankAccountNameRequired: 'Enter name on the account',
  companyNameRequired: `Enter company name`,
  creditorTypeRequired: 'Select whether minor creditor is an individual or company',
};


