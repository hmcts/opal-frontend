import { ManualCompanyDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/company-details.locators';
import { CommonActions } from '../common/common.actions';
import { log } from '../../../../../support/utils/log.helper';

/**
 * Actions for the Manual Account Creation Company details page.
 *
 * Each method performs a single UI interaction so step definitions
 * remain thin and intent-driven.
 */
export class ManualCompanyDetailsActions {
  private readonly common = new CommonActions();

  /**
   * Asserts we are on the Company details page.
   */
  assertOnCompanyDetailsPage(expectedHeader: string = 'Company details'): void {
    cy.location('pathname', { timeout: 20_000 }).should('include', '/company-details');
    this.common.assertHeaderContains(expectedHeader);
  }

  /**
   * Sets the company name.
   */
  setCompanyName(name: string): void {
    this.typeText(L.companyNameInput, name, 'Company name');
  }

  /**
   * Clears the company name input.
   */
  clearCompanyName(): void {
    log('clear', 'Clearing company name');
    cy.get(L.companyNameInput, this.common.getTimeoutOptions()).should('exist').clear({ force: true });
  }

  /**
   * Sets address lines and postcode individually.
   */
  setAddressLine1(value: string): void {
    this.typeText(L.addressLine1Input, value, 'Address line 1');
  }

  setAddressLine2(value: string): void {
    this.typeText(L.addressLine2Input, value, 'Address line 2');
  }

  setAddressLine3(value: string): void {
    this.typeText(L.addressLine3Input, value, 'Address line 3');
  }

  setPostcode(value: string): void {
    this.typeText(L.postcodeInput, value, 'Postcode');
  }

  /**
   * Toggles the "Add company aliases" checkbox.
   */
  toggleAddAliases(checked: boolean): void {
    log('check', `Toggling add aliases → ${checked ? 'checked' : 'unchecked'}`);
    const checkbox = cy.get(L.addAliasesCheckbox, this.common.getTimeoutOptions()).should('exist');
    if (checked) {
      checkbox.scrollIntoView().check({ force: true });
    } else {
      checkbox.scrollIntoView().uncheck({ force: true });
    }
  }

  /**
   * Asserts the add aliases checkbox state.
   */
  assertAddAliasesChecked(expected: boolean): void {
    cy.get(L.addAliasesCheckbox, this.common.getTimeoutOptions()).should(expected ? 'be.checked' : 'not.be.checked');
  }

  /**
   * Clicks the "Add another alias" button.
   */
  addAnotherAlias(): void {
    log('click', 'Adding another alias row');
    cy.get(L.addAliasButton, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click({ force: true });
  }

  /**
   * Sets a company alias name (1-based alias index).
   */
  setAliasCompanyName(aliasNumber: number, value: string): void {
    const index = aliasNumber - 1;
    log('type', 'Setting alias company name', { aliasNumber, value });
    cy.get(L.aliasInput(index), this.common.getTimeoutOptions())
      .should('exist')
      .clear({ force: true })
      .type(value, { delay: 0 });
  }

  /**
   * Asserts an alias input value (1-based alias index).
   */
  assertAliasCompanyName(aliasNumber: number, expected: string): void {
    const index = aliasNumber - 1;
    cy.get(L.aliasInput(index), this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Asserts an address or company field value.
   */
  assertFieldValue(field: 'company' | 'address1' | 'address2' | 'address3' | 'postcode', expected: string): void {
    const selector =
      field === 'company'
        ? L.companyNameInput
        : field === 'address1'
          ? L.addressLine1Input
          : field === 'address2'
            ? L.addressLine2Input
            : field === 'address3'
              ? L.addressLine3Input
              : L.postcodeInput;

    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Asserts an inline error message for a given input.
   */
  assertInlineError(field: 'company' | 'address1' | 'address2' | 'address3' | 'postcode', expected: string): void {
    const selector =
      field === 'company'
        ? L.companyNameInput
        : field === 'address1'
          ? L.addressLine1Input
          : field === 'address2'
            ? L.addressLine2Input
            : field === 'address3'
              ? L.addressLine3Input
              : L.postcodeInput;

    cy.get(selector, this.common.getTimeoutOptions())
      .closest('.govuk-form-group, opal-lib-govuk-text-input')
      .find(L.inlineError)
      .should('be.visible')
      .and('contain.text', expected);
  }

  /**
   * Clicks the Add contact details button.
   */
  clickAddContactDetails(): void {
    log('click', 'Navigating via Add contact details');
    cy.get(L.addContactDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Clears and types into a Company details field.
   *
   * @param selector - CSS selector for the input.
   * @param value - Text to enter.
   * @param label - Human-friendly label for logging.
   */
  private typeText(selector: string, value: string, label: string): void {
    log('type', `Setting ${label}`, { value });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').clear({ force: true }).type(value, { delay: 0 });
  }
}
