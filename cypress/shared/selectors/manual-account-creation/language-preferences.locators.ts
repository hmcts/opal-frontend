/**
 * @file language-preferences.locators.ts
 * @description Selectors for the Manual Account Creation **Language preferences** page.
 */
export const ManualLanguagePreferencesLocators = {
  pageHeader: 'h1.govuk-heading-l',
  documentFieldset: '#fm_language_preferences_document_language',
  hearingFieldset: '#fm_language_preferences_hearing_language',
  document: {
    englishOnly: '#ENDocumentRadioOption',
    welshAndEnglish: '#CYDocumentRadioOption',
  },
  hearing: {
    englishOnly: '#ENCourtHearingRadioOption',
    welshAndEnglish: '#CYCourtHearingRadioOption',
  },
  saveButton: '#submitForm',
  cancelLink: 'a.govuk-link, button.govuk-link, [role="button"].govuk-link',
} as const;
