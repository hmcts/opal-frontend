/**
 * @fileoverview Actions for Manual Account Creation - Create account page.
 * Encapsulates business unit selection, account type/defendant type selection, and navigation to task list.
 */
import { ManualCreateAccountLocators as L } from '../../../../../shared/selectors/manual-account-creation/create-account.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export type AccountType = 'Fine' | 'Fixed penalty' | 'Fixed Penalty' | 'Conditional caution' | 'Conditional Caution';
export type DefendantType =
  | 'Adult or youth'
  | 'Adult or youth only'
  | 'Adult or youth with parent or guardian to pay'
  | 'Parent or guardian'
  | 'Company';

export class ManualCreateAccountActions {
  private readonly common = new CommonActions();

  /**
   * Confirms the Manual Account Creation landing page is visible.
   *
   * @param expectedHeader Optional header text to assert.
   */
  assertOnCreateAccountPage(expectedHeader: string = 'Business unit and defendant type'): void {
    log('assert', 'Asserting manual account creation landing page', { expectedHeader });
    cy.get(L.pageHeader, { timeout: 15_000 }).should('contain.text', expectedHeader);
  }

  /**
   * Selects a business unit via autocomplete.
   */
  selectBusinessUnit(businessUnit: string): void {
    log('type', 'Selecting business unit', { businessUnit });

    cy.get('body').then(($body) => {
      const inputEl = $body.find(L.businessUnit.input).first();

      if (!inputEl.length) {
        log('info', 'Business unit input not present; single unit assumed by application');
        return;
      }

      cy.wrap(inputEl)
        .should('be.visible')
        .clear({ force: true })
        .type(businessUnit, { delay: 0 });

      cy.get(L.businessUnit.listbox, this.common.getTimeoutOptions()).should('be.visible');
      cy.wrap(inputEl).type('{downarrow}{enter}');

      cy.wrap(inputEl)
        .invoke('val')
        .should((val) => {
          expect(String(val ?? '')).to.not.equal('', 'Business unit should be selected');
        });
    });
  }

  /**
   * Chooses an account type radio option.
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
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Chooses a defendant type radio option.
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
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Continues to the Account Details task list.
   */
  continueToAccountDetails(): void {
    log('navigate', 'Continuing to account details task list');
    cy.get(L.continueButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }
}
