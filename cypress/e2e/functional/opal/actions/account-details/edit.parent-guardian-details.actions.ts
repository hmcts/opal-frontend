// File: e2e/functional/opal/actions/edit-parent-guardian-details.actions.ts

import { parentGuardianDetailsLocators as L } from '../../../../../shared/selectors/account-details/edit.parent-guardian.locators';
import { log } from '../../../../../support/utils/log.helper';

export class EditParentGuardianDetailsActions {
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
    cy.get(L.fields.firstNames, { timeout })
      .should('be.visible')
      .and('be.enabled')
      .scrollIntoView()
      .clear({ force: true })
      .type(newFirstName, { delay: 0, force: true })
      .should('have.value', newFirstName);

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
    cy.get(L.fields.lastName, { timeout })
      .should('be.visible')
      .and('be.enabled')
      .scrollIntoView()
      .clear({ force: true })
      .type(newLastName, { delay: 0, force: true })
      .should('have.value', newLastName);

    log('done', `Entered Last name -> "${newLastName}"`);
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

    cy.get(L.fields.lastName, { timeout }).should('be.visible').and('have.value', expectedLastName);

    log('done', `Verified Last name -> "${expectedLastName}"`);
  }

  /**
   * Clicks the Save changes button on the Parent/Guardian edit form.
   */
  public saveChanges(): void {
    log('action', 'Saving Parent/Guardian details');
    cy.get(L.actions.saveButton, { timeout: 10_000 }).should('be.visible').click();
  }
}
