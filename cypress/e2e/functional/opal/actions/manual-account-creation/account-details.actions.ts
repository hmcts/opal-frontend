import {
  ManualAccountDetailsLocators as L,
  ManualAccountTaskName,
} from '../../../../../shared/selectors/manual-account-creation/account-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common.actions';

export class ManualAccountDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Opens a task list item by its display name.
   */
  openTask(taskName: ManualAccountTaskName): void {
    log('navigate', 'Opening task from account details', { taskName });

    cy.get(L.taskList.itemByName(taskName), this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        cy.get(L.taskList.link).first().should('be.visible').click();
      });
  }

  /**
   * Asserts the status text for a given task list item.
   */
  assertTaskStatus(taskName: ManualAccountTaskName, expectedStatus: string): void {
    log('assert', 'Asserting task status', { taskName, expectedStatus });

    cy.get(L.taskList.itemByName(taskName), this.common.getTimeoutOptions())
      .should('be.visible')
      .find(L.taskList.status)
      .should('contain.text', expectedStatus);
  }

  /**
   * Ensures the Account Details header is visible.
   */
  assertOnAccountDetailsPage(expectedHeader: string = 'Account details'): void {
    this.common.assertHeaderContains(expectedHeader);
  }
}
