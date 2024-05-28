export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_FIELD_ERROR = {
  title: {
    required: {
      message: 'Select a title',
      priority: 1,
    },
  },
  firstNames: {
    required: {
      message: `Enter defendant's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's first name(s) must only contain alphabetical text`,
      priority: 2,
    }
  },
  lastName: {
    required: {
      message: `Enter defendant's last name`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's first name(s) must only contain alphabetical text`,
      priority: 2,
    }
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
    }
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
      message: `The address line 1 must be 30 characters or fewer`,
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The address line 1 must not contain special characters',
      priority: 3,
    },
  },
  addressLine2: {
    maxlength: {
      message: `The address line 2 must be 30 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
  addressLine3: {
    maxlength: {
      message: `The address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 3 must not contain special characters',
      priority: 2,
    },
  },
  postcode: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
  makeOfCar: {
    maxlength: {
      message: `The make of car must be 30 characters or fewer`,
      priority: 1,
    },
  },
  registrationNumber: {
    maxlength: {
      message: `The registration number must be 11 characters or fewer`,
      priority: 1,
    },
  },
};
