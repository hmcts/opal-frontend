/**
 * @file Actions for the Check and Validate Draft Accounts (checker) page.
 * @description Handles navigation, tab switching, and table assertions for the checker view.
 */
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CheckAndValidateDraftsLocators as L } from '../../../../../shared/selectors/manual-account-creation/check-and-validate/check-and-validate.drafts.locators';
import { CheckAndValidateReviewLocators } from '../../../../../shared/selectors/manual-account-creation/check-and-validate/check-and-validate.review.locators';
import { DraftAccountsTableLocators } from '../../../../../shared/selectors/draft-accounts-table.locators';
import { PrimaryNavigationLocators as PN } from '../../../../../shared/selectors/primary-navigation.locators';
import { DraftAccountsCommonActions } from './draft-accounts-common.actions';
import { applyUniqPlaceholder } from '../../../../../support/utils/stringUtils';

export type CheckAndValidateTab = 'To review' | 'Rejected' | 'Deleted' | 'Failed';

const log = createScopedLogger('CheckAndValidateDraftsActions');
const CHECK_AND_VALIDATE_DRAFT_ACCOUNTS_LINK = '#finesCavCheckerLink';

/**
 * Actions for the **Check and Validate Draft Accounts** page (checker view).
 */
export class CheckAndValidateDraftsActions extends DraftAccountsCommonActions {
  /**
   * Switches the current authenticated home area to the Accounts landing page when needed.
   */
  private ensureAccountsLandingPage(): void {
    cy.location('pathname', { timeout: 10_000 }).then((pathname) => {
      if (pathname.includes('/fines/dashboard/accounts')) {
        return;
      }

      log('navigate', 'Switching to Accounts landing page');
      cy.contains(`${PN.container} .moj-primary-navigation__link`, 'Accounts', this.common.getTimeoutOptions())
        .should('be.visible')
        .click();

      cy.location('pathname', this.common.getPathTimeoutOptions()).should('include', '/fines/dashboard/accounts');
      this.common.assertHeaderContains('Accounts');
    });
  }

  /**
   * Opens the Check and Validate Draft Accounts page from the authenticated home area.
   */
  openPage(): void {
    log('navigate', 'Opening Check and Validate Draft Accounts');
    this.ensureAccountsLandingPage();
    cy.get(CHECK_AND_VALIDATE_DRAFT_ACCOUNTS_LINK, { timeout: 10_000 }).should('be.visible').click({ force: true });
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
   * Clicks the GOV.UK back link on Check and Validate pages.
   * @description Returns to the draft listings from a draft detail view or nested page.
   * @example
   *   this.goBack();
   */
  goBack(): void {
    log('navigate', 'Clicking back link on Check and Validate Draft Accounts');
    cy.get(DraftAccountsTableLocators.backLink, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Asserts that the specified checker tab has aria-current="page".
   * @param tab - Tab name to assert.
   */
  assertTabActive(tab: CheckAndValidateTab): void {
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

    log('assert', 'Asserting Check and Validate tab is active', { tab, selector });
    cy.get(selector, this.common.getTimeoutOptions()).should('have.attr', 'aria-current', 'page');
  }

  /**
   * Asserts the checker tab heading (h2) matches the expected text.
   * @param expected - Expected heading such as "To review", "Deleted".
   */
  assertStatusHeading(expected: string): void {
    log('assert', 'Asserting checker status heading', { expected });
    cy.get(DraftAccountsTableLocators.tabHeading, this.common.getTimeoutOptions())
      .should('be.visible')
      .invoke('text')
      .then((text) => expect(text.trim().toLowerCase()).to.include(expected.trim().toLowerCase()));
  }

  /**
   * Asserts the success banner message displayed above the checker tabs.
   * @param message - Expected banner text.
   */
  assertSuccessBannerMessage(message: string): void {
    const resolved = applyUniqPlaceholder(message);
    log('assert', 'Checking success banner message', { message: resolved });
    cy.get(CheckAndValidateReviewLocators.banner.success, this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        cy.get(CheckAndValidateReviewLocators.banner.content, this.common.getTimeoutOptions()).should(
          'contain.text',
          resolved,
        );
      });
  }
}
