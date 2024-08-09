export const FINES_MAC__PARENT_GUARDIAN_DETAILS_FIELD_ERROR = {
  FullName: {
    required: {
      message: 'You must enter a full name',
      priority: 1,
    },
    maxlength: {
      message: 'The full name must be 30 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The full name must only contain alphabetical text`,
      priority: 2,
    },
  },
};
