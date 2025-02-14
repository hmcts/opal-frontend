import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM } from '../confiscation-account-comments-notes/constants/confiscation-account-comments-notes-form';
import { IConfiscationAccountCommentsNotesForm } from '../confiscation-account-comments-notes/interfaces/confiscation-account-comments-notes-form.interface';

export const ConfiscationStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    accountCommentsNotes: CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM,
    unsavedChanges: false,
    stateChanges: false,
  })),
  withMethods((store) => ({
    setAccountCommentsNotes: (accountCommentsNotes: IConfiscationAccountCommentsNotesForm) => {
      patchState(store, { accountCommentsNotes, stateChanges: true, unsavedChanges: false });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
  })),
);
