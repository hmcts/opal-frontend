/**
 * @fileoverview Actions for the Check and Validate Draft Accounts (checker) page.
 * Handles navigation, tab switching, and table assertions for the checker view.
 */
import { DashboardActions } from './dashboard.actions';
import { CommonActions } from './common/common.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { CheckAndValidateDraftsLocators as L } from '../../../../shared/selectors/check-and-validate-drafts.locators';
import { DraftAccountsTableLocators } from '../../../../shared/selectors/draft-accounts-table.locators';
import { DraftAccountsTableColumn } from './types';

export type CheckAndValidateTab = 'To review' | 'Rejected' | 'Deleted' | 'Failed';

const log = createScopedLogger('CheckAndValidateDraftsActions');

/**
 * Actions for the **Check and Validate Draft Accounts** page (checker view).
 */
export class CheckAndValidateDraftsActions {
  private readonly dashboard = new DashboardActions();
  private readonly common = new CommonActions();

  /**
   * Opens the Check and Validate Draft Accounts page from the dashboard.
   */
  openPage(): void {
    log('navigate', 'Opening Check and Validate Draft Accounts');
    this.dashboard.goToCheckAndValidateDraftAccounts();
    this.common.assertHeaderContains('Review accounts');
  }

  /**
   * Switches to the specified checker tab.
   * @param tab - Tab name (To review | Rejected | Deleted | Failed)
   */
  switchTab(tab: CheckAndValidateTab): void {
    const normalized = tab.trim().toLowerCase();
    const selector = (() => {
      switch (normalized) {
        case 'to review':
          return L.tabs.toReview;
        case 'rejected':
          return L.tabs.rejected;
        case 'deleted':
          return L.tabs.deleted;
        case 'failed':
          return L.tabs.failed;
        default:
          return L.tabs.byText(tab);
      }
    })();

    log('navigate', 'Switching Check and Validate tab', { tab, selector });
    cy.get(selector, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Asserts the Account type column contains the expected text.
   */
  assertAccountType(expected: string): void {
    cy.get(DraftAccountsTableLocators.cells.accountType, this.common.getTimeoutOptions())
      .should('contain.text', expected);
  }

  /**
   * Opens a draft account by defendant/company name.
   * @param defendantName - Text shown in the Defendant column link.
   */
  openDefendant(defendantName: string): void {
    log('navigate', 'Opening draft account by defendant (checker)', { defendantName });
    cy.contains(DraftAccountsTableLocators.cells.defendantLink, defendantName, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Asserts the table headings match the expected order.
   */
  assertHeadings(expectedHeadings: string[]): void {
    const normalized = expectedHeadings.map((heading) => heading.trim());
    log('assert', 'Asserting checker draft table headings', { expectedHeadings: normalized });
    cy.get(DraftAccountsTableLocators.headings, this.common.getTimeoutOptions())
      .should('have.length.at.least', normalized.length)
      .then(($headings) => {
        const actual = Cypress.$.makeArray($headings).map((el) => Cypress.$(el).text().trim());
        expect(actual.slice(0, normalized.length)).to.deep.equal(normalized);
      });
  }

  /**
   * Asserts that a specific column contains provided text.
   */
  assertColumnContains(column: DraftAccountsTableColumn, expectedText: string): void {
    const selector = this.resolveColumnSelector(column);
    log('assert', 'Asserting checker draft table column contains text', { column, expectedText });
    cy.get(selector, this.common.getTimeoutOptions()).should('contain.text', expectedText);
  }

  /**
   * Asserts a row by position matches expected values.
   */
  assertRowValues(position: number, expectedValues: string[]): void {
    if (position < 1) {
      throw new Error(`Row position must be >= 1, received ${position}`);
    }

    log('assert', 'Asserting checker draft table row values', { position, expectedValues });
    cy.get(DraftAccountsTableLocators.rows, this.common.getTimeoutOptions())
      .eq(position - 1)
      .scrollIntoView()
      .within(() => {
        cy.get('td').should('have.length.at.least', expectedValues.length);
        cy.get('td').each(($cell, index) => {
          const expected = expectedValues[index];
          if (expected === undefined) {
            return;
          }
          const text = $cell.text().replace(/\s+/g, ' ').trim();
          if (/days ago/i.test(expected)) {
            expect(text.toLowerCase()).to.include('days ago');
            return;
          }
          expect(text).to.include(expected);
        });
      });
  }

  /**
   * Resolves a column label to the corresponding selector in the checker table.
   * @param column - Column display name (e.g., "Defendant", "Account type").
   * @returns Selector string targeting cells within that column.
   * @throws Error when an unsupported column label is provided.
   */
  private resolveColumnSelector(column: DraftAccountsTableColumn): string {
    const normalized = column.toLowerCase();
    switch (normalized) {
      case 'defendant':
        return DraftAccountsTableLocators.cells.defendant;
      case 'date of birth':
      case 'dob':
        return DraftAccountsTableLocators.cells.dateOfBirth;
      case 'approved':
        return DraftAccountsTableLocators.cells.createdDate;
      case 'date failed':
        return DraftAccountsTableLocators.cells.changedDate;
      case 'created':
        return DraftAccountsTableLocators.cells.createdDate;
      case 'account':
        return DraftAccountsTableLocators.cells.accountLink;
      case 'account type':
        return DraftAccountsTableLocators.cells.accountType;
      case 'business unit':
        return DraftAccountsTableLocators.cells.businessUnit;
      case 'submitted by':
        return DraftAccountsTableLocators.cells.submittedBy;
      default:
        throw new Error(`Unsupported column ${column}`);
    }
  }
}
