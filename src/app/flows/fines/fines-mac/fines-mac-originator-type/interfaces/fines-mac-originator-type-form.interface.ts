import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacOriginatorTypeState } from './fines-mac-originator-type-state.interface';

export interface IFinesMacOriginatorTypeForm extends IAbstractFormBaseForm<IFinesMacOriginatorTypeState> {
  formData: IFinesMacOriginatorTypeState;
  nestedFlow: boolean;
}
