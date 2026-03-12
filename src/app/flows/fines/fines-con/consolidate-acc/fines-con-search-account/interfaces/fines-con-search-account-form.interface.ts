import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesConSearchAccountState } from './fines-con-search-account-state.interface';

/**
 * Interface for the search account form data structure.
 * Extends the base abstract form interface and includes defendant-type-specific criteria.
 */
export interface IFinesConSearchAccountForm extends IAbstractFormBaseForm<IFinesConSearchAccountState> {
  formData: IFinesConSearchAccountState;
}
