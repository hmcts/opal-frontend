export const ACCOUNT_ENQUIRY_SEARCH_FORM_FIELDS = {
  court: null,
  surname: null,
  forename: null,
  initials: null,
  dateOfBirth: {
    dayOfMonth: null,
    monthOfYear: null,
    year: null,
  },
  addressLine: null,
  niNumber: null,
  pcr: null,
};

export const ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH = {
  formData: ACCOUNT_ENQUIRY_SEARCH_FORM_FIELDS,
  snapshotFormData: ACCOUNT_ENQUIRY_SEARCH_FORM_FIELDS,
};

export const ACCOUNT_ENQUIRY_DEFAULT_STATE = {
  search: ACCOUNT_ENQUIRY_DEFAULT_STATE_SEARCH,
};
