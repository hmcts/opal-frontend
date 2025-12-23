import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesSaSearchFilterBusinessUnitState } from './fines-sa-search-filter-business-unit-state.interface';

export interface IFinesSaSearchFilterBusinessUnitForm
  extends IAbstractFormBaseForm<IFinesSaSearchFilterBusinessUnitState> {
  formData: IFinesSaSearchFilterBusinessUnitState;
}
