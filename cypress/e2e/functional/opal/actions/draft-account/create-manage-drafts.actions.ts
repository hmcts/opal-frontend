/**
 * @file Actions for the Create and Manage Draft Accounts (inputter) page.
 * @description Provides navigation, tab switching, and table assertions for draft listings.
 */
import { DashboardActions } from '../dashboard.actions';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CreateManageDraftsLocators as L } from '../../../../../shared/selectors/create-manage-drafts.locators';
import { DraftAccountsCommonActions } from './draft-accounts-common.actions';

export type CreateManageTab = 'In review' | 'Rejected' | 'Approved' | 'Deleted';

const log = createScopedLogger('CreateManageDraftsActions');

/**
 * Actions for the **Create and Manage Draft Accounts** page (inputter view).
 */
export class CreateManageDraftsActions extends DraftAccountsCommonActions {
  private readonly dashboard = new DashboardActions();

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
  }
}
