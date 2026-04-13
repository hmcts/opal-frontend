import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccEnfCourtChangeFormState } from './fines-acc-enf-court-change-form-state.interface';

export interface IFinesAccEnfCourtChangeForm extends IAbstractFormBaseForm<IFinesAccEnfCourtChangeFormState> {
  formData: IFinesAccEnfCourtChangeFormState;
}
