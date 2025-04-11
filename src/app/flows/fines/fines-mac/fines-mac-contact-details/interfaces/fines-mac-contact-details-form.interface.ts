import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacContactDetailsState } from '../interfaces/fines-mac-contact-details-state.interface';

export interface IFinesMacContactDetailsForm extends IAbstractFormBaseForm<IFinesMacContactDetailsState> {
  formData: IFinesMacContactDetailsState;
  nestedFlow: boolean;
}
