// File: e2e/functional/opal/actions/edit-parent-guardian-details.actions.ts

import { parentGuardianDetailsLocators as L } from '../../../../../shared/selectors/account-details/edit.parent-guardian.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('EditParentGuardianDetailsActions');

/** Actions for editing Parent/Guardian details within Account Details. */
export class EditParentGuardianDetailsActions {
  /**
   * Clears and sets a text input within the Parent/Guardian edit form.
   *
   * Supports empty-string values so validation scenarios can clear a mandatory field
   * without trying to type an empty string through Cypress.
   *
   * @param selector - Input selector to update.
   * @param value - Value to set after clearing the field.
   * @param timeout - Max time to wait for the field visibility.
   */
  private setTextInputValue(selector: string, value: string, timeout: number): void {
    cy.get(selector, { timeout }).should('be.visible').and('be.enabled').scrollIntoView().clear({ force: true });

    if (value) {
      cy.get(selector, { timeout }).type(value, { delay: 0, force: true });
    }

    cy.get(selector, { timeout }).blur().should('have.value', value);
  }

  /**
   * Ensures the user is still on the edit page (form visible, not navigated away).
   */
  public assertStillOnEditPage(): void {
    log('assert', 'Asserting Parent/Guardian Details edit form is visible');
    cy.get(L.form, { timeout: 10_000 }).should('be.visible');
    log('done', 'Parent/Guardian Details edit form confirmed visible');
  }

  /**
   * Asserts that the current page is the Parent/Guardian edit form.
   *
   * Verifies the URL path ends with `/parentGuardian/(add|amend|edit)` and confirms the
   * page header contains “Parent or guardian details”.
   *
   * @param opts Optional config: specify a route to pin to one mode.
   *             e.g. { route: 'amend' } or 'add' | 'edit'
   * @param opts.route - Optional specific route segment to assert.
   * @param opts.timeout - Timeout override for assertions.
   */
  public assertHeader(opts?: { route?: 'add' | 'amend' | 'edit'; timeout?: number }): void {
    const timeout = opts?.timeout ?? 15_000;
    const routePart = opts?.route ?? '(?:add|amend|edit)';
    const routeRegex = new RegExp(`/parentGuardian/${routePart}$`, 'i');

    log('assert', 'Verifying Parent/Guardian edit route');
    cy.location('pathname', { timeout }).should('match', routeRegex);

    log('assert', 'Verifying Parent/Guardian header text');
    cy.get(L.headerTitle, { timeout: 10_000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => {
        // Normalize whitespace + case without using replaceAll on a RegExp
        const normalized = String(t).split(/\s+/).join(' ').toLowerCase();
        expect(normalized).to.match(/parent\s+or\s+guardian\s+details/);
      });

    log('done', 'Verified Parent/Guardian edit page header and route');
  }

  /**
   * Edits the "First names" input within the Parent/Guardian **edit form**.
   *
   * Ensures the edit form is present, focuses the First names input, clears any existing
   * value, types the new value, and asserts the value was applied.
   *
   * @param newFirstName The new or temporary first name to enter (e.g. "FNAMECHANGE").
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility (default 10_000 ms).
   */
  public editFirstNames(newFirstName: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('method', 'Editing First names (Parent/Guardian edit form)');
    cy.get(L.form, { timeout }).should('be.visible');

    log('action', `Typing First names: "${newFirstName}"`);
    this.setTextInputValue(L.fields.firstNames, newFirstName, timeout);

    log('done', `Entered First names -> "${newFirstName}"`);
  }

  /**
   * Edits the "Last name" input within the Parent/Guardian **edit form**.
   *
   * Clears any existing value and types the provided last name.
   * Ensures the form and field are visible, and asserts the value after entry.
   *
   * @param newLastName The new or temporary last name to enter (e.g. "LNAMEALTERED").
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility (default 10_000 ms).
   */
  public editLastName(newLastName: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('method', 'Editing Last name (Parent/Guardian edit form)');
    cy.get(L.form, { timeout }).should('be.visible');

    log('action', `Typing Last name: "${newLastName}"`);
    cy.get(L.fields.lastName, { timeout }).should('be.visible').and('be.enabled').scrollIntoView().clear({
      force: true,
    });

    if (newLastName) {
      cy.get(L.fields.lastName, { timeout }).type(newLastName, { delay: 0, force: true });
    }

    cy.get(L.fields.lastName, { timeout }).blur().should('have.value', newLastName.toUpperCase());

    log('done', `Entered Last name -> "${newLastName}"`);
  }

  /**
   * Edits the "Address line 1" input within the Parent/Guardian edit form.
   *
   * @param newAddressLine1 - The new address line 1 value to enter.
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility (default 10_000 ms).
   */
  public editAddressLine1(newAddressLine1: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('method', 'Editing Address line 1 (Parent/Guardian edit form)');
    cy.get(L.form, { timeout }).should('be.visible');

    log('action', `Typing Address line 1: "${newAddressLine1}"`);
    this.setTextInputValue(L.fields.address.line1, newAddressLine1, timeout);

    log('done', `Entered Address line 1 -> "${newAddressLine1}"`);
  }

  /**
   * Verifies the "First names" value in the Parent/Guardian **edit form**.
   *
   * Waits for the form and input to be visible, then asserts the input's value
   * matches the expected first name.
   *
   * @param expectedFirstName The expected first name (e.g. "FNAMECHANGE").
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility (default 10_000 ms).
   */
  public verifyFirstName(expectedFirstName: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('assert', `Verifying First names equals "${expectedFirstName}" (edit form)`);
    cy.get(L.form, { timeout }).should('be.visible');

    cy.get(L.fields.firstNames, { timeout }).should('be.visible').and('have.value', expectedFirstName);

    log('done', `Verified First names -> "${expectedFirstName}"`);
  }

  /**
   * Verifies the "Last name" value in the Parent/Guardian **edit form**.
   *
   * Waits for the form and input to be visible, then asserts the input's value
   * matches the expected last name.
   *
   * @param expectedLastName The expected last name (e.g. "LNAMEALTERED").
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility (default 10_000 ms).
   */
  public verifyLastName(expectedLastName: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('assert', `Verifying Last name equals "${expectedLastName}" (edit form)`);
    cy.get(L.form, { timeout }).should('be.visible');

    cy.get(L.fields.lastName, { timeout }).should('be.visible').and('have.value', expectedLastName.toUpperCase());

    log('done', `Verified Last name -> "${expectedLastName}"`);
  }

  /**
   * Clicks the Save changes button on the Parent/Guardian edit form.
   */
  public saveChanges(): void {
    log('action', 'Saving Parent/Guardian details');
    cy.get(L.actions.saveButton, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Clicks the Cancel link on the Parent/Guardian form.
   */
  public clickCancelLink(): void {
    log('action', 'Clicking Parent/Guardian cancel link');
    cy.get(L.actions.cancelLink, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Asserts the information banner text shown in youth add mode.
   *
   * @param expected - Expected text within the information banner.
   */
  public assertInformationBannerText(expected: string): void {
    log('assert', 'Verifying Parent/Guardian information banner text', { expected });
    cy.get(L.informationBannerText, { timeout: 10_000 }).should('contain.text', expected);
  }

  /**
   * Asserts the edit/add error summary contains the expected message.
   *
   * @param expected - Expected text within the error summary.
   */
  public assertErrorSummaryContains(expected: string): void {
    log('assert', 'Verifying Parent/Guardian error summary contains text', { expected });
    cy.get(L.errorSummary, { timeout: 10_000 }).should('be.visible').and('contain.text', expected);
  }
}
