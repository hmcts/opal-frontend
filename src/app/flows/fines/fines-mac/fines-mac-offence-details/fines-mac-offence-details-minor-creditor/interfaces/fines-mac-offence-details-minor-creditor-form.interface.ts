import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacOffenceDetailsMinorCreditorState } from './fines-mac-offence-details-minor-creditor-state.interface';

export interface IFinesMacOffenceDetailsMinorCreditorForm
  extends IAbstractFormBaseForm<IFinesMacOffenceDetailsMinorCreditorState> {
  formData: IFinesMacOffenceDetailsMinorCreditorState;
  nestedFlow: boolean;
}
