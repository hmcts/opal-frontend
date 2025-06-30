import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesSaSearchAccountState } from './fines-sa-search-account-state.interface';

export interface IFinesSaSearchAccountForm extends IAbstractFormBaseForm<IFinesSaSearchAccountState> {
  formData: IFinesSaSearchAccountState;
}
