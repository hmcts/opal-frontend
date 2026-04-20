/**
 * @file details.at-a-glance.actions.ts
 * @description Actions for the Account Details "At a glance" panel, including header assertions
 * and navigation to related areas such as Comments. Keeps step definitions thin and reusable.
 */
import { AccountAtAGlanceLocators as N } from '../../../../../shared/selectors/account-details/account.at-a-glance.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountDetailsAtAGlanceActions');

/** Actions for the Account Details "At a Glance" panel. */
export class AccountDetailsAtAGlanceActions {
  private readonly common = new CommonActions();

  /**
   * Asserts that the expected read-only section headings are visible on the At a glance tab.
   *
   * @param expectedSections - Section headings expected to be rendered on the page.
   */
  public assertReadOnlySections(expectedSections: readonly string[]): void {
    cy.get(N.sections.atAGlanceTabRoot, { timeout: 15000 }).should('be.visible');

    expectedSections.forEach((section) => {
      const expectedText = section.trim();
      const escapedExpectedText = expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      log('assert', 'Asserting At a glance section is visible', { section: expectedText });

      cy.get(N.sections.atAGlanceTabRoot, this.common.getTimeoutOptions())
        .contains(N.headers.sectionHeading, new RegExp(escapedExpectedText, 'i'))
        .should('be.visible');
    });
  }

  /**
   * Asserts the account header summary values shown above the tabbed content.
   *
   * @param expected - Map of summary labels to expected visible values.
   */
  public assertAccountHeaderSummaryValues(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      'account number': N.header.accountIdCaption,
      'account type': N.accountSummary.accountTypeValue,
      'case number': N.accountSummary.caseOrTicketNumberValue,
      'pcr or case number': N.accountSummary.caseOrTicketNumberValue,
      'pcr or ticket number': N.accountSummary.caseOrTicketNumberValue,
      'business unit': N.accountSummary.businessUnitValue,
    };

    cy.get(N.accountSummary.root, { timeout: 15000 }).should('be.visible');

    Object.entries(expected).forEach(([label, value]) => {
      const normalizedLabel = label.trim().toLowerCase();
      const selector = fieldSelectors[normalizedLabel];

      if (!selector) {
        throw new Error(
          `Unsupported account header summary label "${label}". Supported labels: ${Object.keys(fieldSelectors).join(', ')}`,
        );
      }

      log('assert', 'Asserting account header summary value', { label, value });

      cy.get(selector, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((text) => expect(text.trim()).to.contain(value));
    });
  }

  /**
   * Asserts the language preference values shown on the At a glance tab.
   *
   * @param expected - Map of language preference labels to expected values.
   */
  public assertLanguagePreferences(expected: Record<string, string>): void {
    const fieldSelectors: Record<string, string> = {
      'document language': N.fields.documentLanguage,
      'court hearing language': N.fields.courtHearingLanguage,
    };

    cy.get(N.headers.languagePreferences, { timeout: 15000 }).should('be.visible');

    Object.entries(expected).forEach(([label, value]) => {
      const normalizedLabel = label.trim().toLowerCase();
      const selector = fieldSelectors[normalizedLabel];

      if (!selector) {
        throw new Error(
          `Unsupported language preference label "${label}". Supported labels: ${Object.keys(fieldSelectors).join(', ')}`,
        );
      }

      log('assert', 'Asserting language preference value', { label, value });

      cy.get(selector, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((text) => expect(text.trim()).to.contain(value));
    });
  }

  /**
   * AssertSectionHeader.
   *
   * @param expected - Parameter.
   */
  assertSectionHeader(expected: string): void {
    cy.get(N.headers.defendant, this.common.getTimeoutOptions())
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
        cy.contains('a.govuk-link', N.links.commentsActionText, this.common.getTimeoutOptions())
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
      cy.get(N.comments.commentValue, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((t) => expect((t || '').trim()).to.contain(expected.comment!));
    }

    const lines = (expected.lines ?? []).filter(Boolean);
    if (lines.length) {
      // The Free text notes paragraph renders <br> between lines — use text() and assert each expected line appears.
      cy.get(N.comments.freeTextNotesValue, this.common.getTimeoutOptions())
        .should('be.visible')
        .invoke('text')
        .then((allTxt) => {
          const normalized = String(allTxt).replace(/\s+/g, ' ').trim();
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
