/**
 * @file Actions for the Create and Manage Draft Accounts (inputter) page.
 * @description Provides navigation, tab switching, and table assertions for draft listings.
 */
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CreateManageDraftsLocators as L } from '../../../../../shared/selectors/create-manage-drafts.locators';
import { DraftAccountsTableLocators as TableL } from '../../../../../shared/selectors/draft-accounts-table.locators';
import { DraftAccountsCommonActions } from './draft-accounts-common.actions';

export type CreateManageTab = 'In review' | 'Rejected' | 'Approved' | 'Deleted';

const log = createScopedLogger('CreateManageDraftsActions');
const CREATE_AND_MANAGE_DRAFT_ACCOUNTS_LINK = '#finesCavInputterLink';
const ACCOUNTS_DASHBOARD_PATH = '/fines/dashboard/accounts';
const CREATE_AND_MANAGE_DRAFT_ACCOUNTS_PATH = '/fines/draft/create-and-manage/tabs#review';
const MANUAL_ACCOUNT_CREATION_ORIGINATOR_PATH = '/fines/manual-account-creation/originator-type';

/**
 * Actions for the **Create and Manage Draft Accounts** page (inputter view).
 */
export class CreateManageDraftsActions extends DraftAccountsCommonActions {
  /**
   * Visits the Accounts dashboard directly.
   */
  visitAccountsDashboardDirectly(): void {
    log('navigate', 'Visiting Accounts dashboard directly', { path: ACCOUNTS_DASHBOARD_PATH });
    cy.visit(ACCOUNTS_DASHBOARD_PATH);
  }

  /**
   * Visits the Create and Manage Draft Accounts route directly.
   */
  visitPageDirectly(): void {
    log('navigate', 'Visiting Create and Manage Draft Accounts directly', {
      path: CREATE_AND_MANAGE_DRAFT_ACCOUNTS_PATH,
    });
    cy.visit(CREATE_AND_MANAGE_DRAFT_ACCOUNTS_PATH);
  }

  /**
   * Opens the Create and Manage Draft Accounts page from the Accounts landing page.
   */
  openPageFromAccounts(): void {
    log('navigate', 'Opening Create and Manage Draft Accounts');
    cy.get(CREATE_AND_MANAGE_DRAFT_ACCOUNTS_LINK, { timeout: 10_000 }).should('be.visible').click({ force: true });
    this.assertOnPage();
  }

  /**
   * Asserts the Create and Manage Draft Accounts page is displayed.
   */
  assertOnPage(): void {
    this.common.assertHeaderContains('Create accounts');
    cy.get(L.tabs.container, this.common.getTimeoutOptions()).should('be.visible');
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
    // For rejected tab, ensure we wait for the listings request so new rejects appear before further steps.
    const shouldWaitForRejected = normalized === 'rejected';
    if (shouldWaitForRejected) {
      cy.intercept({ method: 'GET', url: /\/opal-fines-service\/draft-accounts\?.*status=Rejected/i }).as(
        'getRejectedDraftAccounts',
      );
    }

    cy.get(selector, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });

    if (shouldWaitForRejected) {
      cy.wait('@getRejectedDraftAccounts', this.common.getTimeoutOptions()).then((result) => {
        const count = result?.response?.body?.count;
        log('debug', 'Rejected drafts response received', { count, url: result?.request?.url });
      });
      // Give the table a moment to render the new rows before assertions/search.
      cy.get(L.rows, this.common.getTimeoutOptions()).should('have.length.at.least', 1);
    }
  }

  /**
   * Clicks the back link on Create and Manage Draft Accounts pages.
   */
  goBack(): void {
    log('navigate', 'Clicking back link on Create and Manage Draft Accounts');
    cy.get(L.backLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Clicks the Create account button and navigates to the originator type page.
   */
  clickCreateAccount(): void {
    log('navigate', 'Clicking Create account button from Create and Manage Draft Accounts');
    cy.get(L.createAccountButton, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', MANUAL_ACCOUNT_CREATION_ORIGINATOR_PATH);
  }

  /**
   * Asserts the approved account number is rendered as a hyperlink.
   * @param accountNumber - Account number expected in the Approved tab.
   */
  assertApprovedAccountNumberIsLink(accountNumber: string): void {
    log('assert', 'Asserting approved account number is rendered as a hyperlink', { accountNumber });
    cy.contains(TableL.cells.accountLink, accountNumber, this.common.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Asserts the approved account number is rendered as plain text.
   * @param accountNumber - Account number expected in the Approved tab.
   */
  assertApprovedAccountNumberIsPlainText(accountNumber: string): void {
    log('assert', 'Asserting approved account number is rendered as plain text', { accountNumber });
    cy.contains(`${TableL.rows} td#account`, accountNumber, this.common.getTimeoutOptions())
      .should('be.visible')
      .then(($cell) => {
        expect($cell.find('a'), `Expected ${accountNumber} to render without a hyperlink`).to.have.length(0);
      });
  }
}
