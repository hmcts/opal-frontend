/**
 * @file parent-guardian-details.actions.ts
 * @description
 * Actions for the Manual Account Creation **Parent or guardian details** task.
 *
 * @remarks
 * - All selectors are sourced from `ManualParentGuardianDetailsLocators`.
 * - Methods are single-purpose to keep step definitions thin.
 */
import { ManualParentGuardianDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/parent-guardian-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export type ManualParentGuardianFieldKey =
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

export type ManualParentGuardianAliasFieldKey = 'firstNames' | 'lastName';

export type ManualParentGuardianDetailsPayload = Partial<Record<ManualParentGuardianFieldKey, string>> & {
  addAliases?: boolean;
  aliases?: Array<Partial<Record<ManualParentGuardianAliasFieldKey, string>>>;
};

/**
 * Page-level actions for Parent/Guardian details.
 */
export class ManualParentGuardianDetailsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * @description Asserts the Parent/Guardian details page is loaded.
   * @param expectedHeader - Header text to assert.
   * @remarks Guards both URL path and visible header to avoid stale routes.
   * @example
   *  actions.assertOnParentGuardianDetailsPage('Parent or guardian details');
   */
  public assertOnParentGuardianDetailsPage(expectedHeader: string = 'Parent or guardian details'): void {
    log('assert', 'Asserting Parent/Guardian details page', { expectedHeader });
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/parent-guardian-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * @description Toggles the **Add aliases** checkbox and verifies state.
   * @param enable - Whether the checkbox should be selected.
   * @example
   *  actions.toggleAddAliases(true);
   */
  public toggleAddAliases(enable: boolean): void {
    log('select', 'Toggling Add aliases checkbox', { enable });
    const checkbox = cy.get(L.fields.addAliases, this.common.getTimeoutOptions()).should('exist').scrollIntoView();

    if (enable) {
      checkbox.check({ force: true }).should('be.checked');
      return;
    }

    checkbox.uncheck({ force: true }).should('not.be.checked');
  }

  /**
   * @description Adds another alias row.
   * @example
   *  actions.addAliasRow();
   */
  public addAliasRow(): void {
    log('action', 'Adding another alias row');
    cy.get(L.actions.addAnotherAliasButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * @description Sets a top-level Parent/Guardian field to a value.
   * @param field - Logical field key.
   * @param value - Value to type (empty string clears).
   * @example
   *  actions.setField('firstNames', 'FNAME');
   */
  public setField(field: ManualParentGuardianFieldKey, value: string): void {
    const selector = this.getFieldSelector(field);
    log('type', 'Setting parent/guardian field', { field, value });

    const chain = cy
      .get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true });

    if (value !== '') {
      chain.type(value, { delay: 0, force: true }).should('have.value', value);
      return;
    }

    chain.should('have.value', '');
  }

  /**
   * @description Sets an alias field value by index.
   * @param index - Zero-based alias index.
   * @param field - Alias field key.
   * @param value - Value to type (empty string clears).
   * @example
   *  actions.setAliasField(1, 'lastName', 'Alias LN');
   */
  public setAliasField(index: number, field: ManualParentGuardianAliasFieldKey, value: string): void {
    const selector = this.getAliasFieldSelector(index, field);
    log('type', 'Setting alias field', { index, field, value });

    const chain = cy
      .get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true });

    if (value !== '') {
      chain.type(value, { delay: 0, force: true }).should('have.value', value);
      return;
    }

    chain.should('have.value', '');
  }

  /**
   * @description Fills multiple parent/guardian fields + aliases in one pass.
   * @param payload - Field/value map with optional alias rows.
   * @remarks Skips undefined keys so callers can send partial updates.
   * @example
   *  actions.fillParentGuardianDetails({ firstNames: 'Test', addAliases: true });
   */
  public fillParentGuardianDetails(payload: ManualParentGuardianDetailsPayload): void {
    log('type', 'Filling Parent/Guardian details payload', { payload });

    if (payload.addAliases !== undefined) {
      this.toggleAddAliases(Boolean(payload.addAliases));
    }

    this.applyIfPresent(payload.firstNames, () => this.setField('firstNames', payload.firstNames as string));
    this.applyIfPresent(payload.lastName, () => this.setField('lastName', payload.lastName as string));
    this.applyIfPresent(payload.dob, () => this.setField('dob', payload.dob as string));
    this.applyIfPresent(payload.nationalInsuranceNumber, () =>
      this.setField('nationalInsuranceNumber', payload.nationalInsuranceNumber as string),
    );
    this.applyIfPresent(payload.addressLine1, () => this.setField('addressLine1', payload.addressLine1 as string));
    this.applyIfPresent(payload.addressLine2, () => this.setField('addressLine2', payload.addressLine2 as string));
    this.applyIfPresent(payload.addressLine3, () => this.setField('addressLine3', payload.addressLine3 as string));
    this.applyIfPresent(payload.postcode, () => this.setField('postcode', payload.postcode as string));
    this.applyIfPresent(payload.vehicleMake, () => this.setField('vehicleMake', payload.vehicleMake as string));
    this.applyIfPresent(payload.vehicleRegistration, () =>
      this.setField('vehicleRegistration', payload.vehicleRegistration as string),
    );

    if (payload.aliases?.length) {
      payload.aliases.forEach((alias, index) => {
        if (index > 0) {
          this.addAliasRow();
        }
        this.applyIfPresent(alias.firstNames, () => this.setAliasField(index, 'firstNames', alias.firstNames as string));
        this.applyIfPresent(alias.lastName, () => this.setAliasField(index, 'lastName', alias.lastName as string));
      });
    }
  }

  /**
   * @description Asserts a top-level field value.
   * @param field - Field key to check.
   * @param expected - Expected value (empty string allowed).
   * @example
   *  actions.assertFieldValue('postcode', 'TE1 1ST');
   */
  public assertFieldValue(field: ManualParentGuardianFieldKey, expected: string): void {
    const selector = this.getFieldSelector(field);
    log('assert', 'Asserting parent/guardian field value', { field, expected });

    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * @description Asserts an alias field value.
   * @param index - Zero-based alias index.
   * @param field - Alias field key.
   * @param expected - Expected value.
   * @example
   *  actions.assertAliasFieldValue(0, 'firstNames', 'ALIAS');
   */
  public assertAliasFieldValue(index: number, field: ManualParentGuardianAliasFieldKey, expected: string): void {
    const selector = this.getAliasFieldSelector(index, field);
    log('assert', 'Asserting alias field value', { index, field, expected });

    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * @description Asserts Add aliases checkbox state.
   * @param expectedChecked - Whether checkbox should be checked.
   * @example
   *  actions.assertAddAliasesChecked(true);
   */
  public assertAddAliasesChecked(expectedChecked: boolean): void {
    log('assert', 'Asserting Add aliases checkbox state', { expectedChecked });
    const chain = cy.get(L.fields.addAliases, this.common.getTimeoutOptions()).should('exist').scrollIntoView();
    if (expectedChecked) {
      chain.should('be.checked');
      return;
    }
    chain.should('not.be.checked');
  }

  /**
   * @description Clicks **Return to account details**.
   * @example
   *  actions.returnToAccountDetails();
   */
  public returnToAccountDetails(): void {
    log('navigate', 'Returning to Account details from Parent/Guardian task');
    cy.get(L.actions.returnToAccountDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * @description Clicks **Add contact details** nested CTA.
   * @example
   *  actions.addContactDetails();
   */
  public addContactDetails(): void {
    log('navigate', 'Continuing to Contact details from Parent/Guardian task');
    cy.get(L.actions.addContactDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * @description Clicks Cancel and chooses how to respond to the confirm dialog.
   * @param choice - "Ok" to leave, "Cancel" to stay.
   * @example
   *  actions.cancelAndChoose('Ok');
   */
  public cancelAndChoose(choice: 'Ok' | 'Cancel'): void {
    const accept = choice.toLowerCase() === 'ok';
    log('cancel', 'Cancelling Parent/Guardian details', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);
    cy.get(L.actions.cancelLink, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click();
  }

  /**
   * @description Asserts the inline error message for a field.
   * @param field - Field key to check.
   * @param expected - Expected error text.
   * @example
   *  actions.assertInlineError('firstNames', 'Enter parent or guardian\\'s first name(s)');
   */
  public assertInlineError(field: ManualParentGuardianFieldKey, expected: string): void {
    const selector = this.getFieldSelector(field);
    log('assert', 'Asserting inline error message', { field, expected });

    cy.get(selector, this.common.getTimeoutOptions())
      .closest('.govuk-form-group, opal-lib-govuk-text-input')
      .find(L.errors.inline)
      .should('be.visible')
      .and('contain.text', expected);
  }

  /**
   * @description Executes a callback only when a value is provided.
   * @param value - Potentially undefined value to check.
   * @param fn - Callback to invoke when value is not undefined.
   */
  private applyIfPresent<T>(value: T | undefined, fn: () => void): void {
    if (value !== undefined) {
      fn();
    }
  }

  /**
   * @description Resolves a logical parent/guardian field key to its selector.
   * @param field - Logical field key.
   * @returns CSS selector string for the input.
   */
  private getFieldSelector(field: ManualParentGuardianFieldKey): string {
    switch (field) {
      case 'firstNames':
        return L.fields.firstNames;
      case 'lastName':
        return L.fields.lastName;
      case 'dob':
        return L.fields.dob;
      case 'nationalInsuranceNumber':
        return L.fields.nationalInsuranceNumber;
      case 'addressLine1':
        return L.fields.addressLine1;
      case 'addressLine2':
        return L.fields.addressLine2;
      case 'addressLine3':
        return L.fields.addressLine3;
      case 'postcode':
        return L.fields.postcode;
      case 'vehicleMake':
        return L.fields.vehicleMake;
      case 'vehicleRegistration':
        return L.fields.vehicleRegistration;
      default:
        throw new Error(`Unknown parent/guardian field: ${field}`);
    }
  }

  /**
   * @description Resolves an alias row/field combination to its selector.
   * @param index - Zero-based alias index.
   * @param field - Alias field key.
   * @returns CSS selector string for the alias input.
   */
  private getAliasFieldSelector(index: number, field: ManualParentGuardianAliasFieldKey): string {
    if (index < 0) {
      throw new Error('Alias index must be zero or greater');
    }

    if (field === 'firstNames') {
      return L.fields.aliases.firstNames(index);
    }

    return L.fields.aliases.lastName(index);
  }
}
