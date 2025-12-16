/**
 * @fileoverview Actions for the Check and Validate Draft Accounts (checker) page.
 * Handles navigation, tab switching, and table assertions for the checker view.
 */
import { DashboardActions } from '../dashboard.actions';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CheckAndValidateDraftsLocators as L } from '../../../../../shared/selectors/check-and-validate-drafts.locators';
import { DraftAccountsTableLocators } from '../../../../../shared/selectors/draft-accounts-table.locators';
import { DraftAccountsCommonActions } from './draft-accounts-common.actions';

export type CheckAndValidateTab = 'To review' | 'Rejected' | 'Deleted' | 'Failed';

const log = createScopedLogger('CheckAndValidateDraftsActions');

/**
 * Actions for the **Check and Validate Draft Accounts** page (checker view).
 */
export class CheckAndValidateDraftsActions extends DraftAccountsCommonActions {
  private readonly dashboard = new DashboardActions();

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
}
