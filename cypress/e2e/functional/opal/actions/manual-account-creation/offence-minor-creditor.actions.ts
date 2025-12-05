/**
 * @fileoverview Actions for the Manual Account Creation **Minor creditor** form.
 * Encapsulates field entry, radio/checkbox selection, and cancel/save handling.
 */
import { ManualOffenceDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/offence-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { MinorCreditorFieldKey, MinorCreditorType } from '../../../../../support/utils/macFieldResolvers';

export class ManualOffenceMinorCreditorActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Minor creditor page is displayed.
   * @param expectedHeader - Header text fragment to assert.
   */
  assertOnMinorCreditorPage(expectedHeader: string = 'Minor creditor details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', 'minor-creditor');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Selects a creditor type (Individual or Company).
   * @param type - Creditor type label.
   */
  selectCreditorType(type: MinorCreditorType): void {
    const selector = type === 'Individual' ? L.minorCreditorForm.individualRadio : L.minorCreditorForm.companyRadio;
    log('click', 'Selecting minor creditor type', { type });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Asserts the creditor type radio selection.
   * @param type - Creditor type label.
   */
  assertCreditorTypeSelected(type: MinorCreditorType): void {
    const selector = type === 'Individual' ? L.minorCreditorForm.individualRadio : L.minorCreditorForm.companyRadio;
    log('assert', 'Asserting minor creditor type selected', { type });
    cy.get(selector, this.common.getTimeoutOptions()).should('be.checked');
  }

  /**
   * Selects a title from the dropdown.
   * @param title - Title option (e.g., "Mr").
   */
  selectTitle(title: string): void {
    log('select', 'Selecting minor creditor title', { title });
    cy.get(L.minorCreditorForm.titleSelect, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .select(title, { force: true });
  }

  /**
   * Sets a field value on the minor creditor form.
   * @param field - Logical field key.
   * @param value - Value to type.
   */
  setField(field: MinorCreditorFieldKey, value: string): void {
    const selector = this.resolveFieldSelector(field);
    log('type', 'Setting minor creditor field', { field, value });
    this.typeAndAssert(selector, value, field);
  }

  /**
   * Clears a minor creditor field.
   * @param field - Logical field key.
   */
  clearField(field: MinorCreditorFieldKey): void {
    const selector = this.resolveFieldSelector(field);
    log('clear', 'Clearing minor creditor field', { field });
    cy.get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .should('have.value', '');
  }

  /**
   * Toggles the BACS checkbox.
   * @param checked - Desired checkbox state.
   */
  togglePayByBacs(checked: boolean): void {
    log('click', 'Toggling pay by BACS', { checked });
    const action = checked ? 'check' : 'uncheck';
    cy.get(L.minorCreditorForm.payByBacsCheckbox, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      [action]({ force: true });
  }

  /**
   * Asserts the BACS checkbox state.
   * @param expected - Expected checked state.
   */
  assertPayByBacsState(expected: boolean): void {
    log('assert', 'Asserting pay by BACS state', { expected });
    cy.get(L.minorCreditorForm.payByBacsCheckbox, this.common.getTimeoutOptions()).should(
      expected ? 'be.checked' : 'not.be.checked',
    );
  }

  /**
   * Asserts a field value on the minor creditor form.
   * @param field - Logical field key.
   * @param expected - Expected value (empty string allowed).
   */
  assertFieldValue(field: MinorCreditorFieldKey, expected: string): void {
    const selector = this.resolveFieldSelector(field);
    log('assert', 'Asserting minor creditor field value', { field, expected });
    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Clicks the Save button.
   */
  save(): void {
    log('click', 'Saving minor creditor');
    cy.get(L.minorCreditorForm.saveButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Cancels from the minor creditor form, handling the unsaved changes dialog.
   * @param choice - Confirmation choice ("Cancel"/"Ok"/"Stay"/"Leave").
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling minor creditor form', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);
    cy.get(L.minorCreditorForm.cancelLink, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  private resolveFieldSelector(field: MinorCreditorFieldKey): string {
    switch (field) {
      case 'title':
        return L.minorCreditorForm.titleSelect;
      case 'firstNames':
        return L.minorCreditorForm.firstNamesInput;
      case 'lastName':
        return L.minorCreditorForm.lastNameInput;
      case 'company':
        return L.minorCreditorForm.companyNameInput;
      case 'address1':
        return L.minorCreditorForm.address1Input;
      case 'address2':
        return L.minorCreditorForm.address2Input;
      case 'address3':
        return L.minorCreditorForm.address3Input;
      case 'postcode':
        return L.minorCreditorForm.postcodeInput;
      case 'accountName':
        return L.minorCreditorForm.accountNameInput;
      case 'sortCode':
        return L.minorCreditorForm.sortCodeInput;
      case 'accountNumber':
        return L.minorCreditorForm.accountNumberInput;
      case 'paymentReference':
        return L.minorCreditorForm.paymentReferenceInput;
      default:
        throw new Error(`Unknown minor creditor field: ${field}`);
    }
  }

  private typeAndAssert(selector: string, value: string, label: string): void {
    cy.get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .type(value, { force: true, delay: 0 })
      .should('have.value', value);
    log('type', `Set ${label}`, { value });
  }
}
