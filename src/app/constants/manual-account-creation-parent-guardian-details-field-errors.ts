export const MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_FIELD_ERROR = {
  fullName: {
    required: {
      message: 'You must enter a full name',
      priority: 1,
    },
    maxlength: {
      message: 'The full name must be 30 characters or fewer',
      priority: 2,
    },
  },
  dateOfBirth: {
    invalidDateFormat: {
      message: `Enter date of birth in the format DD/MM/YYYY`,
      priority: 1,
    },
    invalidDate: {
      message: `Enter a valid date of birth`,
      priority: 2,
    },
    invalidDateOfBirth: {
      message: `Enter a valid date of birth in the past`,
      priority: 3,
    },
  },
  nationalInsuranceNumber: {
    nationalInsuranceNumberPattern: {
      message: `Enter a National Insurance number that is 2 letters, 6 numbers, then A, B, C or D, like QQ 12 34 56 C`,
      priority: 1,
    },
  },
  addressLine1: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'The address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The address line 1 must not contain special characters',
      priority: 3,
    },
  },
  addressLine2: {
    maxlength: {
      message: 'The address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
  postcode: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
};
