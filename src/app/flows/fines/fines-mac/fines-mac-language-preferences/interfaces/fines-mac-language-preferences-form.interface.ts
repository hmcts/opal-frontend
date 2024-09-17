import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacLanguagePreferencesState } from './fines-mac-language-preferences-state.interface';

export interface IFinesMacLanguagePreferencesForm extends IAbstractFormBaseForm<IFinesMacLanguagePreferencesState> {
  formData: IFinesMacLanguagePreferencesState;
  nestedFlow: boolean;
}
