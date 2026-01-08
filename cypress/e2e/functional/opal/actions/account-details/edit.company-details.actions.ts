/**
 * @file edit-company-details.actions.ts
 * @description Cypress actions and assertions for editing company details within the Opal application.
 */

import { CompanyDetailsLocators as L } from '../../../../../shared/selectors/account-details/edit.company-details.locators';
import { AccountCompanyDetailsLocators as SummaryL } from '../../../../../shared/selectors/account-details/account.company-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('EditCompanyDetailsActions');

/** Actions for editing company details within Account Details. */
export class EditCompanyDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Ensure we are still on the edit page (form visible, not navigated away).
   */
  public assertStillOnEditPage(): void {
    log('assert', 'Asserting company edit form is still visible');
    cy.get(L.form, { timeout: 10_000 }).should('be.visible');
    log('done', 'Company edit form is visible');
  }

  /**
   * Update the company name field on the edit form.
   *
   * @param value - The company name to enter (e.g. "Acme Ltd").
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for elements (default 10_000ms).
   * @param opts.assert Whether to assert the value after typing (default true).
   */
  public editCompanyName(value: string, opts?: { timeout?: number; assert?: boolean }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('method', `Editing company name field with value: "${value}"`);

    // Ensure we’re on the correct form
    cy.get(L.form, { timeout }).should('be.visible');

    // Interact with the Company Name field by its stable ID
    log('action', 'Typing company name into field');
    cy.get(L.fields.companyName, { timeout })
      .should('be.visible')
      .and('be.enabled')
      .scrollIntoView()
      .clear({ force: true })
      .type(value)
      .blur();

    // Optional assertion to verify the input value was applied
    if (opts?.assert !== false) {
      log('assert', `Verifying company name field value equals "${value}"`);
      cy.get(L.fields.companyName).should('have.value', value);
      log('done', 'Company name updated successfully');
    }
  }

  /**
   * Verifies the Company Name field value (read-only or in-form).
   *
   * Waits for the field to be visible, then checks that its text or value
   * matches the expected company name.
   *
   * @param expectedValue - The expected company name (e.g. "Acme Ltd").
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for visibility (default 10_000ms).
   */
  public verifyFieldValue(expectedValue: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('assert', `Verifying company name equals "${expectedValue}"`);
    cy.get(L.fields.companyName, { timeout })
      .should('be.visible')
      .then(($el) => {
        const rawVal = $el.text() || $el.val();
        const actualText = Array.isArray(rawVal) ? rawVal.join(' ').trim() : String(rawVal ?? '').trim();

        log('assert', `Actual Company name value: "${actualText}"`);
        expect(actualText).to.contain(expectedValue);
      });

    log('done', `Verified Company name is "${expectedValue}"`);
  }

  /**
   * Clicks Save changes on the Company details form.
   */
  public saveChanges(): void {
    log('action', 'Saving company details');
    cy.get(L.actions.saveChanges, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Asserts the company name on the summary card contains the expected value.
   * Uses the read-only summary card locator, not the edit form input.
   * @param expected text expected in the name field
   */
  assertCompanyNameContains(expected: string): void {
    log('assert', `Asserting company name summary contains "${expected}"`);
    cy.get(SummaryL.fields.name, this.common.getTimeoutOptions()).should('be.visible').and('contain.text', expected);
    log('done', `Verified company name contains "${expected}"`);
  }
}
