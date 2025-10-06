import { IFinesAccAddNoteForm } from '../interfaces/fines-acc-note-add-form.interface';

/**
 * Mock data for FinesAccAddNoteForm with a valid note
 */
export const FINES_ACC_ADD_NOTE_FORM_MOCK: IFinesAccAddNoteForm = {
  formData: {
    facc_add_notes:
      'This is a sample note for testing purposes. The defendant has been cooperative during the process.',
  },
  nestedFlow: false,
};
