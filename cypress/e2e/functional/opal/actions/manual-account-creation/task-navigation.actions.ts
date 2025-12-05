import { ManualAccountSharedLocators as L } from '../../../../../shared/selectors/manual-account-creation/shared.locators';
import { CommonActions } from '../common/common.actions';
import { log } from '../../../../../support/utils/log.helper';
import { ManualAccountDetailsActions } from './account-details.actions';

export class ManualAccountTaskNavigationActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();
  private readonly details = new ManualAccountDetailsActions();

  /**
   * Returns to the account details task list from any manual account form page.
   */
  returnToAccountDetails(): void {
    log('navigate', 'Returning to account details task list');
    cy.contains('button', /return to account details/i, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Navigates back to the account details task list by clicking the Return button
   * and asserting the Account details header.
   */
  navigateToAccountDetails(): void {
    log('navigate', 'Returning to account details via Return button');
    this.returnToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.details.assertOnAccountDetailsPage();
  }
}
