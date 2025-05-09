import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacOffenceDetailsSearchOffencesState } from './fines-mac-offence-details-search-offences-state.interface';

export interface IFinesMacOffenceDetailsSearchOffencesForm
  extends IAbstractFormBaseForm<IFinesMacOffenceDetailsSearchOffencesState> {
  formData: IFinesMacOffenceDetailsSearchOffencesState;
}
