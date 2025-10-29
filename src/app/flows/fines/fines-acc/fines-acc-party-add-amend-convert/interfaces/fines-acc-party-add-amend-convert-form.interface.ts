import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccPartyAddAmendConvertState } from './fines-acc-party-add-amend-convert-state.interface';

export interface IFinesAccPartyAddAmendConvertForm extends IAbstractFormBaseForm<IFinesAccPartyAddAmendConvertState> {
  formData: IFinesAccPartyAddAmendConvertState;
  nestedFlow: boolean;
}
