/**
 * @file Actions for Manual Account Creation - Account details task list.
 * Provides helpers to open tasks, assert status, and confirm header presence.
 */
import {
  ManualAccountDetailsLocators as L,
  ManualAccountTaskName,
} from '../../../../../shared/selectors/manual-account-creation/account-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('ManualAccountDetailsActions');
const TASK_NAMES: ManualAccountTaskName[] = [
  'Account comments and notes',
  'Company details',
  'Contact details',
  'Court details',
  'Employer details',
  'Parent or guardian details',
  'Personal details',
  'Offence details',
  'Payment terms',
];

/**
 * Task list helpers for Manual Account Creation Account details.
 */
export class ManualAccountDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Opens a task list item by its display name.
   * @param taskName Task display name from the account details list.
   */
  openTask(taskName: ManualAccountTaskName): void {
    const normalizedTask = (taskName ?? '').trim() as ManualAccountTaskName;
    if (!TASK_NAMES.includes(normalizedTask)) {
      throw new Error(`Unsupported Account details task "${taskName}". Expected one of: ${TASK_NAMES.join(', ')}`);
    }

    log('navigate', 'Opening task from account details', { taskName: normalizedTask });

    cy.get(L.taskList.itemByName(normalizedTask), this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        cy.get(L.taskList.link).first().should('be.visible').click();
      });
  }

  /**
   * Asserts the status text for a given task list item.
   * @param taskName Task display name to check.
   * @param expectedStatus Expected status text (e.g., "Completed").
   * @param expectedHeader Expected Account details header (defaults to "Account details").
   */
  assertTaskStatus(
    taskName: ManualAccountTaskName,
    expectedStatus: string,
    expectedHeader: string = 'Account details',
  ): void {
    log('assert', 'Asserting task status', { taskName, expectedStatus, expectedHeader });

    this.assertOnAccountDetailsPage(expectedHeader);
    cy.get(L.taskList.itemByName(taskName), this.common.getTimeoutOptions())
      .should('be.visible')
      .find(L.taskList.status)
      .should('contain.text', expectedStatus);
  }

  /**
   * Ensures the Account Details header is visible.
   */
  /**
   * Asserts the account details page is loaded.
   * - Always guards the pathname to include `/account-details`.
   * - If `expectedHeader` is provided, asserts the header contains it.
   * - If `expectedHeader` is omitted/undefined, asserts the default header "Account details".
   * - If `expectedHeader` is null, skips header assertion (path guard still applies).
   * @param expectedHeader Optional header to assert; null skips header assertion.
   */
  assertOnAccountDetailsPage(expectedHeader?: string | null): void {
    cy.location('pathname', this.common.getTimeoutOptions()).should('include', '/account-details');
    const headerToAssert = expectedHeader === undefined ? 'Account details' : expectedHeader;
    if (headerToAssert) {
      this.common.assertHeaderContains(headerToAssert);
    }
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
