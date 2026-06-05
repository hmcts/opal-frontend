import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccMinorCreditorAddAmendConvertState } from './fines-acc-minor-creditor-add-amend-convert-state.interface';

export interface IFinesAccMinorCreditorAddAmendConvertForm extends IAbstractFormBaseForm<IFinesAccMinorCreditorAddAmendConvertState> {
  formData: IFinesAccMinorCreditorAddAmendConvertState;
  nestedFlow: boolean;
}
