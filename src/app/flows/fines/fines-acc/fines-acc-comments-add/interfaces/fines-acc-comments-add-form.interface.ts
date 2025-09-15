import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccAddCommentsFormState } from './fines-acc-comments-add-form-state.interface';

export interface IFinesAccAddCommentsForm extends IAbstractFormBaseForm<IFinesAccAddCommentsFormState> {
  formData: IFinesAccAddCommentsFormState;
}
