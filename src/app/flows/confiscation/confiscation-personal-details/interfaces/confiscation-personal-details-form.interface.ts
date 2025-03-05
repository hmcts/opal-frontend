import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IConfiscationPersonalDetailsState } from './confiscation-personal-details-state.interface';

export interface IConfiscationPersonalDetailsForm extends IAbstractFormBaseForm<IConfiscationPersonalDetailsState> {
  formData: IConfiscationPersonalDetailsState;
  nestedFlow: boolean;
}
