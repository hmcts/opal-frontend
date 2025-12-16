import { DraftAccountsTableLocators as L } from '../../../../shared/selectors/draft-accounts-table.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
/**
 * @fileoverview Shared actions for draft account listings across inputter and checker views.
 * Provides tab switching, navigation, and table assertions used by both Create/Manage and Check/Validate flows.
 */
import { CommonActions } from './common/common.actions';

const log = createScopedLogger('DraftAccountsListActions');

type DraftTableColumn =
  | 'Defendant'
  | 'Date of birth'
  | 'Date failed'
  | 'Created'
  | 'Account'
  | 'Account type'
  | 'Business unit'
  | 'Submitted by';

/**
 * Actions for interacting with the Create and Manage Draft Accounts listings.
 *
 * @remarks
 * - Supports both the main tabbed view and the View all rejected accounts page.
 * - Relies on the shared sortable table used across tabs for consistent selectors.
 */
export class DraftAccountsListActions {
  private readonly common = new CommonActions();

  /**
   * Opens a draft account by defendant/company name.
   *
   * @param defendantName - Displayed defendant/company text to match.
   *
   * @example
   *   list.openDefendant('TEST Rejected-PO-640-company');
   */
  openDefendant(defendantName: string): void {
    log('navigate', 'Opening draft account by defendant', { defendantName });
    cy.contains(L.cells.defendantLink, defendantName, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Opens a draft account via the account number link (Approved tab).
   *
   * @param accountNumber - Account number text to click.
   *
   * @example
   *   list.openAccountNumber('FP123456');
   */
  openAccountNumber(accountNumber: string): void {
    log('navigate', 'Opening draft account by account number', { accountNumber });
    cy.contains(L.cells.accountLink, accountNumber, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Clicks the "view all rejected accounts" link.
   *
   * @example
   *   list.openViewAllRejected();
   */
  openViewAllRejected(): void {
    log('navigate', 'Opening View all rejected accounts');
    cy.get(L.viewAllRejectedLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Navigates back from the View all rejected accounts page.
   *
   * @example
   *   list.returnFromViewAllRejected();
   */
  returnFromViewAllRejected(): void {
    log('navigate', 'Returning from View all rejected accounts');
    cy.get(L.backLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Asserts the table headings match the expected order.
   *
   * @param expectedHeadings - Ordered list of heading labels.
   *
   * @example
   *   list.assertHeadings(['Defendant', 'Date of birth', 'Created']);
   */
  assertHeadings(expectedHeadings: string[]): void {
    const normalized = expectedHeadings.map((heading) => heading.trim());
    log('assert', 'Asserting draft table headings', { expectedHeadings: normalized });
    cy.get(L.headings, this.common.getTimeoutOptions())
      .should('have.length.at.least', normalized.length)
      .then(($headings) => {
        const actual = Cypress.$.makeArray($headings).map((el) => Cypress.$(el).text().trim());
        expect(actual.slice(0, normalized.length)).to.deep.equal(normalized);
      });
  }

  /**
   * Asserts that a specific column contains the provided text.
   *
   * @param column - Logical column name.
   * @param expectedText - Text expected within the column cells.
   *
   * @example
   *   list.assertColumnContains('Defendant', 'TEST');
   */
  assertColumnContains(column: DraftTableColumn, expectedText: string): void {
    const selector = this.resolveColumnSelector(column);
    log('assert', 'Asserting draft table column contains text', { column, expectedText });
    cy.get(selector, this.common.getTimeoutOptions()).should('contain.text', expectedText);
  }

  /**
   * Asserts a row by position matches the provided values in order.
   *
   * @param position - 1-based row position within the table.
   * @param expectedValues - Ordered list of cell text expectations.
   *
   * @example
   *   list.assertRowValues(1, ['FP123456', 'TEST LTD', '—', '2 days ago']);
   */
  assertRowValues(position: number, expectedValues: string[]): void {
    if (position < 1) {
      throw new Error(`Row position must be >= 1, received ${position}`);
    }

    log('assert', 'Asserting draft table row values', { position, expectedValues });
    cy.get(L.rows, this.common.getTimeoutOptions())
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
   * Resolve a column display name to the selector used by the sortable table.
   * @param column - Column label (e.g., "Defendant", "Account type").
   * @returns Selector targeting cells within the specified column.
   * @throws Error when the column label is unsupported.
   */
  private resolveColumnSelector(column: DraftTableColumn): string {
    switch (column) {
      case 'Defendant':
        return L.cells.defendant;
      case 'Date of birth':
        return L.cells.dateOfBirth;
      case 'Date failed':
        return L.cells.changedDate;
      case 'Created':
        return L.cells.createdDate;
      case 'Account':
        return L.cells.accountLink;
      case 'Account type':
        return L.cells.accountType;
      case 'Business unit':
        return L.cells.businessUnit;
      case 'Submitted by':
        return L.cells.submittedBy;
      default:
        throw new Error(`Unsupported column ${column}`);
    }
  }
}
