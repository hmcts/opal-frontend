import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacLanguagePreferencesState } from './fines-mac-language-preferences-state.interface';

export interface IFinesMacLanguagePreferencesForm extends IAbstractFormBaseForm<IFinesMacLanguagePreferencesState> {
  formData: IFinesMacLanguagePreferencesState;
  nestedFlow: boolean;
}
