/**
 * @fileoverview Actions for Manual Account Creation - Offence details task.
 * Handles offence entry, impositions, minor creditor interactions, and navigation.
 */
import { ManualOffenceDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/offence-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

type OffenceField = 'Offence code' | 'Date of sentence';
type ImpositionField = 'Result code' | 'Amount imposed' | 'Amount paid';

export class ManualOffenceDetailsActions {
  private readonly common = new CommonActions();
  private readonly resultCodeInputSelector = 'input[id^="fm_offence_details_result_id_"][id$="-autocomplete"]';

  /**
   * Asserts the Add an offence page is displayed.
   * @param expectedHeader - Expected header text fragment.
   */
  assertOnAddOffencePage(expectedHeader: string = 'Add an offence'): void {
    cy.location('pathname', { timeout: 20_000 }).should('include', '/offence-details');
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  /**
   * Completes the offence form with a single imposition row.
   */
  fillOffenceDetails(payload: {
    dateOfSentence: string;
    offenceCode: string;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
  }): void {
    log('type', 'Completing offence details', payload);
    this.setOffenceField('Date of sentence', payload.dateOfSentence);
    this.setOffenceField('Offence code', payload.offenceCode);
    this.setImpositionField(0, 'Result code', payload.resultCode);
    this.setImpositionField(0, 'Amount imposed', payload.amountImposed);
    this.setImpositionField(0, 'Amount paid', payload.amountPaid);
  }

  /**
   * Types into a top-level offence field.
   * @param field - Offence field label.
   * @param value - Value to type.
   */
  setOffenceField(field: OffenceField, value: string): void {
    const selector =
      field === 'Offence code' ? L.offenceCodeInput : field === 'Date of sentence' ? L.dateOfSentenceInput : null;

    if (!selector) {
      throw new Error(`Unknown offence field: ${field}`);
    }

    log('type', `Setting offence field ${field}`, { value });
    this.typeAndAssert(selector, value, field);
  }

  /**
   * Asserts a top-level offence field value.
   * @param field - Offence field label.
   * @param expected - Expected value.
   */
  assertOffenceFieldValue(field: OffenceField, expected: string): void {
    const selector =
      field === 'Offence code' ? L.offenceCodeInput : field === 'Date of sentence' ? L.dateOfSentenceInput : null;

    if (!selector) {
      throw new Error(`Unknown offence field: ${field}`);
    }

    log('assert', `Asserting offence field ${field}`, { expected });
    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Types into an imposition field for a given row.
   * @param index - Zero-based imposition index.
   * @param field - Imposition field label.
   * @param value - Value to type (supports {downArrow}{enter} for autosuggest).
   */
  setImpositionField(index: number, field: ImpositionField, value: string): void {
    const selector = (() => {
      switch (field) {
        case 'Result code':
          return L.imposition.resultCodeInput(index);
        case 'Amount imposed':
          return L.imposition.amountImposedInput(index);
        case 'Amount paid':
          return L.imposition.amountPaidInput(index);
        default:
          return null;
      }
    })();

    if (!selector) {
      throw new Error(`Unknown imposition field: ${field}`);
    }

    log('type', `Setting imposition field ${field}`, { index, value });
    this.typeAndAssert(selector, value, `${field} (imposition ${index + 1})`);

    if (field === 'Result code') {
      cy.get(L.imposition.resultCodeList(index), this.common.getTimeoutOptions()).should('be.visible');
      cy.get(L.imposition.resultCodeInput(index)).type('{downarrow}{enter}', { force: true });
    }
  }

  /**
   * Clears an imposition field for a given row.
   * @param index - Zero-based imposition index.
   * @param field - Imposition field label.
   */
  clearImpositionField(index: number, field: ImpositionField): void {
    const selector = (() => {
      switch (field) {
        case 'Result code':
          return L.imposition.resultCodeInput(index);
        case 'Amount imposed':
          return L.imposition.amountImposedInput(index);
        case 'Amount paid':
          return L.imposition.amountPaidInput(index);
        default:
          return null;
      }
    })();

    if (!selector) {
      throw new Error(`Unknown imposition field: ${field}`);
    }

    log('clear', `Clearing imposition field ${field}`, { index });
    cy.get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .should('have.value', '');
  }

  /**
   * Asserts an imposition field value.
   * @param index - Zero-based imposition index.
   * @param field - Imposition field label.
   * @param expected - Expected value.
   */
  assertImpositionFieldValue(index: number, field: ImpositionField, expected: string): void {
    const selector = (() => {
      switch (field) {
        case 'Result code':
          return L.imposition.resultCodeInput(index);
        case 'Amount imposed':
          return L.imposition.amountImposedInput(index);
        case 'Amount paid':
          return L.imposition.amountPaidInput(index);
        default:
          return null;
      }
    })();

    if (!selector) {
      throw new Error(`Unknown imposition field: ${field}`);
    }

    log('assert', `Asserting imposition field ${field}`, { index, expected });
    cy.get(selector, this.common.getTimeoutOptions())
      .invoke('val')
      .should((val) => expect(String(val ?? '')).to.contain(expected));
  }

  /**
   * Selects the creditor type for an imposition.
   * @param index - Zero-based imposition index.
   * @param type - Creditor type ("major" | "minor").
   */
  selectCreditorType(index: number, type: 'major' | 'minor'): void {
    log('click', 'Selecting creditor type', { index, type });
    cy.get(L.imposition.creditorRadio(type, index), this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .check({ force: true });
  }

  /**
   * Types a major creditor search value and selects the suggestion.
   * @param index - Zero-based imposition index.
   * @param value - Search term to type.
   */
  setMajorCreditor(index: number, value: string): void {
    log('type', 'Setting major creditor', { index, value });
    this.typeAndAssert(L.imposition.majorCreditorInput(index), value, `Major creditor (imposition ${index + 1})`);
    cy.get(L.imposition.majorCreditorList(index), this.common.getTimeoutOptions()).should('be.visible');
    cy.get(L.imposition.majorCreditorInput(index)).focus().type('{downarrow}{enter}', { force: true });
  }

  /**
   * Asserts the major creditor field value for an imposition.
   * @param index - Zero-based imposition index.
   * @param expected - Expected value.
   */
  assertMajorCreditorValue(index: number, expected: string): void {
    log('assert', 'Asserting major creditor value', { index, expected });
    cy.get(L.imposition.majorCreditorInput(index), this.common.getTimeoutOptions())
      .invoke('val')
      .should((val) => expect(String(val ?? '')).to.contain(expected));
  }

  /**
   * Opens the Add minor creditor details link for an imposition.
   * @param index - Zero-based imposition index.
   */
  openMinorCreditorDetails(index: number): void {
    log('navigate', 'Opening minor creditor details', { index });
    const panel = this.getImpositionPanel(index);

    // Ensure the minor creditor radio is selected so the link is rendered
    panel.find('input[id^="minor_"]', this.common.getTimeoutOptions()).first().scrollIntoView().check({ force: true });

    this.getImpositionPanel(index)
      .contains('a', 'Add minor creditor details', this.common.getTimeoutOptions())
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Clicks Add another imposition.
   */
  clickAddAnotherImposition(): void {
    log('click', 'Adding another imposition');
    cy.get(L.addImpositionButton, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click();
  }

  /**
   * Returns the current number of imposition panels on the page.
   */
  getImpositionCount(): Cypress.Chainable<number> {
    return cy.get(this.resultCodeInputSelector, this.common.getTimeoutOptions()).its('length');
  }

  /**
   * Clicks the Review offence submit button.
   */
  clickReviewOffence(): void {
    log('navigate', 'Submitting offence for review');
    cy.get(L.reviewOffenceButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Clicks Return to account details from the offence form.
   */
  clickReturnToAccountDetails(): void {
    log('navigate', 'Returning to account details from offence details');
    cy.get(L.returnToAccountDetailsButton, this.common.getTimeoutOptions())
      .first()
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Cancels editing offence details and responds to the unsaved changes dialog.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelOffenceDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling offence details', { choice, accept });
    this.common.confirmNextUnsavedChanges(accept);
    cy.get(L.cancelLink, this.common.getTimeoutOptions())
      .first()
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Asserts whether the Remove imposition link is present for a row.
   * @param index - Zero-based imposition index.
   * @param expectedVisible - Whether the link should be visible.
   */
  assertRemoveImpositionLink(index: number, expectedVisible: boolean = true): void {
    log('assert', 'Checking remove imposition link visibility', { index, expectedVisible });
    const chain = this.getImpositionPanel(index)
      .find(L.imposition.removeImpositionLink, this.common.getTimeoutOptions())
      .filter((_, el) => Cypress.$(el).text().trim().includes('Remove imposition'));

    expectedVisible ? chain.should('exist') : chain.should('not.exist');
  }

  /**
   * Opens the Remove imposition confirmation page for the specified row.
   * @param index - Zero-based imposition index.
   */
  clickRemoveImposition(index: number): void {
    log('navigate', 'Initiating remove imposition', { index });
    this.getImpositionPanel(index)
      .contains(L.imposition.removeImpositionLink, 'Remove imposition', this.common.getTimeoutOptions())
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Toggles minor creditor details visibility for an imposition card.
   * @param index - Zero-based imposition index.
   * @param action - "Show details" or "Hide details".
   */
  toggleMinorCreditorDetails(index: number, action: 'Show details' | 'Hide details'): void {
    log('click', 'Toggling minor creditor visibility', { index, action });
    const panel = this.getImpositionPanel(index);
    const linkSelector = 'a:contains("Show details"), a:contains("Hide details")';

    panel.find(linkSelector, this.common.getTimeoutOptions()).then(($links) => {
      const target =
        action === 'Show details'
          ? $links.filter((_, el) => Cypress.$(el).text().includes('Show details'))
          : $links.filter((_, el) => Cypress.$(el).text().includes('Hide details'));

      // If already in the desired state (e.g., hide link visible but we want show), no need to click.
      if (!target.length) {
        return;
      }

      cy.wrap(target.first()).scrollIntoView().click({ force: true });
    });
  }

  /**
   * Clicks a minor creditor summary action (Change/Remove).
   * @param index - Zero-based imposition index.
   * @param action - Action link text.
   */
  clickMinorCreditorAction(index: number, action: 'Change' | 'Remove'): void {
    log('navigate', 'Clicking minor creditor action', { index, action });
    this.getImpositionPanel(index)
      .find(L.imposition.minorCreditorSummary)
      .should('exist')
      .contains('a', action, this.common.getTimeoutOptions())
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Asserts minor creditor summary details within an imposition.
   * @param index - Zero-based imposition index.
   * @param expectations - Map of labels to expected values.
   */
  assertMinorCreditorDetails(
    index: number,
    expectations: Partial<{
      'Minor creditor': string;
      Address: string;
      'Payment method': string;
      'Account name': string;
      'Sort code': string;
      'Account number': string;
      'Payment reference': string;
    }>,
  ): void {
    log('assert', 'Validating minor creditor summary', { index, expectations });
    const panel = this.getImpositionPanel(index);
    const summaryRoot = panel.find(L.imposition.minorCreditorSummary, this.common.getTimeoutOptions()).should('be.visible');

    summaryRoot.within(() => {
      Object.entries(expectations).forEach(([label, value]) => {
        if (!value) return;

        if (label === 'Minor creditor') {
          cy.get('h5.govuk-summary-card__title', this.common.getTimeoutOptions()).should('contain.text', value);
          return;
        }

        const normalize = (input: string) =>
          label === 'Address' ? input.replace(/\s+/g, '') : input.replace(/\s+/g, ' ').trim();
        const expectedValue = label === 'Address' ? value.replace(/\s+/g, '') : value;

        cy.contains('dt', label, this.common.getTimeoutOptions())
          .should('exist')
          .next()
          .invoke('text')
          .then((text) => {
            expect(normalize(text)).to.contain(expectedValue);
          });
      });
    });
  }

  /**
   * Asserts minor creditor details when displayed outside an imposition context (e.g., removal page).
   * @param expectations - Map of labels to expected values.
   */
  assertStandaloneMinorCreditorDetails(
    expectations: Partial<{
      'Minor creditor': string;
      Address: string;
      'Payment method': string;
      'Account name': string;
      'Sort code': string;
      'Account number': string;
      'Payment reference': string;
    }>,
  ): void {
    log('assert', 'Validating standalone minor creditor details', { expectations });
    const summary = cy.get(L.imposition.minorCreditorSummary, this.common.getTimeoutOptions()).first();

    Object.entries(expectations).forEach(([label, value]) => {
      if (!value) return;

      if (label === 'Minor creditor') {
        summary.find('h5.govuk-summary-card__title').should('contain.text', value);
        return;
      }

      const normalize = (input: string) =>
        label === 'Address' ? input.replace(/\s+/g, '') : input.replace(/\s+/g, ' ').trim();
      const expectedValue = label === 'Address' ? value.replace(/\s+/g, '') : value;

      summary
        .contains('dt', label, this.common.getTimeoutOptions())
        .next()
        .invoke('text')
        .then((text) => expect(normalize(text)).to.contain(expectedValue));
    });
  }

  /**
   * Asserts that no minor creditor summary is rendered for the imposition.
   * @param index - Zero-based imposition index.
   */
  assertMinorCreditorAbsent(index: number): void {
    log('assert', 'Ensuring minor creditor summary is absent', { index });
    this.getImpositionPanel(index).find(L.imposition.minorCreditorSummary).should('not.exist');
  }

  /**
   * Opens the offence search link in the same tab.
   */
  openOffenceSearchLink(): void {
    log('navigate', 'Opening offence search link in same tab');
    cy.get(L.searchOffenceLink, this.common.getTimeoutOptions())
      .should('exist')
      .invoke('removeAttr', 'target')
      .click({ force: true });
  }

  /**
   * Asserts data shown on the Remove imposition confirmation table.
   * @param expectations - Column/value pairs to validate.
   */
  assertRemoveImpositionTable(expectations: Record<string, string>): void {
    log('assert', 'Validating remove imposition confirmation table', { expectations });
    cy.get(L.removeImposition.table, this.common.getTimeoutOptions()).within(() => {
      Object.entries(expectations).forEach(([column, value]) => {
        const cellId = this.resolveRemovalColumnId(column);
        cy.get(`#${cellId}`)
          .invoke('text')
          .then((text) => expect(text.replace(/\s+/g, ' ').trim()).to.equal(value));
      });
    });
  }

  /**
   * Confirms removal on the remove imposition page.
   */
  confirmRemoveImposition(): void {
    log('click', 'Confirming imposition removal');
    cy.get(L.removeImposition.confirmButton, this.common.getTimeoutOptions())
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Cancels removal on the remove imposition page.
   */
  cancelRemoveImposition(): void {
    log('click', 'Cancelling imposition removal');
    cy.get(L.removeImposition.cancelLink, this.common.getTimeoutOptions()).should('exist').click({ force: true });
  }

  /**
   * Confirms removal on the remove minor creditor page.
   */
  confirmRemoveMinorCreditor(): void {
    log('click', 'Confirming minor creditor removal');
    cy.get(L.removeMinorCreditor.confirmButton, this.common.getTimeoutOptions())
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Cancels removal on the remove minor creditor page.
   */
  cancelRemoveMinorCreditor(): void {
    log('click', 'Cancelling minor creditor removal');
    cy.get(L.removeMinorCreditor.cancelLink, this.common.getTimeoutOptions()).should('exist').click({ force: true });
  }

  private getImpositionPanel(index: number) {
    return cy.get(L.imposition.resultCodeInput(index), this.common.getTimeoutOptions()).closest(L.imposition.container);
  }

  /**
   * Types a value and asserts the resulting input value contains the expected text.
   * @remarks Normalises keystrokes (e.g., `{downarrow}{enter}`) so we can still assert the human-readable value.
   */
  private typeAndAssert(selector: string, value: string, label: string): void {
    const { textToType, expectedValue } = this.normaliseInput(value);

    cy.get(selector, this.common.getTimeoutOptions())
      .first()
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .type(textToType, { force: true, delay: 0 })
      .then(($input) => {
        const actual = String($input.val()).trim();
        if (!expectedValue) {
          log('debug', `Typed ${label} without assertion`, { value: textToType });
          return;
        }

        expect(actual.replace(/\s+/g, ' ')).to.contain(expectedValue);
      });

    log('type', `Set ${label}`, { value });
  }

  /**
   * Splits a provided input into the raw keystrokes to type and the expected visible value.
   * @remarks Allows flexible inputs with Cypress key syntax while retaining assertions on visible text.
   * @returns Object containing textToType (raw input) and expectedValue (trimmed human-readable text).
   */
  private normaliseInput(value: string): { textToType: string; expectedValue?: string } {
    const hasSpecialKeys = /{\w+}/i.test(value);
    const expectedValue = hasSpecialKeys ? value.replace(/({[^}]+})/g, '').trim() : value;
    return { textToType: value, expectedValue: expectedValue || undefined };
  }

  /**
   * Resolves a remove-imposition confirmation column label to its DOM id.
   * @param column - Column header text (e.g., "Amount imposed").
   * @returns The DOM id for the corresponding cell in the confirmation table.
   */
  private resolveRemovalColumnId(column: string): string {
    const normalized = column.toLowerCase();
    if (normalized.includes('imposition')) return 'imposition';
    if (normalized.includes('creditor')) return 'creditor';
    if (normalized.includes('amount imposed')) return 'amountImposed';
    if (normalized.includes('amount paid')) return 'amountPaid';
    if (normalized.includes('balance')) return 'balanceRemaining';
    throw new Error(`Unknown removal confirmation column: ${column}`);
  }
}
