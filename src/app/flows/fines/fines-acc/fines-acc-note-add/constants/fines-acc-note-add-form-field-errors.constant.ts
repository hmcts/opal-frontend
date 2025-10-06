import { IFinesAccAddNoteFieldErrors } from '../interfaces/fines-acc-note-add-form-field-errors.interface';

export const FINES_ACC_ADD_NOTE_FIELD_ERRORS: IFinesAccAddNoteFieldErrors = {
  facc_add_notes: {
    required: {
      message: `Add account note or click cancel to return`,
      priority: 1,
    },
    maxlength: {
      message: `Account note must be 1000 characters or fewer`,
      priority: 2,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Account note must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 3,
    },
  },
};
