import { FINES_MAC_STATUS } from '../../constants';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE } from './fines-mac-account-comments-notes-state';

export const FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM: IFinesMacAccountCommentsNotesForm = {
  formData: FINES_MAC_ACCOUNT_COMMENTS_NOTES_STATE,
  nestedFlow: false,
  status: FINES_MAC_STATUS.NOT_PROVIDED,
};
