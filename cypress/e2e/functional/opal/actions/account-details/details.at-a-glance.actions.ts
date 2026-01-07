import { AccountAtAGlanceLocators as N } from '../../../../../shared/selectors/account-details/account.at-a-glance-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsAtAGlanceActions');

/** Actions for the Account Details "At a Glance" panel. */
export class AccountDetailsAtAGlanceActions {
  /**
   * AssertSectionHeader.
   *
   * @param expected - Parameter.
   */
  assertSectionHeader(expected: string): void {
    cy.get(N.headers.defendant, { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => expect(t.trim().toLowerCase()).to.contain(expected.trim().toLowerCase()));
  }

  /**
   * AssertHeaderContains.
   *
   * @param expected - Parameter.
   */
  assertHeaderContains(expected: string): void {
    cy.get(N.header.title, { timeout: 15000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const normalizedActual = text.toLowerCase();
        const normalizedExpected = expected.toLowerCase();
        expect(normalizedActual).to.contain(normalizedExpected);
      });
  }

  /**
   * Opens the Comments page from the defendant summary.
   *
   * @remarks
   * - Clicks the "Add comments" link on the summary.
   * - Waits for navigation to complete by asserting the Comments page header.
   * - Keeps locators in nav.locators.ts.
   *
   * @example
   *   new AccountDetailsAtAGlanceActions().openCommentsFromSummary();
   */
  public openCommentsFromSummary(): void {
    log('navigation', 'Opening Comments page from Defendant Summary');

    // Save current Details URL so we can return to it later if needed
    cy.location('href').then((u) => cy.wrap(u).as('detailsUrl'));

    // Ensure the At a glance tab is rendered
    cy.get(N.sections.atAGlanceTabRoot, { timeout: 15000 }).should('be.visible');

    // Find the Comments column and click its action link ("Add comments" OR "Change")
    cy.get(N.sections.commentsColumn, { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.contains('a.govuk-link', N.links.commentsActionText, { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .click();
      });

    // Verify route change to Comments (add/edit)
    cy.location('pathname', { timeout: 15000 }).should('match', /\/comments\/(add|edit)$/);
  }

  /**
   * Asserts the Comments block shows the expected values.
   *
   * @param expected - Expected comment text and optional free-text lines.
   * @param expected.comment - Expected main comment text.
   * @param expected.lines - Expected free-text lines (Line 1–3), any length 0–3.
   */
  public assertCommentsSection(expected: { comment?: string; lines?: string[] }): void {
    cy.get(N.sections.commentsColumn, { timeout: 15000 }).should('be.visible');

    if (expected.comment) {
      cy.get(N.comments.commentValue, { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then((t) => expect((t || '').trim()).to.contain(expected.comment!));
    }

    const lines = (expected.lines ?? []).filter(Boolean);
    if (lines.length) {
      // The Free text notes paragraph renders <br> between lines — use text() and assert each expected line appears.
      cy.get(N.comments.freeTextNotesValue, { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then((allTxt) => {
          const normalized = String(allTxt).replaceAll(/\s+/g, ' ').trim();
          for (const line of lines) {
            expect(normalized).to.contain(line);
          }
        });
    }

    // After saving, the action link should be "Change"
    cy.get(N.sections.commentsColumn).within(() => {
      cy.contains('a.govuk-link', N.links.commentsActionText).should('be.visible');
    });
  }
}
