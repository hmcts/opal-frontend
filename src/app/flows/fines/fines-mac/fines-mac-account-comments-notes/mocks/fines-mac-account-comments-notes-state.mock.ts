import { IFinesMacAccountCommentsNotesState } from '../interfaces/fines-mac-account-comments-notes-state.interface';

import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_CONTROLS_COMMENTS as F_M_ACCOUNT_COMMENTS_NOTES_COMMENTS } from '../constants/controls/fines-mac-account-comments-notes-controls-comments';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_CONTROLS_NOTES as F_M_ACCOUNT_COMMENTS_NOTES_NOTES } from '../constants/controls/fines-mac-account-comments-notes-controls-notes';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state';

export const FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE_MOCK: IFinesMacFormState = {
  [F_M_ACCOUNT_COMMENTS_NOTES_COMMENTS.controlName]: 'This is a test comment',
  [F_M_ACCOUNT_COMMENTS_NOTES_NOTES.controlName]: 'This is a test note',
};
