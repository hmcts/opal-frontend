/**
 * @fileoverview Actions for Manual Account Creation - Personal details task.
 * Handles entry of required personal fields.
 */
import { ManualPersonalDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/personal-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export class ManualPersonalDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Fills the minimum required personal details.
   */
  fillBasicDetails(payload: { title: string; firstNames: string; lastName: string; addressLine1: string }): void {
    log('type', 'Completing personal details', payload);
    this.selectTitle(payload.title);
    this.typeText(L.firstNamesInput, payload.firstNames, 'First names');
    this.typeText(L.lastNameInput, payload.lastName, 'Last name');
    this.typeText(L.addressLine1Input, payload.addressLine1, 'Address line 1');
  }

  /**
   * Selects a title from the dropdown.
   * @param title - Title option to choose (e.g., "Mr", "Ms").
   */
  private selectTitle(title: string): void {
    log('select', 'Selecting title', { title });
    cy.get(L.titleSelect, this.common.getTimeoutOptions()).should('be.visible').select(title);
  }

  /**
   * Types text into a provided input and logs the action.
   * @param selector - CSS selector for the input.
   * @param value - Value to type.
   * @param label - Human-readable label for logging.
   */
  private typeText(selector: string, value: string, label: string): void {
    cy.get(selector, this.common.getTimeoutOptions())
      .should('be.visible')
      .clear({ force: true })
      .type(value, { delay: 0 });
    log('type', `Set ${label}`, { value });
  }
}
