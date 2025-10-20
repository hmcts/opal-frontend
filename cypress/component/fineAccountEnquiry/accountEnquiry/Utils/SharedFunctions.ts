import { IOpalFinesDefendantAccountLanguagePreference } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

/**
 * Sets the language preference properties on the provided preference object.
 *
 * @param pref - The preference object to update.
 * @param code - The language code to set. Defaults to `'EN'`.
 * @param name - The display name for the language. Defaults to `'English only'`.
 */
export function setLanguagePref(
  pref: IOpalFinesDefendantAccountLanguagePreference | null,
  code: 'CY' | 'EN' = 'EN',
  name: 'Welsh and English' | 'English only' = 'English only',
) {
  Object.assign(pref!, {
    language_code: code,
    language_display_name: name,
  });
}
