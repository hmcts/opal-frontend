import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacLanguagePreferencesState } from './fines-mac-language-preferences-state.interface';

export interface IFinesMacLanguagePreferencesForm extends IAbstractFormBaseForm<IFinesMacLanguagePreferencesState> {
  formData: IFinesMacLanguagePreferencesState;
  nestedFlow: boolean;
}
