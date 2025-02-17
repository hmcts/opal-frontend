import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacOffenceDetailsMinorCreditorState } from './fines-mac-offence-details-minor-creditor-state.interface';

export interface IFinesMacOffenceDetailsMinorCreditorForm
  extends IAbstractFormBaseForm<IFinesMacOffenceDetailsMinorCreditorState> {
  formData: IFinesMacOffenceDetailsMinorCreditorState;
  nestedFlow: boolean;
}
