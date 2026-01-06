/**
 * @file Actions for Manual Account Creation - Employer details task.
 * Each method performs a single responsibility (field entry, assertions, cancel handling).
 */
import { ManualEmployerDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/employer-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('ManualEmployerDetailsActions');

export type ManualEmployerFieldKey =
  | 'employerName'
  | 'employeeReference'
  | 'employerEmail'
  | 'employerTelephone'
  | 'addressLine1'
  | 'addressLine2'
  | 'addressLine3'
  | 'addressLine4'
  | 'addressLine5'
  | 'postcode';

/** Actions for the Manual Account Creation employer details task. */
export class ManualEmployerDetailsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts we are on the Employer details page.
   * @param expectedHeader Expected page header text.
   */
  assertOnEmployerDetailsPage(expectedHeader: string = 'Employer details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/employer-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Completes employer details fields using the provided payload.
   * @param payload Field/value pairs for employer details.
   */
  fillEmployerDetails(payload: Partial<Record<ManualEmployerFieldKey, string>>): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    log('type', 'Filling employer details', { payload: { ...payload }, fields: entries.map(([k]) => k) });

    if (!entries.length) {
      log('warn', 'fillEmployerDetails received an empty payload; skipping field updates');
      return;
    }

    entries.forEach(([field, value]) => this.setFieldValue(field as ManualEmployerFieldKey, value as string));
  }

  /**
   * Sets a single employer details field by key.
   * @param field Employer field key to update.
   * @param value Value to enter for the field.
   */
  setFieldValue(field: ManualEmployerFieldKey, value: string): void {
    log('type', 'Setting employer field', { field, value });
    this.typeIntoField(this.getSelector(field), value, field);
  }

  /**
   * Asserts the value of an employer details field.
   * @param field Employer field key to assert.
   * @param expected Expected value for the field.
   */
  assertFieldValue(field: ManualEmployerFieldKey, expected: string): void {
    cy.get(this.getSelector(field), this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Clears an employer details field.
   * @param field Employer field key to clear.
   */
  clearField(field: ManualEmployerFieldKey): void {
    log('clear', 'Clearing employer field', { field });
    this.typeIntoField(this.getSelector(field), '', field);
  }

  /**
   * Clicks the nested flow CTA (e.g., Add offence details).
   * @param expectedText Optional text expected on the nested flow button.
   */
  clickNestedFlowButton(expectedText?: string): void {
    log('navigate', 'Clicking nested flow button from Employer details', { expectedText });
    const options = this.common.getTimeoutOptions();
    const matcher = expectedText ? new RegExp(expectedText, 'i') : undefined;
    const button = matcher ? cy.contains(L.nestedFlowButton, matcher, options) : cy.get(L.nestedFlowButton, options);

    button.should('exist').scrollIntoView().click({ force: true });
  }

  /**
   * Handles Cancel click with the provided confirm choice.
   * @param choice Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling employer details edit', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);

    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click({ force: true });
  }

  /**
   * Asserts inline error text for a given employer field.
   * @param field Employer field key to target.
   * @param expected Expected inline error text.
   */
  assertInlineError(field: ManualEmployerFieldKey, expected: string): void {
    cy.get(this.getSelector(field), this.common.getTimeoutOptions())
      .closest('.govuk-form-group, opal-lib-govuk-text-input')
      .find(L.inlineError)
      .should('be.visible')
      .and('contain.text', expected);
  }

  /**
   * Clears and types into an employer input, asserting the resulting value.
   * @param selector Input selector to target.
   * @param value Value to type (empty clears).
   * @param label Logical label for logging.
   */
  private typeIntoField(selector: string, value: string, label: string): void {
    const input = cy.get(selector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });

    if (value === '') {
      input.should('have.value', '');
      return;
    }

    input.type(value, { delay: 0, force: true }).should(($el) => {
      const actual = ($el.val() ?? '').toString().toLowerCase();
      expect(actual).to.equal(value.toLowerCase());
    });
    log('type', `Field set for ${label}`, { value });
  }

  /**
   * Maps logical employer field keys to their DOM selectors.
   * @param field Employer field key to resolve.
   * @returns Selector string for the field.
   */
  private getSelector(field: ManualEmployerFieldKey): string {
    switch (field) {
      case 'employerName':
        return L.employerNameInput;
      case 'employeeReference':
        return L.employeeReferenceInput;
      case 'employerEmail':
        return L.employerEmailInput;
      case 'employerTelephone':
        return L.employerTelephoneInput;
      case 'addressLine1':
        return L.addressLine1Input;
      case 'addressLine2':
        return L.addressLine2Input;
      case 'addressLine3':
        return L.addressLine3Input;
      case 'addressLine4':
        return L.addressLine4Input;
      case 'addressLine5':
        return L.addressLine5Input;
      case 'postcode':
        return L.postcodeInput;
      default:
        throw new Error(`Unknown employer field: ${field as string}`);
    }
  }
}
