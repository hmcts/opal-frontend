import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccEnfOverrideAddChangeFormState } from './fines-acc-enf-override-add-change-form-state.interface';

export interface IFinesAccEnfOverrideAddChangeForm extends IAbstractFormBaseForm<IFinesAccEnfOverrideAddChangeFormState> {
  formData: IFinesAccEnfOverrideAddChangeFormState;
}
