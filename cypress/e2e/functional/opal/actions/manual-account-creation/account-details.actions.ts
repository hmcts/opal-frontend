/**
 * @fileoverview Actions for Manual Account Creation - Account details task list.
 * Provides helpers to open tasks, assert status, and confirm header presence.
 */
import {
  ManualAccountDetailsLocators as L,
  ManualAccountTaskName,
} from '../../../../../shared/selectors/manual-account-creation/account-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

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

  /**
   * Asserts a language preference value in the Account details summary list.
   * @param label - Row label ("Document language" or "Hearing language").
   * @param expectedValue - Expected value text.
   */
  assertLanguagePreference(label: 'Document language' | 'Hearing language', expectedValue: string): void {
    log('assert', 'Checking account language preference', { label, expectedValue });

    cy.contains(L.summaryList.languageRow, label, this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        cy.get(L.summaryList.value)
          .invoke('text')
          .should((text) => expect(text.trim()).to.equal(expectedValue));
      });
  }

  /**
   * Opens the Change link for a language preference row.
   * @param label - Row label ("Document language" or "Hearing language").
   */
  openLanguagePreference(label: 'Document language' | 'Hearing language'): void {
    log('navigate', 'Opening language preference change link', { label });

    cy.contains(L.summaryList.languageRow, label, this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        cy.get(L.summaryList.changeLink).should('contain.text', 'Change').scrollIntoView().click({ force: true });
      });
  }
}
