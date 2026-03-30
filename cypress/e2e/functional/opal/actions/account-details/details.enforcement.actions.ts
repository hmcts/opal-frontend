/**
 * @file details.enforcement.actions.ts
 * @description Actions for the Account Details "Enforcement" tab and add override form.
 */
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { DOM_ELEMENTS as ENF_OVR } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement-override-add.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsEnforcementActions');

/**
 * Actions for the Account Details enforcement tab and add override form.
 */
export class AccountDetailsEnforcementActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;

  /**
   * Selects an option from an accessible autocomplete control.
   *
   * @param selector - Input selector for the autocomplete.
   * @param query - Text to type into the input to filter options.
   * @param optionText - Visible option text to select from the dropdown.
   */
  private selectAutocompleteOption(selector: string, query: string, optionText: string): void {
    cy.get(selector, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click()
      .type('{selectall}{backspace}', { force: true })
      .type(query, { delay: 0 });

    cy.contains(ENF_OVR.dropdownOptions, optionText, {
      timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
    }).click();
    cy.get(selector, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should('contain.value', optionText);
  }

  /**
   * Asserts the Enforcement tab content is visible.
   */
  public assertEnforcementTabVisible(): void {
    log('assert', 'Enforcement tab is visible');
    cy.contains(ENF.tableTitle, 'Enforcement overview', {
      timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT,
    }).should('be.visible');
  }

  /**
   * Opens the add enforcement override form from the Enforcement tab.
   */
  public openAddEnforcementOverrideForm(): void {
    log('navigate', 'Opening add enforcement override form');
    cy.get(ENF.addEnforcementOverrideLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }

  /**
   * Asserts the add enforcement override form is visible.
   */
  public assertAddEnforcementOverrideFormVisible(): void {
    log('assert', 'Add enforcement override form is visible');
    cy.get(ENF_OVR.title, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
      'be.visible',
    );
  }

  /**
   * Selects an enforcement override from the add form.
   *
   * @param resultCode - Enforcement override code to select.
   */
  public selectEnforcementOverride(resultCode: string): void {
    log('action', 'Selecting enforcement override', { resultCode });
    this.selectAutocompleteOption(ENF_OVR.enfOverrideDropdown, resultCode, resultCode);
  }

  /**
   * Selects a Local Justice Area from the add form.
   *
   * @param localJusticeArea - Visible LJA option text.
   */
  public selectLocalJusticeArea(localJusticeArea: string): void {
    log('action', 'Selecting Local Justice Area', { localJusticeArea });
    this.selectAutocompleteOption(ENF_OVR.localJusticeAreaDropdown, localJusticeArea, localJusticeArea);
  }

  /**
   * Selects an enforcer from the add form.
   *
   * @param enforcer - Visible enforcer option text.
   */
  public selectEnforcer(enforcer: string): void {
    log('action', 'Selecting enforcer', { enforcer });
    this.selectAutocompleteOption(ENF_OVR.enforcerDropdown, enforcer, enforcer);
  }

  /**
   * Submits the add enforcement override form.
   */
  public submitAddEnforcementOverride(): void {
    log('action', 'Submitting add enforcement override form');
    cy.get(ENF_OVR.addOverrideButton, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  /**
   * Clicks the cancel link on the add enforcement override form.
   */
  public cancelAddEnforcementOverride(): void {
    log('action', 'Cancelling add enforcement override form');
    cy.get(ENF_OVR.cancelLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .contains(/^Cancel$/i)
      .click();
  }

  /**
   * Asserts the success banner text shown after saving.
   *
   * @param expected - Expected success message.
   */
  public assertSuccessBannerText(expected: string): void {
    log('assert', 'Enforcement success banner text', { expected });
    cy.get(ENF.successBanner, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .find(ENF.successBannerText)
      .should('contain.text', expected);
  }

  /**
   * Asserts the enforcement override summary values on the Enforcement tab.
   *
   * @param expected - Expected summary values.
   * @param expected.override - Expected enforcement override display text.
   * @param expected.enforcer - Expected enforcer display text.
   * @param expected.lja - Expected Local Justice Area display text.
   */
  public assertEnforcementOverrideSummary(expected: { override?: string; enforcer?: string; lja?: string }): void {
    log('assert', 'Enforcement override summary', expected);

    if (expected.override) {
      cy.get(ENF.enforcementOverrideValue, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
        'contain.text',
        expected.override,
      );
    }

    if (expected.lja) {
      cy.get(ENF.localJusticeAreaValue, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
        'contain.text',
        expected.lja,
      );
    }

    if (expected.enforcer) {
      cy.get(ENF.enfOverrideEnforcer, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
        'contain.text',
        expected.enforcer,
      );
    }
  }
}
