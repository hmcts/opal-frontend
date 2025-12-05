/**
 * @fileoverview Actions for Manual Account Creation - Language preferences page.
 * Encapsulates radio selection, assertions, and cancel/save handling.
 */
import { ManualLanguagePreferencesLocators as L } from '../../../../../shared/selectors/manual-account-creation/language-preferences.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export type LanguageOption = 'English only' | 'Welsh and English';
export type LanguageSection = 'Documents' | 'Court hearings';

export class ManualLanguagePreferencesActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Language preferences page is displayed.
   * @param expectedHeader - Header text fragment to assert.
   */
  assertOnLanguagePreferencesPage(expectedHeader: string = 'Language preferences'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/language-preferences');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Asserts a language option is rendered for a section.
   * @param section - Section heading ("Documents" or "Court hearings").
   * @param option - Option label text.
   */
  assertOptionVisible(section: LanguageSection, option: LanguageOption): void {
    const selector = this.getSelector(section, option);
    log('assert', 'Checking language option is visible', { section, option, selector });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist');
  }

  /**
   * Selects a language option for the given section.
   * @param section - Section heading ("Documents" or "Court hearings").
   * @param option - Option label text.
   */
  selectLanguage(section: LanguageSection, option: LanguageOption): void {
    const selector = this.getSelector(section, option);
    log('click', 'Selecting language preference', { section, option, selector });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Asserts whether a language option is selected.
   * @param section - Section heading ("Documents" or "Court hearings").
   * @param option - Option label text.
   * @param selected - Whether the option should be selected.
   */
  assertLanguageSelected(section: LanguageSection, option: LanguageOption, selected: boolean = true): void {
    const selector = this.getSelector(section, option);
    log('assert', 'Checking language selection state', { section, option, selected });
    cy.get(selector, this.common.getTimeoutOptions()).should(selected ? 'be.checked' : 'not.be.checked');
  }

  /**
   * Clicks the Save changes button.
   */
  saveChanges(): void {
    log('action', 'Saving language preferences');
    cy.get(L.saveButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Triggers Cancel and resolves the unsaved changes dialog.
   * @param choice - Confirmation choice ("Cancel"/"Stay" to remain, "Ok"/"Leave" to exit).
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling from language preferences', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);
    cy.contains(L.cancelLink, /^cancel$/i, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Maps human-readable section/option pairs to DOM selectors.
   */
  private getSelector(section: LanguageSection, option: LanguageOption): string {
    const normalizedSection = section.toLowerCase();
    const normalizedOption = option.toLowerCase();
    const isDocument = normalizedSection.includes('document');
    const useWelsh = normalizedOption.includes('welsh');

    if (isDocument && useWelsh) return L.document.welshAndEnglish;
    if (isDocument) return L.document.englishOnly;
    if (useWelsh) return L.hearing.welshAndEnglish;
    return L.hearing.englishOnly;
  }
}
