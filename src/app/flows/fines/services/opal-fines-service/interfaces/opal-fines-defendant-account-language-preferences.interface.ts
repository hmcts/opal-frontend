import { IOpalFinesDefendantAccountLanguagePreference } from './opal-fines-defendant-account-language-preference.interface';

export interface IOpalFinesDefendantAccountLanguagePreferences {
  document_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
  hearing_language_preference: IOpalFinesDefendantAccountLanguagePreference | null;
}
