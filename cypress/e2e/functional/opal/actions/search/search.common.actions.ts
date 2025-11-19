// e2e/functional/opal/actions/search/search.common.actions.ts
/**
 * @fileoverview Actions for fields shared across ALL Account Search tabs:
 * - Account number
 * - Reference or case number
 * - Active accounts only (checkbox)
 * - Submit (Search)
 *
 * Keeps steps small, reusable, and intent-driven.
 */

import { log } from '../../../../../support/utils/log.helper';
import { AccountSearchIndividualsActions } from './search.individuals.actions';
import { AccountSearchCompanyActions } from './search.companies.actions';
import { AccountSearchMinorCreditorsActions } from './search.minor-creditors.actions';
import { AccountSearchCommonLocators as C } from '../../../../../shared/selectors/account-search/account.search.common.locators';

type Entity = 'individual' | 'company' | 'minorCreditor';

export class AccountSearchCommonActions {
  private readonly TIMEOUT = 10_000;
  public getTimeoutOptions() {
    return { timeout: this.TIMEOUT };
  }

  /**
   * Assert the page header contains the expected text.
   * Keeps locator details here so flows remain locator-free.
   *
   * @param expectedHeader - expected header text (case-sensitive substring match)
   */
  public assertHeaderContains(expectedHeader: string): void {
    // Use your central locator constants here (C.root used previously).
    // If you have a dedicated header locator in a locators file, switch to that.
    cy.get(C.root, { timeout: 10_000 })
      .find('h1.govuk-heading-l')
      .should('be.visible')
      .and('contain.text', expectedHeader);
  }

  /**
   * Types into the global Account number field.
   *
   * @param value - Account number to enter (e.g. "12345678A").
   */
  public enterAccountNumber(value: string): void {
    log('input', `Entering Account number`);
    cy.get(C.accountNumberInput, { timeout: 10_000 })
      .should('be.visible')
      .clear()
      .type(value)
      .should('have.value', value);
  }

  /**
   * Types into the global Reference or case number field.
   *
   * @param value - Reference or case number to enter (e.g. "CASE-001").
   */
  public enterReferenceOrCaseNumber(value: string): void {
    log('input', `Entering Reference or case number`);
    cy.get(C.referenceOrCaseNumberInput, { timeout: 10_000 })
      .should('be.visible')
      .clear()
      .type(value)
      .should('have.value', value);
  }

  /**
   * Verifies BOTH or EITHER shared fields (account number & reference/case) in one assertion.
   * Only asserts a field if an expected value is provided.
   *
   * @param expected.accountNumber - Expected value for Account number (optional).
   * @param expected.referenceOrCaseNumber - Expected value for Reference or case number (optional).
   */
  public assertSharedFieldValues(expected: { accountNumber?: string; referenceOrCaseNumber?: string }): void {
    log('assert', 'Asserting shared field values');

    if (expected.accountNumber !== undefined) {
      cy.get(C.accountNumberInput, { timeout: 10_000 }).should('be.visible').and('have.value', expected.accountNumber);
    }

    if (expected.referenceOrCaseNumber !== undefined) {
      cy.get(C.referenceOrCaseNumberInput, { timeout: 10_000 })
        .should('be.visible')
        .and('have.value', expected.referenceOrCaseNumber);
    }
  }

  /**
   * Assert shared search result fields such as account number and reference.
   * Builds the expected values from a normalised key/value map (from Gherkin DataTable)
   * and delegates to assertSharedFieldValues.
   *
   * If only account number is present in the map, only account is asserted; reference is optional.
   *
   * @param map A normalised key/value map built from the Gherkin DataTable.
   */
  public assertSharedFields(map: Record<string, string>): void {
    const hasAccount = map['account number'] !== undefined;
    const hasReference = map['reference or case number'] !== undefined || map['reference'] !== undefined;

    if (!hasAccount && !hasReference) return;

    const expectedAccount = hasAccount ? (map['account number'] ?? '') : undefined;
    const expectedReference = hasReference ? (map['reference or case number'] ?? map['reference'] ?? '') : undefined;

    log(
      'assert',
      `Assert shared fields: account="${expectedAccount ?? '<not asserted>'}", reference="${expectedReference ?? '<not asserted>'}"`,
    );

    // delegate to the low-level assertion helper; only provided fields get asserted
    this.assertSharedFieldValues({
      accountNumber: expectedAccount,
      referenceOrCaseNumber: expectedReference,
    });
  }

  /**
   * Checks or unchecks the global "Active accounts only" checkbox.
   *
   * @param checked - true to check, false to uncheck.
   */
  public setActiveAccountsOnly(checked: boolean): void {
    log('input', `Setting "Active accounts only" to ${checked ? 'checked' : 'unchecked'}`);

    cy.get(C.activeAccountsOnlyCheckbox, { timeout: 10_000 })
      .should('be.visible')
      .then(($el) => {
        const isChecked = $el.prop?.('checked') ?? false;
        if (checked && !isChecked) {
          cy.wrap($el).check({ force: true }).should('be.checked');
        } else if (!checked && isChecked) {
          cy.wrap($el).uncheck({ force: true }).should('not.be.checked');
        }
      });
  }

  /**
   * Clicks the shared Search button.
   * Waits for it to be enabled before clicking.
   */
  public submitSearch(): void {
    log('action', 'Clicking Search');
    cy.get(C.searchButton, { timeout: 10_000 }).should('be.visible').and('be.enabled').click();
  }

  /**
   * Submits an empty search for the given entity type and performs standard asserts.
   * Delegates to each entity's actions which are responsible for the page-specific assertions.
   *
   * @param entity - 'individual' | 'company' | 'minorCreditor'
   */
  public submitEmpty(entity: Entity): void {
    log('action', `Submitting empty search for entity: ${entity}`);
    cy.log(`flow: accountSearchEmpty -> submitting empty search for [${entity}]`);

    switch (entity) {
      case 'individual': {
        // instantiate the Individuals actions class and delegate
        const individualActions = new AccountSearchIndividualsActions();
        individualActions.submitEmptySearch();
        cy.log('flow: accountSearchEmpty -> individual submitEmptySearch completed');
        return;
      }

      case 'company': {
        const companyActions = new AccountSearchCompanyActions();
        companyActions.submitEmptySearch();
        cy.log('flow: accountSearchEmpty -> company submitEmptySearch completed');
        return;
      }

      case 'minorCreditor': {
        const minorActions = new AccountSearchMinorCreditorsActions();
        if (typeof minorActions.submitEmptySearch === 'function') {
          minorActions.submitEmptySearch();
          cy.log('flow: accountSearchEmpty -> minorCreditor submitEmptySearch completed');
          return;
        }
      }
    }
  }
  /**
   * Asserts the common Account Search defaults:
   * - Account number is blank
   * - Reference or case number is blank
   * - Active accounts only is checked
   */
  public assertCommonDefaultFieldValues(): void {
    log('assert', 'Asserting common Account Search default field values');

    cy.get(C.accountNumberInput, { timeout: 10_000 }).should('exist').and('have.value', '');

    cy.get(C.referenceOrCaseNumberInput, { timeout: 10_000 }).should('exist').and('have.value', '');

    cy.get(C.activeAccountsOnlyCheckbox, { timeout: 10_000 }).should('exist').and('be.checked');

    log('done', 'Common default field values asserted');
  }

  /**
   * Escape a string for literal RegExp matching.
   */
  private escapeForRegex(value: string): string {
    const rawClass = String.raw`[.*+?^\${}()|[\]\\]`;
    const specialChars = new RegExp(rawClass, 'g');
    const replacement = String.raw`\$&`;
    return value.replaceAll(specialChars, replacement);
  }

  /**
   * Assert validation text appears in either the GOV.UK error summary or on the page.
   */
  public assertValidationMessageContains(expectedText: string): void {
    log('assert', `Asserting validation message contains: "${expectedText}"`);

    const escaped = this.escapeForRegex(expectedText);
    const re = new RegExp(escaped, 'i');

    cy.get('body', this.getTimeoutOptions()).then(($body) => {
      const hasSummary = $body.find('.govuk-error-summary').length > 0;

      if (hasSummary) {
        cy.get('.govuk-error-summary', this.getTimeoutOptions())
          .should('be.visible')
          .invoke('text')
          .then((summaryText) => {
            if (!re.test(summaryText)) {
              cy.wrap(summaryText).should('contain', expectedText);
            }
          });

        log('assert', 'Found and verified the message in the error summary');
        return;
      }

      cy.contains(re, this.getTimeoutOptions()).should('be.visible');
      log('assert', 'Found and verified the message on the page (fallback)');
    });
  }
}
