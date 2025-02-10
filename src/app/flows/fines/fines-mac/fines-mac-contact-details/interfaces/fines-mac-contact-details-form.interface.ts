import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacContactDetailsState } from '../interfaces/fines-mac-contact-details-state.interface';

export interface IFinesMacContactDetailsForm extends IAbstractFormBaseForm<IFinesMacContactDetailsState> {
  formData: IFinesMacContactDetailsState;
  nestedFlow: boolean;
}
