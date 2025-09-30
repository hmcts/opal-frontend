import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccDebtorAddAmendState } from './fines-acc-debtor-add-amend-state.interface';

export interface IFinesAccDebtorAddAmendForm extends IAbstractFormBaseForm<IFinesAccDebtorAddAmendState> {
  formData: IFinesAccDebtorAddAmendState;
  nestedFlow: boolean;
}
