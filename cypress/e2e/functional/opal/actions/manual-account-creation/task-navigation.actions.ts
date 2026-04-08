/**
 * @file task-navigation.actions.ts
 * @description Shared navigation helpers for the Manual Account Creation task list, providing
 * safe returns to Account details and header assertions after navigation.
 */
import { CommonActions } from '../common/common.actions';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { ManualAccountDetailsActions } from './account-details.actions';

const log = createScopedLogger('ManualAccountTaskNavigationActions');

/**
 * Shared navigation helpers for the Manual Account task list.
 */
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
   * @param expectedHeader Optional account details header to assert after navigation; null skips header assertion.
   */
  navigateToAccountDetails(expectedHeader?: string | null): void {
    log('navigate', 'Ensuring account details task list is loaded', { expectedHeader });
    cy.location('pathname', { timeout: this.pathTimeout }).then((pathname) => {
      if (pathname.includes('/account-details')) {
        log('navigate', 'Already on account details page');
        return;
      }

      cy.get('body', this.common.getTimeoutOptions()).then(($body) => {
        const returnButton = $body
          .find('button')
          .filter((_, element) => /return to account details/i.test(element.innerText ?? ''));

        if (returnButton.length > 0) {
          log('navigate', 'Return button visible, clicking to reach account details');
          cy.wrap(returnButton[0]).scrollIntoView().click({ force: true });
          return;
        }

        log('navigate', 'Return button not present, waiting for account details navigation already in progress');
      });
    });

    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.details.assertOnAccountDetailsPage(expectedHeader);
  }
}
