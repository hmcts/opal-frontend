/**
 * @file edit-defendant-details.actions.ts
 * Provides Cypress actions and assertions for editing defendant details within the Opal application.
 */

import { DefendantDetailsLocators as L } from '../../../../../shared/selectors/account-details/edit.defendant.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('EditDefendantDetailsActions');

/** Actions for editing defendant details within Account Details. */
export class EditDefendantDetailsActions {
  private static readonly DEFAULT_TIMEOUT = 10_000;
  private readonly common = new CommonActions();
  private readonly defendantFieldLocators = {
    'Address line 1': L.addressLine1Input,
    'Address line 2': L.addressLine2Input,
    'Address line 3': L.addressLine3Input,
    Postcode: L.postcodeInput,
    'Primary email address': L.primaryEmailInput,
    'Secondary email address': L.secondaryEmailInput,
    'Mobile telephone number': L.mobileTelInput,
    'Home telephone number': L.homeTelInput,
    'Work telephone number': L.workTelInput,
    'Make and model': L.vehicleMakeModelInput,
    'Registration number': L.vehicleRegInput,
  } as const;

  /**
   * Ensures the user is still on the edit page (form visible, not navigated away).
   */
  public assertStillOnEditPage(): void {
    log('assert', 'Asserting Defendant Details edit form is visible');
    cy.get(L.form.selector, { timeout: 10_000 }).should('be.visible');
    log('done', 'Defendant Details edit form confirmed visible');
  }

  /**
   * Asserts the convert handoff lands on the Defendant details convert route.
   */
  public assertOnConvertRoute(): void {
    log('assert', 'Asserting Defendant details convert route');
    cy.location('pathname', { timeout: this.common.getPathTimeout() }).should(
      'match',
      /\/fines\/account\/defendant\/\d+\/party\/individual\/convert$/,
    );
    cy.get(L.form.selector, { timeout: EditDefendantDetailsActions.DEFAULT_TIMEOUT }).should('be.visible');
  }

  /**
   * Asserts Defendant details form fields are pre-populated with the expected values.
   *
   * @param expectedFieldValues - Key/value map of ticket field labels to expected values.
   */
  public assertPrefilledFieldValues(expectedFieldValues: Record<string, string>): void {
    Object.entries(expectedFieldValues).forEach(([fieldName, expectedValue]) => {
      const fieldSelector = this.defendantFieldLocators[fieldName as keyof typeof this.defendantFieldLocators];
      if (!fieldSelector) {
        throw new Error(`Unsupported defendant prefill field: ${fieldName}`);
      }

      log('assert', 'Asserting defendant field prefill', { fieldName, expectedValue });
      cy.get(fieldSelector.selector, this.common.getTimeoutOptions()).should('have.value', expectedValue);
    });
  }

  /**
   * Updates the "First names" field on the edit form.
   *
   * @param value - The new first name to enter.
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for elements (default 10_000ms).
   * @param opts.assert Whether to assert the value after typing (default true).
   */
  public updateFirstName(value: string, opts?: { timeout?: number; assert?: boolean }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('method', `Updating First Name field to: "${value}"`);

    // Ensure the edit form is visible before interaction
    cy.get(L.form.selector, { timeout }).should('be.visible');

    // Target the concrete input by ID and type the new value
    log('action', 'Typing into First Name field');
    cy.get(L.forenamesInput.selector, { timeout })
      .should('be.visible')
      .and('be.enabled')
      .scrollIntoView()
      .clear({ force: true })
      .type(value)
      .blur();

    // Optional assertion to verify input value
    if (opts?.assert !== false) {
      log('assert', `Verifying First Name field value equals "${value}"`);
      cy.get(L.forenamesInput.selector).should('have.value', value);
      log('done', 'First Name field value updated successfully');
    }
  }

  /**
   * Asserts that the "First names" input value matches the expected text.
   *
   * @param expected - The expected value for the First names field.
   * @param opts Optional configuration.
   * @param opts.timeout Max wait for form/field visibility (default 10_000ms).
   */
  public assertFirstNameValue(expected: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('assert', `Asserting First Name value equals "${expected}"`);
    cy.get(L.form.selector, { timeout }).should('be.visible');
    cy.get(L.forenamesInput.selector, { timeout }).should('be.visible').and('have.value', expected);
    log('done', `Verified First Name is "${expected}"`);
  }

  /**
   * Clicks the Save changes button on the edit form.
   */
  public saveChanges(): void {
    log('action', 'Saving defendant details');
    cy.get(L.saveChangesButton.selector, { timeout: 10_000 }).should('be.visible').click();
  }
}
