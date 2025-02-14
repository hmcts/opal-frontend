import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { FINES_CONF_ACCOUNT_COMMENTS_NOTES_FORM } from '../fines-conf-account-comments-notes/constants/fines-conf-account-comments-notes-form';
import { IFinesConfAccountCommentsNotesForm } from '../fines-conf-account-comments-notes/interfaces/fines-conf-account-comments-notes-form.interface';

export const FinesConfiscationStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    accountCommentsNotes: FINES_CONF_ACCOUNT_COMMENTS_NOTES_FORM,
    unsavedChanges: false,
    stateChanges: false,
  })),
  withMethods((store) => ({
    setAccountCommentsNotes: (accountCommentsNotes: IFinesConfAccountCommentsNotesForm) => {
      patchState(store, { accountCommentsNotes, stateChanges: true, unsavedChanges: false });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
  })),
);
