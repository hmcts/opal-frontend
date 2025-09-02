import { IFinesAccAddCommentsFieldErrors } from '../interfaces/fines-acc-comments-add-field-errors.interface';

export const FINES_ACC_ADD_COMMENTS_FIELD_ERRORS: IFinesAccAddCommentsFieldErrors = {
  facc_add_comment: {
    maxlength: {
      message: `Account note must be 30 characters or fewer`,
      priority: 2,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Account comment must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 3,
    },
  },
  facc_add_free_text_1: {
    maxlength: {
      message: `Free text 1 must be 76 characters or fewer`,
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Free text 1 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 2,
    },
  },
  facc_add_free_text_2: {
    maxlength: {
      message: `Free text 2 must be 76 characters or fewer`,
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Free text 2 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 2,
    },
  },
  facc_add_free_text_3: {
    maxlength: {
      message: `Free text 3 must be 76 characters or fewer`,
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Free text 3 must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 2,
    },
  },
};
