/**
 * @file Actions for Manual Account Creation - Personal details task.
 * @description Handles entry, assertions, and cancellation for the personal details form.
 */
import { ManualPersonalDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/personal-details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('ManualPersonalDetailsActions');

export type ManualPersonalDetailsFieldKey =
  | 'title'
  | 'firstNames'
  | 'lastName'
  | 'dob'
  | 'nationalInsuranceNumber'
  | 'addressLine1'
  | 'addressLine2'
  | 'addressLine3'
  | 'postcode'
  | 'vehicleMake'
  | 'vehicleRegistration';

export type ManualPersonalDetailsPayload = Partial<Record<ManualPersonalDetailsFieldKey, string>>;

/**
 * Encapsulates actions on the Personal details form to keep steps selector-free.
 */
export class ManualPersonalDetailsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Personal details page is loaded.
   * @param expectedHeader - Header text to assert (partial match).
   * @example
   *  actions.assertOnPersonalDetailsPage('Personal details');
   */
  assertOnPersonalDetailsPage(expectedHeader: string = 'Personal details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/personal-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Fills provided personal detail fields.
   * @param payload - Field/value map for the personal details form.
   * @example
   *  actions.fillPersonalDetails({ title: 'Mr', firstNames: 'Jane', lastName: 'Doe' });
   */
  fillPersonalDetails(payload: ManualPersonalDetailsPayload): void {
    const entries = Object.entries(payload ?? {}).filter(([, value]) => value !== undefined);
    log('type', 'Filling personal details', { payload: { ...payload }, fields: entries.map(([key]) => key) });

    if (!entries.length) {
      log('warn', 'fillPersonalDetails called with empty payload; no fields updated');
      return;
    }

    if (payload.title !== undefined) {
      this.setFieldValue('title', payload.title ?? '');
    }
    if (payload.firstNames !== undefined) {
      this.setFieldValue('firstNames', payload.firstNames ?? '');
    }
    if (payload.lastName !== undefined) {
      this.setFieldValue('lastName', payload.lastName ?? '');
    }
    if (payload.dob !== undefined) {
      this.setFieldValue('dob', payload.dob ?? '');
    }
    if (payload.nationalInsuranceNumber !== undefined) {
      this.setFieldValue('nationalInsuranceNumber', payload.nationalInsuranceNumber ?? '');
    }
    if (payload.addressLine1 !== undefined) {
      this.setFieldValue('addressLine1', payload.addressLine1 ?? '');
    }
    if (payload.addressLine2 !== undefined) {
      this.setFieldValue('addressLine2', payload.addressLine2 ?? '');
    }
    if (payload.addressLine3 !== undefined) {
      this.setFieldValue('addressLine3', payload.addressLine3 ?? '');
    }
    if (payload.postcode !== undefined) {
      this.setFieldValue('postcode', payload.postcode ?? '');
    }
    if (payload.vehicleMake !== undefined) {
      this.setFieldValue('vehicleMake', payload.vehicleMake ?? '');
    }
    if (payload.vehicleRegistration !== undefined) {
      this.setFieldValue('vehicleRegistration', payload.vehicleRegistration ?? '');
    }
  }

  /**
   * Backwards-compatible helper to fill required fields only.
   * @param payload - Required personal details fields.
   * @param payload.title Title to select.
   * @param payload.firstNames First names value.
   * @param payload.lastName Last name value.
   * @param payload.addressLine1 Address line 1 value.
   */
  fillBasicDetails(payload: { title: string; firstNames: string; lastName: string; addressLine1: string }): void {
    this.fillPersonalDetails(payload);
  }

  /**
   * Clears the supplied personal detail fields.
   * @param fields - Field keys to clear.
   */
  clearFields(fields: ManualPersonalDetailsFieldKey[]): void {
    log('clear', 'Clearing personal detail fields', { fields });
    fields.forEach((field) => {
      if (field === 'title') {
        cy.get(L.titleSelect, this.common.getTimeoutOptions())
          .then(($select) => {
            const hasEmptyOption = $select.find('option[value=""]').length > 0;
            if (!hasEmptyOption) {
              log('warn', 'Title select has no empty option; skipping clear');
              return;
            }
            cy.wrap($select).select('');
          })
          .should('exist');
        return;
      }

      this.typeIntoField(field, '');
    });
  }

  /**
   * Sets a single personal details field to the provided value.
   * @param field - Logical field key to set.
   * @param value - Value to enter or select.
   */
  setFieldValue(field: ManualPersonalDetailsFieldKey, value: string): void {
    if (field === 'title') {
      this.selectTitle(value);
      return;
    }
    this.typeIntoField(field, value);
  }

  /**
   * Asserts a personal details field matches the expected value.
   * @param field - Logical field key to assert.
   * @param expected - Expected value or selected text.
   */
  assertFieldValue(field: ManualPersonalDetailsFieldKey, expected: string): void {
    if (field === 'title') {
      this.assertTitleValue(expected);
      return;
    }

    cy.get(this.getSelector(field), this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Handles Cancel and chooses whether to leave or stay.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling Personal details edit', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);
    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Continues to Contact details via the nested CTA.
   * @example
   *  actions.clickAddContactDetails();
   */
  clickAddContactDetails(): void {
    log('navigate', 'Continuing to Contact details from Personal details');
    cy.get(L.addContactDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Selects a title from the dropdown.
   * @param title - Title option to choose (e.g., "Mr", "Ms").
   */
  private selectTitle(title: string): void {
    log('select', 'Selecting title', { title });
    cy.get(L.titleSelect, this.common.getTimeoutOptions())
      .should('be.visible')
      .scrollIntoView()
      .select(title, { force: true });
  }

  /**
   * Asserts the title dropdown displays the expected option.
   * @param expected - Expected selected text; empty string checks for no selection.
   */
  private assertTitleValue(expected: string): void {
    cy.get(L.titleSelect, this.common.getTimeoutOptions())
      .should('exist')
      .then(($select) => {
        const value = String($select.val() ?? '');
        const text = $select.find('option:selected').text().trim();

        if (expected === '') {
          expect(value, 'Title select value').to.eq('');
          expect(text.toLowerCase(), 'Title placeholder text').to.match(/select|^$/);
          return;
        }

        expect(text, 'Title selection').to.eq(expected);
      });
  }

  /**
   * Types into a personal details input, clearing existing text first.
   * @param field - Logical field key (excluding the title dropdown).
   * @param value - Value to type; empty string clears the field.
   */
  private typeIntoField(field: ManualPersonalDetailsFieldKey, value: string): void {
    if (field === 'title') {
      throw new Error('typeIntoField does not support dropdown fields. Use selectTitle instead.');
    }

    const selector = this.getSelector(field);
    log('type', `Setting personal details field ${field}`, { value });

    cy.get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .should('have.value', '')
      .then(($input) => {
        if (value === '') {
          return;
        }

        cy.wrap($input)
          .type(value, { force: true, delay: 0 })
          .should(($el) => {
            const actual = ($el.val() ?? '').toString().toLowerCase();
            expect(actual).to.equal(value.toLowerCase());
          });
      });
  }

  /**
   * Resolves a personal details field key to its selector.
   * @param field - Logical field name.
   * @returns CSS selector string for the field input.
   */
  private getSelector(field: ManualPersonalDetailsFieldKey): string {
    switch (field) {
      case 'firstNames':
        return L.firstNamesInput;
      case 'lastName':
        return L.lastNameInput;
      case 'dob':
        return L.dateOfBirthInput;
      case 'nationalInsuranceNumber':
        return L.nationalInsuranceInput;
      case 'addressLine1':
        return L.addressLine1Input;
      case 'addressLine2':
        return L.addressLine2Input;
      case 'addressLine3':
        return L.addressLine3Input;
      case 'postcode':
        return L.postcodeInput;
      case 'vehicleMake':
        return L.vehicleMakeInput;
      case 'vehicleRegistration':
        return L.vehicleRegistrationInput;
      default:
        throw new Error(`Unknown personal details field: ${field}`);
    }
  }
}
