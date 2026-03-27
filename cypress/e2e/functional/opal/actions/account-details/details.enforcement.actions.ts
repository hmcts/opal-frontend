/**
 * @file details.enforcement.actions.ts
 * @description Actions for the Account Details "Enforcement" tab and add override form.
 */
import { ACCOUNT_ENQUIRY_ENFORCEMENT_STATUS_ELEMENTS as ENF } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement.locators';
import { DOM_ELEMENTS as ENF_OVR } from '../../../../../shared/selectors/account-enquiry/account.enquiry.enforcement-override-add.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsEnforcementActions');

/**
 * Actions for the Account Details enforcement tab and add override form.
 */
export class AccountDetailsEnforcementActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;

  /**
   * Asserts the Enforcement tab content is visible.
   */
  public assertEnforcementTabVisible(): void {
    log('assert', 'Enforcement tab is visible');
    cy.contains(ENF.tableTitle, 'Enforcement overview', { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
      'be.visible',
    );
  }

  /**
   * Opens the add enforcement override form from the Enforcement tab.
   */
  public openAddEnforcementOverrideForm(): void {
    log('navigate', 'Opening add enforcement override form');
    cy.get(ENF.addEnforcementOverrideLink, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }

  /**
   * Asserts the add enforcement override form is visible.
   */
  public assertAddEnforcementOverrideFormVisible(): void {
    log('assert', 'Add enforcement override form is visible');
    cy.get(ENF_OVR.title, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('contain.text', 'Add enforcement override');
    cy.get(ENF_OVR.enfOverrideDropdown, { timeout: AccountDetailsEnforcementActions.DEFAULT_TIMEOUT }).should(
      'be.visible',
    );
  }
}
