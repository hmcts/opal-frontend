export const ABSTRACT_FORM_BASE_FIELD_ERRORS = {
  court: {
    required: {
      message: 'Select a court',
      priority: 1,
    },
  },
  dayOfMonth: {
    required: {
      message: 'The date your passport was issued must include a day',
      priority: 1,
    },
    maxlength: {
      message: 'The day must be 2 characters or fewer',
      priority: 2,
    },
    underEighteen: {
      message: 'You need to be older than 18 years old',
      priority: 3,
    },
  },
  monthOfYear: {
    required: {
      message: 'The date your passport was issued must include a month',
      priority: 1,
    },
    underEighteen: {
      message: 'You need to be older than 18 years old',
      priority: 3,
    },
  },
  year: {
    required: {
      message: 'The date your passport was issued must include a year',
      priority: 1,
    },
    underEighteen: {
      message: 'You need to be older than 18 years old',
      priority: 3,
    },
  },
};
