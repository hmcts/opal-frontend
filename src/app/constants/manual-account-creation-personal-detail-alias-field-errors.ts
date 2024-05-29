export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS_FIELD_ERROR = {
  firstName: {
    required: {
      message: `Enter first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  lastName: {
    required: {
      message: `Enter surname(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
};
