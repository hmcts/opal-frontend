/**
 * @file Actions for Manual Account Creation - Create account page.
 * @description Encapsulates business unit selection, account type/defendant type selection, and navigation to task list.
 */
import { MacCreateAccountLocators as L } from '../../../../../shared/selectors/manual-account-creation/mac.create-account.locators';
import { PrimaryNavigationLocators as PN } from '../../../../../shared/selectors/primary-navigation.locators';
import { CreateManageDraftsLocators as CAM } from '../../../../../shared/selectors/create-manage-drafts.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { AccountType } from '../../../../../support/utils/payloads';

const log = createScopedLogger('ManualCreateAccountActions');
const DIRECT_MANUAL_ACCOUNT_CREATION_LINK = '#finesMacLink';
const CREATE_AND_MANAGE_DRAFT_ACCOUNTS_LINK = '#finesCavInputterLink';

export type DefendantType =
  | 'Adult or youth'
  | 'Adult or youth only'
  | 'Adult or youth with parent or guardian to pay'
  | 'Parent or guardian'
  | 'Company';

/** Actions for the Manual Account Creation landing page. */
export class ManualCreateAccountActions {
  private readonly common = new CommonActions();

  private isOnMacOriginatorPage(pathname: string): boolean {
    return pathname.includes('/originator-type') || pathname.includes('/create-or-transfer-in');
  }

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

  private navigateToMac(linkSelector: string, missingLinkMessage: string, afterLinkClick?: () => void): void {
    const clickRoute = () => {
      cy.get(linkSelector, { timeout: 20_000 }).first().should('be.visible').click({ force: true });
      if (afterLinkClick) afterLinkClick();
    };

    const verifyAfterFailedRetry = () => {
      cy.location('pathname', { timeout: 10_000 }).then((pathname) => {
        if (this.isOnMacOriginatorPage(pathname)) {
          log('navigate', 'Navigation link not visible after refresh, but already on originator page');
          return;
        }

        throw new Error(
          `Manual Account Creation navigation failed: "${linkSelector}" was not found after refresh ` +
            `(path: ${pathname}).`,
        );
      });
    };

    cy.location('pathname', { timeout: 10_000 }).then((pathname) => {
      if (this.isOnMacOriginatorPage(pathname)) {
        log('navigate', 'Already on the Manual Account Creation originator page');
        return;
      }

      cy.get('body', { timeout: 20_000 })
        .should('be.visible')
        .then(($body) => {
          if ($body.find(linkSelector).length) {
            clickRoute();
            return;
          }

          log('navigate', missingLinkMessage);
          cy.reload();

          cy.get('body', { timeout: 20_000 })
            .should('be.visible')
            .then(($bodyAfterRefresh) => {
              if ($bodyAfterRefresh.find(linkSelector).length) {
                clickRoute();
                return;
              }

              verifyAfterFailedRetry();
            });
        });
    });
  }

  /**
   * Opens Manual Account Creation from the authenticated home area.
   * @param route - `direct` uses the legacy direct link; `cam` uses Create and Manage Draft Accounts first.
   */
  openFromAuthenticatedHome(route: 'direct' | 'cam' = 'cam'): void {
    this.ensureAccountsLandingPage();

    if (route === 'direct') {
      log('navigate', 'Opening Manual Account Creation using direct home-area link');
      this.navigateToMac(
        DIRECT_MANUAL_ACCOUNT_CREATION_LINK,
        'Direct Manual Account Creation link not found; refreshing and retrying once',
      );
      return;
    }

    log('navigate', 'Opening Manual Account Creation using Create and Manage Draft Accounts route');
    this.navigateToMac(
      CREATE_AND_MANAGE_DRAFT_ACCOUNTS_LINK,
      'Create and Manage Draft Accounts link not found; refreshing and retrying once',
      () => {
        cy.get(CAM.createAccountButton, { timeout: 20_000 }).should('be.visible').click({ force: true });
      },
    );
  }

  /**
   * Confirms the Manual Account Creation landing page is visible.
   *
   * @param expectedHeader Optional header text to assert.
   */
  assertOnCreateAccountPage(expectedHeader: string = 'Create account'): void {
    log('assert', 'Asserting manual account creation landing page', { expectedHeader });
    cy.get(L.pageHeader, { timeout: 15_000 }).should('contain.text', expectedHeader);
  }

  /**
   * Selects a business unit via autocomplete.
   * @param businessUnit Business unit name to select.
   */
  selectBusinessUnit(businessUnit: string): void {
    log('type', 'Selecting business unit', { businessUnit });
    cy.get(L.businessUnit.input, { timeout: 15_000 })
      .first()
      .should('exist')
      .should('be.visible')
      .scrollIntoView()
      .clear({ force: true })
      .type(businessUnit, { delay: 0, force: true });

    cy.get(L.businessUnit.listbox, this.common.getTimeoutOptions()).first().should('be.visible');

    cy.get(L.businessUnit.input).first().focus().type('{downarrow}{enter}', { force: true });

    cy.get(L.businessUnit.input)
      .first()
      .invoke('val')
      .should((val) => {
        expect(String(val ?? '')).to.not.equal('', 'Business unit should be selected');
      });
  }

  /**
   * Chooses an account type radio option.
   * @param type Account type to select (Fine/Fixed penalty/Conditional caution).
   */
  selectAccountType(type: AccountType): void {
    const normalized = type.toLowerCase();
    const selector =
      normalized === 'fine'
        ? L.accountType.fine
        : normalized.startsWith('fixed penalty')
          ? L.accountType.fixedPenalty
          : L.accountType.conditionalCaution;

    log('click', 'Selecting account type', { type });
    cy.get(selector, this.common.getTimeoutOptions()).first().should('exist').scrollIntoView().check({ force: true });

    if (normalized === 'fine') {
      cy.get(L.defendantTypePanel.fine, this.common.getTimeoutOptions()).should('be.visible');
    } else if (normalized.startsWith('fixed penalty')) {
      cy.get(L.defendantTypePanel.fixedPenalty, this.common.getTimeoutOptions()).should('be.visible');
    }
  }

  /**
   * Chooses a defendant type radio option.
   * @param defendantType Defendant type to select.
   */
  selectDefendantType(defendantType: DefendantType): void {
    const normalized = defendantType.toLowerCase();
    let selector: string = L.defendantType.adultOrYouth;

    if (normalized.includes('guardian')) {
      selector = L.defendantType.parentOrGuardianToPay;
    } else if (normalized.includes('company')) {
      selector = L.defendantType.company;
    }

    log('click', 'Selecting defendant type', { defendantType });
    cy.get('body', this.common.getTimeoutOptions()).then(($body) => {
      const fixedPenaltyChecked = $body.find(L.accountType.fixedPenalty).filter(':checked').length > 0;
      const fineChecked = $body.find(L.accountType.fine).filter(':checked').length > 0;

      const panelSelector = fixedPenaltyChecked
        ? L.defendantTypePanel.fixedPenalty
        : fineChecked
          ? L.defendantTypePanel.fine
          : null;

      if (panelSelector) {
        cy.get(panelSelector, this.common.getTimeoutOptions())
          .should('be.visible')
          .within(() => {
            cy.get(selector, this.common.getTimeoutOptions())
              .first()
              .should('exist')
              .scrollIntoView()
              .check({ force: true });
          });
        return;
      }

      cy.get(selector, this.common.getTimeoutOptions())
        .filter(':visible')
        .first()
        .should('exist')
        .scrollIntoView()
        .check({ force: true });
    });
  }

  /**
   * Continues to the Account Details task list.
   */
  continueToAccountDetails(): void {
    log('navigate', 'Continuing to account details task list');
    cy.get(L.continueButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Clicks the back link to return to the previous page.
   */
  selectBackLink(): void {
    log('navigate', 'Clicking back link');
    cy.get(L.backLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Confirms the Manual Account Creation Trnsfer In landing page is visible.
   *
   * @param expectedHeader Optional header text to assert.
   */
  assertOnTransferInPage(expectedHeader: string = 'Transfer in'): void {
    log('assert', 'Asserting manual account creation landing page', { expectedHeader });
    cy.get(L.pageHeader, { timeout: 15_000 }).should('contain.text', expectedHeader);
  }

  /**
   * Handles Cancel click with the provided confirm choice.
   * @param choice Confirmation choice (Cancel/Ok).
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling create account', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);

    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click({ force: true });
  }
}
