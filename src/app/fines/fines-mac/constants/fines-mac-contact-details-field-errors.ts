export const FINES_MAC_CONTACT_DETAILS_FIELD_ERROR = {
  primaryEmailAddress: {
    maxlength: {
      message: 'The primary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter primary email address in the correct format like, name@example.com',
      priority: 2,
    },
  },
  secondaryEmailAddress: {
    maxlength: {
      message: 'The secondary email address must be 76 characters or fewer',
      priority: 1,
    },
    emailPattern: {
      message: 'Enter secondary email address in the correct format like, name@example.com',
      priority: 2,
    },
  },
  mobileTelephoneNumber: {
    maxlength: {
      message: 'Enter a mobile telephone number, like 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a mobile telephone number, like 07700 900 982',
      priority: 2,
    },
  },
  homeTelephoneNumber: {
    maxlength: {
      message: 'Enter a home telephone number, like 01632 960 001',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a home telephone number, like 01632 960 001',
      priority: 2,
    },
  },
  workTelephoneNumber: {
    maxlength: {
      message: 'Enter a work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 1,
    },
    phoneNumberPattern: {
      message: 'Enter a work telephone number, like 01632 960 001 or 07700 900 982',
      priority: 2,
    },
  },
};
