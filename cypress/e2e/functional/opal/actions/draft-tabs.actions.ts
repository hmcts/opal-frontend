import { DashboardActions } from './dashboard.actions';
import { CommonActions } from './common/common.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';

export type InputterTab = 'In review' | 'Rejected' | 'Approved' | 'Deleted';
export type CheckerTab = 'To review' | 'Rejected' | 'Deleted' | 'Failed';

const log = createScopedLogger('DraftTabsActions');

/**
 * Actions for navigating draft account tab views for inputters and checkers.
 */
export class DraftTabsActions {
  private readonly dashboard = new DashboardActions();
  private readonly common = new CommonActions();

  /**
   * Opens the Create and Manage Draft Accounts page.
   */
  openInputterTabs(): void {
    log('navigate', 'Opening Create and Manage Draft Accounts');
    this.dashboard.goToCreateAndManageDraftAccounts();
    this.common.assertHeaderContains('Create accounts');
  }

  /**
   * Opens the Check and Validate Draft Accounts page.
   */
  openCheckerTabs(): void {
    log('navigate', 'Opening Check and Validate Draft Accounts');
    this.dashboard.goToCheckAndValidateDraftAccounts();
    this.common.assertHeaderContains('Review accounts');
  }

  /**
   * Switches to a specific tab on the inputter view.
   * @param tab - Tab name (e.g., "In review").
   */
  switchInputterTab(tab: InputterTab): void {
    const id = (() => {
      switch (tab) {
        case 'In review':
          return 'inputter-in-review-tab';
        case 'Rejected':
          return 'inputter-rejected-tab';
        case 'Approved':
          return 'inputter-approved-tab';
        case 'Deleted':
          return 'inputter-deleted-tab';
        default:
          throw new Error(`Unsupported inputter tab: ${tab}`);
      }
    })();

    log('navigate', 'Switching inputter tab', { tab, id });
    cy.get(`[subnavitemid="${id}"] a`, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
    this.waitForListings();
  }

  /**
   * Switches to a specific tab on the checker view.
   * @param tab - Tab name (e.g., "To review").
   */
  switchCheckerTab(tab: CheckerTab): void {
    const id = (() => {
      switch (tab) {
        case 'To review':
          return 'checker-to-review-tab';
        case 'Rejected':
          return 'checker-rejected-tab';
        case 'Deleted':
          return 'checker-deleted-tab';
        case 'Failed':
          return 'checker-failed-tab';
        default:
          throw new Error(`Unsupported checker tab: ${tab}`);
      }
    })();

    log('navigate', 'Switching checker tab', { tab, id });
    cy.get(`[subnavitemid="${id}"] a`, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
    this.waitForListings();
  }

  /**
   * Asserts the Account type column contains the expected value.
   * @param expected - Account type text expected in at least one row.
   */
  assertAccountType(expected: string): void {
    cy.get('td#accountType', this.common.getTimeoutOptions()).contains(expected).should('exist');
  }

  private waitForListings(): void {
    const hasStub = Cypress.env('hasFixedPenaltyListingsStub') === true;
    if (hasStub) {
      cy.wait('@getFixedPenaltyAccounts');
    }
  }
}
