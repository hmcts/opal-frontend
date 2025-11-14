import { AccountAtAGlanceLocators as N } from '../../../../../shared/selectors/account-details/account.at-a-glance-details.locators';

export class AccountDetailsAtAGlanceActions {
  /** ensure we’re on at a glance */
  assertReturnedToAtAGlance(): void {
    cy.url({ timeout: 15000 }).should((p) => {
      expect(p, 'on details route').to.match(/\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details#at-a-glance$/);
    });
    cy.get('main h1.govuk-heading-l, .account-details__header', { timeout: 10000 }).should('be.visible');
  }

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
    cy.get(N.header.title, { timeout: 15000 }).should('contain.text', expected);
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
    Cypress.log({
      name: 'Navigation',
      displayName: 'Open Comments page',
      message: 'Opening Comments page from Defendant Summary',
    });

    // Save current Details URL so we can return to it later if needed
    cy.location('href').then((u) => cy.wrap(u).as('detailsUrl'));

    // Ensure the At a glance tab is rendered
    cy.get('app-fines-acc-defendant-details-at-a-glance-tab', { timeout: 15000 }).should('be.visible');

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
          const normalized = String(allTxt).replaceAll(/\s+/g, ' ').trim(); // ✅ use replaceAll()
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
