import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM } from '../confiscation-account-comments-notes/constants/confiscation-account-comments-notes-form';
import { IConfiscationAccountCommentsNotesForm } from '../confiscation-account-comments-notes/interfaces/confiscation-account-comments-notes-form.interface';
import { CONFISCATION_PERSONAL_DETAILS_FORM } from '../confiscation-personal-details/constants/confiscation-personal-details-form';
import { IConfiscationPersonalDetailsForm } from '../confiscation-personal-details/interfaces/confiscation-personal-details-form.interface';

export const ConfiscationStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    accountCommentsNotes: CONFISCATION_ACCOUNT_COMMENTS_NOTES_FORM,
    personalDetails: CONFISCATION_PERSONAL_DETAILS_FORM,
    unsavedChanges: false,
    stateChanges: false,
  })),
  withMethods((store) => ({
    setAccountCommentsNotes: (accountCommentsNotes: IConfiscationAccountCommentsNotesForm) => {
      patchState(store, { accountCommentsNotes, stateChanges: true, unsavedChanges: false });
    },
    setPersonalDetails: (personalDetails: IConfiscationPersonalDetailsForm) => {
      patchState(store, { personalDetails, stateChanges: true, unsavedChanges: false });
    },
    setUnsavedChanges: (unsavedChanges: boolean) => {
      patchState(store, { unsavedChanges });
    },
  })),
);
