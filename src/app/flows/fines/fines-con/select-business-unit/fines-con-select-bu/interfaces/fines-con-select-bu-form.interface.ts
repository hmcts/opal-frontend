import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesConSelectBuState } from './fines-con-select-bu-state.interface';

export interface IFinesConSelectBuForm extends IAbstractFormBaseForm<IFinesConSelectBuState> {
  formData: IFinesConSelectBuState;
  nestedFlow: boolean;
}
