export const FIELD_ERROR_MOCK = {
  court: {
    required: {
      message: 'Select a court from the dropdown',
      priority: 1,
    },
  },
  dayOfMonth: {
    required: {
      message: 'The date of birth must include a day',
      priority: 1,
    },
    maxlength: {
      message: 'The date of birth day must be 2 characters or fewer',
      priority: 2,
    },
    underEighteen: {
      message: 'You need to be older than 18 years old',
      priority: 3,
    },
  },
  monthOfYear: {
    required: {
      message: 'The date of birth must include a month',
      priority: 1,
    },
    underEighteen: {
      message: 'You need to be older than 18 years old',
      priority: 3,
    },
  },
  year: {
    required: {
      message: 'The date of birth must include a year',
      priority: 1,
    },
    underEighteen: {
      message: 'You need to be older than 18 years old',
      priority: 3,
    },
  },
};
