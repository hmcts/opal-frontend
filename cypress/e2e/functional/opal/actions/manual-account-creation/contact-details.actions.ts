/**
 * @file Actions for Manual Account Creation - Contact details task.
 * Manages contact field entry, navigation CTAs, cancel handling, and inline errors.
 */
import { ManualContactDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/contact-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('ManualContactDetailsActions');

export type ManualContactFieldKey = 'primaryEmail' | 'secondaryEmail' | 'mobileNumber' | 'homeNumber' | 'workNumber';

/**
 * Actions for the Manual Account Creation Contact details page.
 *
 * Each method performs a single interaction to keep step definitions thin.
 */
export class ManualContactDetailsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Contact details page is loaded with the expected header.
   * @param expectedHeader Expected page header text.
   */
  assertOnContactDetailsPage(expectedHeader: string = 'contact details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Fills contact details fields supplied in the payload.
   * @param payload Field/value pairs for contact details.
   */
  fillContactDetails(payload: Partial<Record<ManualContactFieldKey, string>>): void {
    const entries = Object.entries(payload ?? {}).filter(([, v]) => v !== undefined);
    log('type', 'Filling contact details', { payload: { ...payload }, fields: entries.map(([k]) => k) });

    if (!entries.length) {
      log('warn', 'fillContactDetails received an empty payload; skipping field updates');
      return;
    }

    if (payload.primaryEmail !== undefined) {
      log('type', 'Setting primary email', { value: payload.primaryEmail });
      this.setFieldValue('primaryEmail', payload.primaryEmail);
    }
    if (payload.secondaryEmail !== undefined) {
      log('type', 'Setting secondary email', { value: payload.secondaryEmail });
      this.setFieldValue('secondaryEmail', payload.secondaryEmail);
    }
    if (payload.mobileNumber !== undefined) {
      log('type', 'Setting mobile number', { value: payload.mobileNumber });
      this.setFieldValue('mobileNumber', payload.mobileNumber);
    }
    if (payload.homeNumber !== undefined) {
      log('type', 'Setting home number', { value: payload.homeNumber });
      this.setFieldValue('homeNumber', payload.homeNumber);
    }
    if (payload.workNumber !== undefined) {
      log('type', 'Setting work number', { value: payload.workNumber });
      this.setFieldValue('workNumber', payload.workNumber);
    }
  }

  /**
   * Clears a single contact details field.
   * @param field Contact field key to clear.
   */
  clearField(field: ManualContactFieldKey): void {
    log('clear', `Clearing contact field: ${field}`);
    this.typeIntoField(field, '');
  }

  /**
   * Sets a single contact details field.
   * @param field Contact field key to set.
   * @param value Text value to enter.
   */
  setFieldValue(field: ManualContactFieldKey, value: string): void {
    log('type', `Setting contact field: ${field}`, { value });
    this.typeIntoField(field, value);
  }

  /**
   * Asserts the value of a contact details field.
   * @param field Contact field key to assert.
   * @param expected Expected field value.
   */
  assertFieldValue(field: ManualContactFieldKey, expected: string): void {
    cy.get(this.getSelector(field), this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Asserts an inline error message for a given field.
   * @param field Contact field key to target.
   * @param expected Expected inline error text.
   */
  assertInlineError(field: ManualContactFieldKey, expected: string): void {
    cy.get(this.getSelector(field), this.common.getTimeoutOptions())
      .closest('.govuk-form-group, opal-lib-govuk-text-input')
      .find(L.inlineError)
      .should('be.visible')
      .and('contain.text', expected);
  }

  /**
   * Clicks the Add employer details button.
   */
  clickAddEmployerDetails(): void {
    log('navigate', 'Continuing via Add employer details');
    cy.get(L.addEmployerDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Clicks the Add offence details button.
   */
  clickAddOffenceDetails(): void {
    log('navigate', 'Continuing via Add offence details');
    cy.get(L.addOffenceDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Handles Cancel click with a specified confirmation choice.
   * @param choice Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling contact details edit', { choice, accept });

    this.common.confirmNextUnsavedChanges(accept);
    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Types into the targeted contact field, clearing first.
   *
   * @param field - Logical contact field key (maps to a selector).
   * @param value - Text to enter; empty string leaves the field cleared.
   */
  private typeIntoField(field: ManualContactFieldKey, value: string): void {
    cy.log(`CONTACT: ${field} -> "${value}"`);

    cy.get(this.getSelector(field), this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .clear({ force: true })
      .should('have.value', '')
      .then(($input) => {
        if (value === '') {
          return;
        }

        cy.wrap($input).type(value, { delay: 0, force: true }).should('have.value', value);
      });
  }

  /**
   * Resolves a contact field key to its DOM selector.
   *
   * @param field - Logical field name for contact details.
   * @returns CSS selector string.
   */
  private getSelector(field: ManualContactFieldKey): string {
    switch (field) {
      case 'primaryEmail':
        return L.primaryEmailInput;
      case 'secondaryEmail':
        return L.secondaryEmailInput;
      case 'mobileNumber':
        return L.mobileTelephoneInput;
      case 'homeNumber':
        return L.homeTelephoneInput;
      case 'workNumber':
        return L.workTelephoneInput;
      default:
        throw new Error(`Unknown contact field: ${field}`);
    }
  }
}
