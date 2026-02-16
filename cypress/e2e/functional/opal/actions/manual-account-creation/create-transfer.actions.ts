import { createScopedLogger } from 'cypress/support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { CreateNewOrTransferInLocators } from 'cypress/shared/selectors/manual-account-creation/create-transfer.locators';

const log = createScopedLogger('ManualCreateOrTransferInActions');

export type OriginatorType = 'New' | 'Transfer in';

/**  Actions for the Manual Create or Transfer In, manual account creation entry point */
export class ManualCreateOrTransferInActions {
  private readonly common = new CommonActions();

  DEFAULT_TIMEOUT = this.common.getPathTimeout();

  /**
   * Asserts that the user is on the Create New or Transfer In page by checking for the presence of the page header.
   * @param expectedHeader Optional header text to assert.*/
  assertOnCreateOrTransferInPage(expectedHeader: string = 'Do you want to create a new account or transfer in?'): void {
    log('assert', 'Asserting on create new or transfer in page', { expectedHeader });
    cy.get(CreateNewOrTransferInLocators.pageHeader, { timeout: this.DEFAULT_TIMEOUT }).should(
      'contain.text',
      expectedHeader,
    );
  }

  /**
   * Selects an originator type radio option based on the provided originator type.
   * @param originatorType The type of originator to select, either "New" or "Transfer in".
   */
  selectOriginatorType(originatorType: OriginatorType): void {
    log('type', 'Selecting originator type', { originatorType });
    const selector =
      originatorType === 'New'
        ? CreateNewOrTransferInLocators.originatorType.createNew
        : CreateNewOrTransferInLocators.originatorType.transferIn;
    cy.get(selector, { timeout: this.DEFAULT_TIMEOUT }).first().should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Clicks the continue button to proceed with account creation after selecting the originator type.
   */
  continueToCreateAccount(): void {
    log('click', 'Clicking continue to create account');
    cy.get(CreateNewOrTransferInLocators.continueButton, { timeout: this.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Clicks the cancel link to return to the previous page or dashboard. */
  clickCancel(): void {
    log('click', 'Clicking cancel link');
    cy.get(CreateNewOrTransferInLocators.cancelLink, { timeout: this.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click({ force: true });
  }
}
