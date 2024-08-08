export const FINES_MAC_COURT_DETAILS_FIELD_ERRORS = {
  SendingCourt: {
    required: {
      message: 'Enter a sending area or Local Justice Area',
      priority: 1,
    },
  },
  ProsecutorCaseReference: {
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
  EnforcingCourt: {
    required: {
      message: 'Enter an Enforcement court',
      priority: 1,
    },
  },
};
