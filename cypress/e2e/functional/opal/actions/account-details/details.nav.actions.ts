import { AccountNavDetailsLocators as N } from '../../../../../shared/selectors/account-details/account.nav.details.locators';
import { log } from '../../../../../support/utils/log.helper';

/**
 * @file account.details.nav.actions.ts
 * @description
 * Defines navigation and shell-level actions for the Account Details page,
 * including switching between sub-navigation tabs and interacting with
 * header-level buttons such as “Add account note”.
 *
 * @remarks
 * - Relies on centralized selectors from `AccountNavDetailsLocators`.
 * - Commonly used by flows like `AccountEnquiryFlow` and actions verifying
 *   correct tab transitions.
 * - Each method includes Cypress logging and consistent assertions.
 */
export class AccountDetailsNavActions {
  /**
   * Clicks the "Add account note" button in the page header.
   *
   * @description
   * Locates and clicks the “Add account note” button visible within the
   * Account Details shell header.
   *
   * @remarks
   * - Uses `force: true` to ensure interaction even if overlapping elements exist.
   * - Waits up to 10 seconds for visibility before clicking.
   *
   * @example
   *  const nav = new AccountDetailsNavActions();
   *  nav.clickAddAccountNoteButton();
   */
  clickAddAccountNoteButton(): void {
    log('navigate', 'Clicking "Add account note" button');

    cy.get(N.addAccountNoteButton, { timeout: 10_000 }).should('be.visible').click({ force: true });
  }

  /**
   * Navigates to the "Defendant" tab within the Account Details shell.
   *
   * @description
   * Clicks the “Defendant” sub-navigation tab link using the centralized
   * locator and waits for the tab to become active.
   *
   * @remarks
   * - Relies on `subNav.defendantTab` from `AccountNavDetailsLocators`.
   * - Does not assert tab activation by default (pair with `assertDefendantTabIsActive()`).
   *
   * @example
   *  const nav = new AccountDetailsNavActions();
   *  nav.goToDefendantTab();
   *  nav.assertDefendantTabIsActive();
   */
  goToDefendantTab(): void {
    log('navigate', 'Navigating to "Defendant" tab');

    cy.get(N.subNav.defendantTab, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Navigates to the "Parent or guardian" tab within the Account Details shell.
   *
   * @description
   * Clicks the “Parent or guardian” sub-navigation tab and prepares for assertions
   * or further content checks within the tab panel.
   *
   * @remarks
   * - Relies on `subNav.parentOrGuardianTab` in `AccountNavDetailsLocators`.
   * - Does not automatically verify activation; pair with `assertParentGuardianTabIsActive()`.
   *
   * @example
   *  const nav = new AccountDetailsNavActions();
   *  nav.goToParentGuardianTab();
   *  nav.assertParentGuardianTabIsActive();
   */
  goToParentGuardianTab(): void {
    log('navigate', 'Navigating to "Parent or guardian" tab');

    cy.get(N.subNav.parentOrGuardianTab, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Asserts that the "Parent or guardian" tab is currently active.
   *
   * @description
   * Validates that the currently active sub-navigation tab link contains
   * the label “Parent or guardian” and has `aria-current="page"`.
   *
   * @example
   *  const nav = new AccountDetailsNavActions();
   *  nav.assertParentGuardianTabIsActive();
   */
  assertParentGuardianTabIsActive(): void {
    log('assert', 'Asserting "Parent or guardian" tab is active');

    cy.get(N.subNav.currentTab, { timeout: 10_000 })
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page')
      .and('contain.text', 'Parent or guardian');
  }

  /**
   * Asserts that the "Defendant" tab is currently active.
   *
   * @description
   * Confirms that the active tab link displays “Defendant” and has the
   * appropriate `aria-current="page"` attribute.
   *
   * @example
   *  const nav = new AccountDetailsNavActions();
   *  nav.assertDefendantTabIsActive();
   */
  assertDefendantTabIsActive(): void {
    log('assert', 'Asserting "Defendant" tab is active');

    cy.get(N.subNav.currentTab, { timeout: 10_000 })
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page')
      .and('contain.text', 'Defendant');
  }

  /**
   * Asserts that the "At a glance" tab is currently active.
   *
   * @description
   * Confirms that the active sub-navigation tab shows the label “At a glance”
   * and has `aria-current="page"`.
   *
   * @example
   *  const nav = new AccountDetailsNavActions();
   *  nav.assertAtAGlanceTabIsActive();
   */
  assertAtAGlanceTabIsActive(): void {
    log('assert', 'Asserting "At a glance" tab is active');

    cy.get(N.subNav.currentTab, { timeout: 10_000 })
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page')
      .and('contain.text', 'At a glance');
  }
}
