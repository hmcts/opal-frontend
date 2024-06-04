export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS_FIELD_ERROR = {
  firstNames: {
    required: {
      message: `Enter defendant's alias first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's alias first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's alias first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  lastName: {
    required: {
      message: `Enter defendant's alias last name`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's alias last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's alias last name must only contain alphabetical text`,
      priority: 2,
    },
  },
};
