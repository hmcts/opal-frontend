/**
 * @file mac.language-preferences.locators.ts
 * @description Selectors for the Manual Account Creation **Language preferences** page.
 */
export const MacLanguagePreferencesLocators = {
  app: 'app-fines-mac-language-preferences-form',
  submitButton: 'button[type="submit"]',
  pageTitle: 'h1.govuk-heading-l',
  descriptionText: 'p',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--s',
  cyDocumentRadioLabel: 'label[for="fm_language_preferences_document_language-CYDocumentRadioOption"]',
  enDocumentRadioLabel: 'label[for="fm_language_preferences_document_language-ENDocumentRadioOption"]',
  cyCourtHearingRadioLabel: 'label[for="fm_language_preferences_hearing_language-CYCourtHearingRadioOption"]',
  enCourtHearingRadioLabel: 'label[for="fm_language_preferences_hearing_language-ENCourtHearingRadioOption"]',
  cyDocumentRadioOption: 'input[name="fm_language_preferences_document_language"][value="CY"]',
  enDocumentRadioOption: 'input[name="fm_language_preferences_document_language"][value="EN"]',
  cyCourtHearingRadioOption: 'input[name="fm_language_preferences_hearing_language"][value="CY"]',
  enCourtHearingRadioOption: 'input[name="fm_language_preferences_hearing_language"][value="EN"]',
  pageHeader: 'h1.govuk-heading-l',
  documentFieldset: '#fm_language_preferences_document_language',
  hearingFieldset: '#fm_language_preferences_hearing_language',
  document: {
    englishOnly: 'input[name="fm_language_preferences_document_language"][value="EN"]',
    welshAndEnglish: 'input[name="fm_language_preferences_document_language"][value="CY"]',
  },
  hearing: {
    englishOnly: 'input[name="fm_language_preferences_hearing_language"][value="EN"]',
    welshAndEnglish: 'input[name="fm_language_preferences_hearing_language"][value="CY"]',
  },
  saveButton: '#submitForm',
  cancelLink: 'a.govuk-link, button.govuk-link, [role="button"].govuk-link',
} as const;
