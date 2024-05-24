export const MANUAL_ACCOUNT_CREATION_EMPLOYER_DETAILS_FIELD_ERROR = {
    employerName: {
      required: {
        message: 'Enter employer name',
        priority: 1,
      },
      maxlength: {
        message: 'The employer name must be 35 characters or fewer',
        priority: 2,
      },
    },
    employeeReference: {
      required: {
        message: 'Enter employee reference or National Insurance number',
        priority: 1,
      },
      maxlength: {
        message: 'The employee reference must be 20 characters or fewer',
        priority: 2,
      },
    },
    employerEmailAddress: {
      maxlength: {
        message: 'The employer email address must be 76 characters or fewer',
        priority: 2,
      },
      emailPattern: {
        message: 'Enter employer email address in the correct format like, name@example.com',
        priority: 2,
      },
    },
    employerTelephone: {
      maxlength: {
        message: 'Enter employer telephone number in the correct format',
        priority: 1,
      },
      phoneNumberPattern: {
        message: 'Enter employer telephone number in the correct format',
        priority: 2,
      },
    },
    employerAddress1: {
      required: {
        message: 'Enter address line 1, typically the building and street',
        priority: 1,
      },
      maxlength: {
        message: 'The employer address line 1 must be 30 characters or fewer',
        priority: 2,
      },
      specialCharactersPattern: {
        message: 'The employer address line 1 must not contain special characters',
        priority: 3,
      },
    },
    employerAddress2: {
      maxlength: {
        message: 'The employer address line 2 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 2 must not contain special characters',
        priority: 2,
      },
    },
    employerAddress3: {
      maxlength: {
        message: 'The employer address line 3 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 3 must not contain special characters',
        priority: 2,
      },
    },
    employerAddress4: {
      maxlength: {
        message: 'The employer address line 4 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 4 must not contain special characters',
        priority: 2,
      },
    },
    employerAddress5: {
      maxlength: {
        message: 'The employer address line 5 must be 30 characters or fewer',
        priority: 1,
      },
      specialCharactersPattern: {
        message: 'The employer address line 5 must not contain special characters',
        priority: 2,
      },
    },
    employerPostcode: {
      maxlength: {
        message: 'The employer postcode must be 8 characters or fewer',
        priority: 1,
      },
    },
}