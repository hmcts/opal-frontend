import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacAccountCommentsNotesState } from './fines-mac-account-comments-notes-state.interface';

export interface IFinesMacAccountCommentsNotesForm extends IAbstractFormBaseForm<IFinesMacAccountCommentsNotesState> {
  formData: IFinesMacAccountCommentsNotesState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
