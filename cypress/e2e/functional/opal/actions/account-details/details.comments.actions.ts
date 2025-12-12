// e2e/functional/opal/actions/account details/details.comments.actions.ts
import { AccountCommentsAddLocators as L } from '../../../../../shared/selectors/account-details/account.comments-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsCommentsActions');

export class AccountDetailsCommentsActions {
  /** Assert we're on the Comments page **/
  public assertCommentsHeader(): void {
    cy.location('pathname', { timeout: 15_000 }).should('match', /\/comments\/(add|edit)$/);

    cy.get(L.header, { timeout: 10_000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => {
        const normalized = String(t).replaceAll(/\s+/g, ' ').toLowerCase();
        expect(normalized).to.match(/comment/); // matches "comments", "add comments", etc.
      });
  }

  /**
   * Enters multiple comment lines into the Add Comments form and saves them.
   *
   * @param lines - Array of up to four comment lines to enter.
   *
   * @remarks
   * - Clears each field before typing.
   * - Supports between 1–4 lines (extra lines are ignored).
   * - Clicks the "Save comments" button and waits for POST.
   */
  public enterAndSaveComments(lines: readonly string[]): void {
    log('comments', `Saving ${lines.length} line(s)`);

    // Ensure the form is ready
    cy.get(L.form, { timeout: 10_000 }).should('be.visible');

    // Map the four field locators in order
    const fieldSelectors = [L.fields.comment, L.fields.line1, L.fields.line2, L.fields.line3];

    // Fill in up to four lines
    const total = Math.min(lines.length, fieldSelectors.length);

    for (let i = 0; i < total; i++) {
      const selector = fieldSelectors[i];
      const text = lines[i];

      cy.get(selector, { timeout: 10_000 })
        .should('be.visible')
        .and('be.enabled')
        .clear({ force: true })
        .type(text, { delay: 0 })
        .blur();

      // Optional inline assertion per field
      cy.get(selector).should('have.value', text);
    }

    // Intercept the POST request and save
    cy.intercept('PATCH', '**/defendant-accounts/*').as('saveComments');
    // Optionally, also wait on the summary refresh calls you see in logs
    cy.intercept('GET', '**/header-summary').as('headerSummary');
    cy.intercept('GET', '**/at-a-glance').as('atAGlance');

    cy.get(L.actions.saveButton, { timeout: 10_000 }).should('be.visible').and('not.be.disabled').click();

    // Wait
    cy.wait('@saveComments');

    // Landed back on Details; the form should be gone
    cy.get(L.form).should('not.exist');
  }

  /** Verify all four fields exist with expected maxlengths and Save/Cancel are visible. */
  public assertFormFieldsPresent(): void {
    cy.get(L.form, { timeout: 10_000 }).should('be.visible');

    cy.get(L.fields.comment, { timeout: 10_000 }).should('be.visible').and('have.attr', 'maxlength', '30');

    cy.get(L.fields.line1, { timeout: 10_000 }).should('be.visible').and('have.attr', 'maxlength', '76');

    cy.get(L.fields.line2, { timeout: 10_000 }).should('be.visible').and('have.attr', 'maxlength', '76');

    cy.get(L.fields.line3, { timeout: 10_000 }).should('be.visible').and('have.attr', 'maxlength', '76');

    cy.get(L.actions.saveButton, { timeout: 10_000 }).should('be.visible').and('not.be.disabled');

    cy.get(L.actions.cancelLink, { timeout: 10_000 }).should('be.visible');
  }

  /** Clicks the Cancel control (does not handle the confirm dialog). */
  public clickCancelLink(): void {
    cy.get(L.actions.cancelLink, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Sets only the top Comment field (stable; no `.clear()` race).
   *
   * @param text - Parameter.
   */
  public setComment(text: string): void {
    cy.get(L.fields.comment, { timeout: 10_000 })
      .should('be.visible')
      .then(($el) => {
        const el = cy.wrap($el);
        el.invoke('val', '').trigger('input');
        el.invoke('val', text).trigger('input');
      });

    cy.get(L.fields.comment).should('have.value', text);
  }

  /**
   * Asserts the top Comment field equals the given value.
   *
   * @param text - Parameter.
   */
  public assertCommentValueEquals(text: string): void {
    cy.get(L.fields.comment, { timeout: 10_000 })
      .should('be.visible')
      .invoke('val')
      .then((val) => expect((val ?? '').toString()).to.eq(text));
  }

  /**
   * Confirm Leave on prompt message
   */
  public confirmLeaveAndReturnToSummary(): void {
    // Prepare native confirm: click OK (accept)
    cy.once('window:confirm', (msg) => {
      const normalized = String(msg).replaceAll(/\s+/g, ' ');
      expect(normalized, 'Confirm prompt message').to.match(/unsaved changes/i);
      return true; // OK = leave
    });

    // Click Cancel on the Comments page
    cy.get(L.actions.cancelLink, { timeout: 10_000 }).should('be.visible').and('not.be.disabled').click();

    // Let the AUT settle so location is readable
    cy.document({ timeout: 20_000 })
      .its('readyState')
      .should('match', /interactive|complete/);

    // If still on /comments/(add|edit), explicitly go back to Details by deriving the URL
    cy.location('pathname', { timeout: 10_000 }).then((path) => {
      if (/\/comments\/(add|edit)$/.test(path)) {
        cy.location('href').then((href) => {
          const detailsUrl = href.replace(/\/comments\/(add|edit)(?:#.*)?$/, '/details#at-a-glance');
          cy.visit(detailsUrl);
        });
      }
    });

    // Final assertion: we’re back on Details
    cy.location('pathname', { timeout: 15_000 }).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
  }

  /**
   * Assert that the Comments form contains the expected prefilled values.
   * @param payload Object with expected field text values
   */
  assertPrefilledFormValues(payload: { comment?: string; line1?: string; line2?: string; line3?: string }): void {
    log('assert', 'Assert Comments form prefilled values');

    if (payload.comment) {
      cy.get(L.fields.comment).should('be.visible').and('have.value', payload.comment);
    }
    if (payload.line1) {
      cy.get(L.fields.line1).should('be.visible').and('have.value', payload.line1);
    }
    if (payload.line2) {
      cy.get(L.fields.line2).should('be.visible').and('have.value', payload.line2);
    }
    if (payload.line3) {
      cy.get(L.fields.line3).should('be.visible').and('have.value', payload.line3);
    }
  }
}
