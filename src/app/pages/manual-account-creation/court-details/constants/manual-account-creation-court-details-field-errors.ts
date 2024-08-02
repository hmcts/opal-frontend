export const MANUAL_ACCOUNT_CREATION_COURT_DETAILS_FIELD_ERRORS = {
  sendingCourt: {
    required: {
      message: 'Enter a sending area or Local Justice Area',
      priority: 1,
    },
  },
  pcr: {
    required: {
      message: 'Enter a Prosecutor Case Reference',
      priority: 1,
    },
    maxlength: {
      message: 'You have entered too many characters. Enter 30 characters or fewer',
      priority: 2,
    },
    pattern: {
      message: 'Enter letters and numbers only',
      priority: 3,
    },
  },
  enforcementCourt: {
    required: {
      message: 'Enter an Enforcement court',
      priority: 1,
    },
  },
};
