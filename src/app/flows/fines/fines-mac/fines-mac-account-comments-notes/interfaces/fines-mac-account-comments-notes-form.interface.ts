import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacAccountCommentsNotesState } from './fines-mac-account-comments-notes-state.interface';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state';

export interface IFinesMacAccountCommentsNotesForm extends IAbstractFormBaseForm<IFinesMacFormState> {
  formData: IFinesMacFormState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
