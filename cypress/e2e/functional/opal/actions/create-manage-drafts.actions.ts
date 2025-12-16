/**
 * @fileoverview Actions for the Create and Manage Draft Accounts (inputter) page.
 * Provides navigation, tab switching, and table assertions for draft listings.
 */
import { DashboardActions } from './dashboard.actions';
import { CommonActions } from './common/common.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { CreateManageDraftsLocators as L } from '../../../../shared/selectors/create-manage-drafts.locators';
import { DraftAccountsTableLocators } from '../../../../shared/selectors/draft-accounts-table.locators';
import { DraftAccountsTableColumn } from './types';

export type CreateManageTab = 'In review' | 'Rejected' | 'Approved' | 'Deleted';

const log = createScopedLogger('CreateManageDraftsActions');

/**
 * Actions for the **Create and Manage Draft Accounts** page (inputter view).
 */
export class CreateManageDraftsActions {
  private readonly dashboard = new DashboardActions();
  private readonly common = new CommonActions();

  /**
   * Opens the Create and Manage Draft Accounts page from the dashboard.
   */
  openPage(): void {
    log('navigate', 'Opening Create and Manage Draft Accounts');
    this.dashboard.goToCreateAndManageDraftAccounts();
    this.common.assertHeaderContains('Create accounts');
  }

  /**
   * Switches to the specified tab.
   * @param tab - Tab name (In review | Rejected | Approved | Deleted)
   */
  switchTab(tab: CreateManageTab): void {
    const normalized = tab.trim().toLowerCase();
    const selector = (() => {
      switch (normalized) {
        case 'in review':
          return L.tabs.inReview;
        case 'rejected':
          return L.tabs.rejected;
        case 'approved':
          return L.tabs.approved;
        case 'deleted':
          return L.tabs.deleted;
        default:
          return L.tabs.byText(tab);
      }
    })();

    log('navigate', 'Switching Create and Manage tab', { tab, selector });
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
    log('navigate', 'Opening draft account by defendant', { defendantName });
    cy.contains(DraftAccountsTableLocators.cells.defendantLink, defendantName, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Opens the first draft account where the specified column contains the expected text.
   * @param column - Column label.
   * @param expectedText - Text to match within the column.
   */
  openFirstMatchInColumn(column: DraftAccountsTableColumn, expectedText: string): void {
    const selector = this.resolveColumnSelector(column);
    log('navigate', 'Opening first draft account matching column text', { column, expectedText });
    cy.get(DraftAccountsTableLocators.rows, this.common.getTimeoutOptions())
      .find(selector)
      .contains(expectedText)
      .first()
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Opens a draft account by account number (Approved tab).
   * @param accountNumber - Account number link text.
   */
  openAccountNumber(accountNumber: string): void {
    log('navigate', 'Opening draft account by account number', { accountNumber });
    cy.contains(DraftAccountsTableLocators.cells.accountLink, accountNumber, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Follows the "view all rejected accounts" link.
   */
  openViewAllRejected(): void {
    log('navigate', 'Opening View all rejected accounts');
    cy.get(DraftAccountsTableLocators.viewAllRejectedLink, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Clicks the back link on Create and Manage Draft Accounts pages.
   */
  goBack(): void {
    log('navigate', 'Clicking back link on Create and Manage Draft Accounts');
    cy.get(L.backLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Clicks the back link on the View all rejected accounts page.
   */
  returnFromViewAllRejected(): void {
    log('navigate', 'Returning from View all rejected accounts');
    cy.get(DraftAccountsTableLocators.backLink, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Asserts the table headings match the expected order.
   */
  assertHeadings(expectedHeadings: string[]): void {
    const normalized = expectedHeadings.map((heading) => heading.trim());
    log('assert', 'Asserting draft table headings', { expectedHeadings: normalized });
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
    log('assert', 'Asserting draft table column contains text', { column, expectedText });
    cy.get(selector, this.common.getTimeoutOptions()).should('contain.text', expectedText);
  }

  /**
   * Asserts a row by position matches expected values.
   */
  assertRowValues(position: number, expectedValues: string[]): void {
    if (position < 1) {
      throw new Error(`Row position must be >= 1, received ${position}`);
    }

    const normalize = (text: string) => text.replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();

    log('assert', 'Asserting draft table row values', { position, expectedValues });
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
          const text = normalize($cell.text());
          const expectedNormalized = normalize(expected);
          if (/days ago/i.test(expected)) {
            expect(text.toLowerCase()).to.include('days ago');
            return;
          }
          expect(text).to.include(expectedNormalized);
        });
      });
  }

  /**
   * Asserts a row contains expected column/value pairs (order-agnostic).
   */
  assertRowColumns(position: number, expectations: Record<DraftAccountsTableColumn, string>): void {
    if (position < 1) {
      throw new Error(`Row position must be >= 1, received ${position}`);
    }

    const normalize = (text: string) => text.replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();
    const approvedSummaries = (Cypress.env('approvedDraftSummaries') as any[]) || [];

    log('assert', 'Asserting draft table row column values', { position, expectations });
    cy.get(DraftAccountsTableLocators.rows, this.common.getTimeoutOptions())
      .eq(position - 1)
      .scrollIntoView()
      .within(() => {
        Object.entries(expectations).forEach(([column, value]) => {
          const selector = this.resolveColumnSelector(column as DraftAccountsTableColumn);
          let expectedNormalized = normalize(value);
          if (column.toLowerCase() === 'approved' && expectedNormalized.toLowerCase() === 'days ago') {
            const computed = normalize(approvedSummaries[position - 1]?.__approvedDays || '');
            if (computed) {
              expectedNormalized = computed;
            }
          }
          cy.get(selector, this.common.getTimeoutOptions()).should(($cells) => {
            const cellTexts = $cells
              .map((_, el) => normalize(Cypress.$(el).text()))
              .toArray();
            expect(cellTexts.some((text) => text.includes(expectedNormalized))).to.equal(
              true,
              `Expected "${expectedNormalized}" in ${column}`,
            );
          });
        });
      });
  }

  /**
   * Resolves a column label to the corresponding selector within the draft listings table.
   * @param column - Column display name (e.g., "Defendant", "Account type").
   * @returns Selector string targeting cells under the requested column.
   * @throws Error if the provided column label is unsupported.
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
