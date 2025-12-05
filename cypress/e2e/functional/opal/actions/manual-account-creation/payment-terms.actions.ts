/**
 * @fileoverview Actions for Manual Account Creation - Payment terms task.
 * Provides helpers to set collection order, payment schedules, enforcement actions, and navigation.
 */
import {
  ManualPaymentTermsLocators as L,
} from '../../../../../shared/selectors/manual-account-creation/payment-terms.locators';
import { calculateWeeksInFuture, calculateWeeksInPast } from '../../../../../support/utils/dateUtils';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export type PaymentTermOption = 'Pay in full' | 'Instalments only' | 'Lump sum plus instalments';
export type PaymentFrequencyOption = 'Weekly' | 'Fortnightly' | 'Monthly';
export type EnforcementActionOption = 'Hold enforcement on account (NOENF)' | 'Prison (PRIS)';

export interface ManualPaymentTermsInput {
  collectionOrder?: 'Yes' | 'No';
  collectionOrderDate?: string;
  collectionOrderToday?: boolean;
  paymentTerm?: PaymentTermOption;
  payByDate?: string;
  lumpSumAmount?: string;
  instalmentAmount?: string;
  frequency?: PaymentFrequencyOption;
  startDate?: string;
  requestPaymentCard?: boolean;
  hasDaysInDefault?: boolean;
  daysInDefaultDate?: string;
  defaultDays?: string;
  addEnforcementAction?: boolean;
  enforcementOption?: EnforcementActionOption;
  enforcementReason?: string;
}

export type ManualPaymentTermsExpectations = Omit<
  ManualPaymentTermsInput,
  'collectionOrder' | 'paymentTerm' | 'frequency' | 'enforcementOption'
> & {
  collectionOrder?: 'Yes' | 'No' | 'Not selected';
  paymentTerm?: PaymentTermOption | 'Not selected';
  frequency?: PaymentFrequencyOption | 'Not selected';
  enforcementOption?: EnforcementActionOption | 'Not selected';
};

export class ManualPaymentTermsActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Payment terms page is visible before interacting.
   * @param expectedHeader - Header text fragment to assert.
   */
  assertOnPaymentTermsPage(expectedHeader: string = 'Payment terms'): void {
    log('assert', 'Asserting Payment terms page', { expectedHeader });
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/payment-terms');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Fills the Payment terms form with the provided values.
   * @param payload - Payment terms values to set.
   */
  fillPaymentTerms(payload: ManualPaymentTermsInput): void {
    log('type', 'Filling payment terms', { payload });
    this.assertOnPaymentTermsPage();

    if (payload.collectionOrder) {
      this.setCollectionOrder(payload.collectionOrder, payload.collectionOrderDate);
    }

    if (payload.collectionOrderToday !== undefined) {
      this.toggleCheckbox(L.collectionOrder.today, payload.collectionOrderToday, 'Make collection order today');
    }

    if (payload.paymentTerm) {
      this.setPaymentTerm(payload.paymentTerm);
    }

    if (payload.payByDate !== undefined) {
      this.setDateField(L.payByDate, payload.payByDate, 'Pay by date');
    }

    if (payload.lumpSumAmount !== undefined) {
      this.setInputValue(L.lumpSumAmount, payload.lumpSumAmount, 'Lump sum amount');
    }

    if (payload.instalmentAmount !== undefined) {
      this.setInputValue(L.instalmentAmount, payload.instalmentAmount, 'Instalment amount');
    }

    if (payload.frequency) {
      this.setFrequency(payload.frequency);
    }

    if (payload.startDate !== undefined) {
      this.setDateField(L.startDate, payload.startDate, 'Start date');
    }

    if (payload.requestPaymentCard !== undefined) {
      this.toggleCheckbox(L.requestPaymentCard, payload.requestPaymentCard, 'Request payment card');
    }

    if (payload.hasDaysInDefault !== undefined) {
      this.toggleCheckbox(L.daysInDefault.checkbox, payload.hasDaysInDefault, 'Days in default');
    }

    if (payload.daysInDefaultDate !== undefined) {
      this.setDateField(L.daysInDefault.date, payload.daysInDefaultDate, 'Date days in default were imposed');
    }

    if (payload.defaultDays !== undefined) {
      this.setInputValue(L.daysInDefault.days, payload.defaultDays, 'Default days');
    }

    if (payload.addEnforcementAction !== undefined) {
      this.toggleCheckbox(L.enforcement.add, payload.addEnforcementAction, 'Add enforcement action');
    }

    if (payload.enforcementOption) {
      this.setEnforcementOption(payload.enforcementOption);
    }

    if (payload.enforcementReason !== undefined) {
      this.setInputValue(L.enforcement.noenfReason, payload.enforcementReason, 'Reason account is on NOENF');
    }
  }

  /**
   * Asserts current Payment terms values match expectations.
   * @param expected - Values and selection state to verify.
   */
  assertPaymentTermsValues(expected: ManualPaymentTermsExpectations): void {
    log('assert', 'Asserting payment terms values', { expected });
    this.assertOnPaymentTermsPage();

    if (expected.collectionOrder) {
      this.assertCollectionOrder(expected.collectionOrder);
    }

    if (expected.collectionOrderToday !== undefined) {
      this.assertCheckboxValue(L.collectionOrder.today, expected.collectionOrderToday, 'Make collection order today');
    }

    if (expected.collectionOrderDate !== undefined && expected.collectionOrder === 'Yes') {
      this.assertInputValue(L.collectionOrder.date, expected.collectionOrderDate, 'Collection order date');
    }

    if (expected.paymentTerm) {
      this.assertPaymentTerm(expected.paymentTerm);
    }

    if (expected.payByDate !== undefined) {
      this.assertInputValue(L.payByDate, expected.payByDate, 'Pay by date');
    }

    if (expected.lumpSumAmount !== undefined) {
      this.assertInputValue(L.lumpSumAmount, expected.lumpSumAmount, 'Lump sum amount');
    }

    if (expected.instalmentAmount !== undefined) {
      this.assertInputValue(L.instalmentAmount, expected.instalmentAmount, 'Instalment amount');
    }

    if (expected.frequency) {
      this.assertFrequency(expected.frequency);
    }

    if (expected.startDate !== undefined) {
      this.assertInputValue(L.startDate, expected.startDate, 'Start date');
    }

    if (expected.requestPaymentCard !== undefined) {
      this.assertCheckboxValue(L.requestPaymentCard, expected.requestPaymentCard, 'Request payment card');
    }

    if (expected.hasDaysInDefault !== undefined) {
      this.assertCheckboxValue(L.daysInDefault.checkbox, expected.hasDaysInDefault, 'Days in default');
    }

    if (expected.daysInDefaultDate !== undefined) {
      this.assertInputValue(L.daysInDefault.date, expected.daysInDefaultDate, 'Date days in default were imposed');
    }

    if (expected.defaultDays !== undefined) {
      this.assertInputValue(L.daysInDefault.days, expected.defaultDays, 'Default days');
    }

    if (expected.addEnforcementAction !== undefined) {
      this.assertCheckboxValue(L.enforcement.add, expected.addEnforcementAction, 'Add enforcement action');
    }

    if (expected.enforcementOption) {
      this.assertEnforcementOption(expected.enforcementOption);
    }

    if (expected.enforcementReason !== undefined) {
      this.assertInputValue(L.enforcement.noenfReason, expected.enforcementReason, 'Reason account is on NOENF');
    }
  }

  /**
   * Sets collection order, pay in full, and pay by date fields.
   */
  completePayInFullWithCollectionOrder(options: {
    collectionOrder: 'Yes' | 'No';
    collectionOrderWeeksInPast: number;
    payByWeeksInFuture: number;
  }): void {
    log('type', 'Completing payment terms (pay in full)', options);

    this.fillPaymentTerms({
      collectionOrder: options.collectionOrder,
      collectionOrderDate: calculateWeeksInPast(options.collectionOrderWeeksInPast),
      paymentTerm: 'Pay in full',
      payByDate: calculateWeeksInFuture(options.payByWeeksInFuture),
    });
  }

  /**
   * Handles Cancel with a specific choice on Payment terms.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelAndChoose(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Cancelling Payment terms edit', { choice, accept });
    this.assertOnPaymentTermsPage();
    this.common.confirmNextUnsavedChanges(accept);

    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('exist').scrollIntoView().click({ force: true });
  }

  /**
   * Opens the Account comments and notes task from Payment terms.
   */
  clickAddAccountCommentsAndNotes(): void {
    log('navigate', 'Navigating to Account comments and notes from Payment terms');
    cy.get(L.addAccountCommentsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Selects whether a collection order exists and, when applicable, enters a date.
   * @param choice - Collection order choice.
   * @param date - Optional date string to use when collection order is "Yes".
   */
  private setCollectionOrder(choice: 'Yes' | 'No', date?: string): void {
    const selector = choice === 'Yes' ? L.collectionOrder.yes : L.collectionOrder.no;
    log('select', 'Setting collection order', { choice, date });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });

    if (choice === 'Yes' && date !== undefined) {
      this.setDateField(L.collectionOrder.date, date, 'Collection order date');
    }
  }

  /**
   * Selects a payment term option.
   * @param option - Payment term to choose.
   */
  private setPaymentTerm(option: PaymentTermOption): void {
    const selector = this.resolvePaymentTermSelector(option);
    log('select', 'Setting payment term', { option });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Sets the payment frequency radio.
   * @param option - Frequency choice.
   */
  private setFrequency(option: PaymentFrequencyOption): void {
    const selector = this.resolveFrequencySelector(option);
    log('select', 'Setting payment frequency', { option });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }

  /**
   * Types into a date input and asserts the final value.
   * @param selector - Input selector.
   * @param value - Date string to type (dd/MM/yyyy).
   * @param label - Label for logging.
   */
  private setDateField(selector: string, value: string, label: string): void {
    const input = cy.get(selector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });

    if (value === '') {
      log('clear', `Clearing ${label}`);
      input.should('have.value', '');
      return;
    }

    input.type(value, { delay: 0, force: true }).should('have.value', value);
    log('type', `Set ${label}`, { value });
  }

  /**
   * Types into a text/number input and asserts the final value.
   * @param selector - Input selector.
   * @param value - Value to set.
   * @param label - Label for logging.
   */
  private setInputValue(selector: string, value: string, label: string): void {
    const input = cy.get(selector, this.common.getTimeoutOptions()).should('exist');
    input.scrollIntoView().clear({ force: true });

    if (value === '') {
      log('clear', `Clearing ${label}`);
      input.should('have.value', '');
      return;
    }

    input.type(value, { delay: 0, force: true }).should('have.value', value);
    log('type', `Set ${label}`, { value });
  }

  /**
   * Checks or unchecks a checkbox/radio control.
   * @param selector - Control selector.
   * @param checked - Desired checked state.
   * @param label - Human-readable label for logging.
   */
  private toggleCheckbox(selector: string, checked: boolean, label: string): void {
    log('select', `Toggling ${label}`, { checked });
    const control = cy.get(selector, this.common.getTimeoutOptions()).should('exist');
    control.scrollIntoView();
    if (checked) {
      control.check({ force: true }).should('be.checked');
      return;
    }
    control.uncheck({ force: true }).should('not.be.checked');
  }

  /**
   * Asserts the collection order selection state.
   * @param choice - Expected choice or not selected.
   */
  private assertCollectionOrder(choice: ManualPaymentTermsExpectations['collectionOrder']): void {
    if (choice === 'Not selected') {
      cy.get(L.collectionOrder.yes, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.collectionOrder.no, this.common.getTimeoutOptions()).should('not.be.checked');
      return;
    }
    const selector = choice === 'Yes' ? L.collectionOrder.yes : L.collectionOrder.no;
    cy.get(selector, this.common.getTimeoutOptions()).should('be.checked');
  }

  /**
   * Asserts the payment term radio selection.
   * @param option - Expected payment term or "Not selected".
   */
  private assertPaymentTerm(option: PaymentTermOption | 'Not selected'): void {
    if (option === 'Not selected') {
      cy.get(L.paymentTerms.payInFull, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.paymentTerms.instalmentsOnly, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.paymentTerms.lumpSumPlusInstalments, this.common.getTimeoutOptions()).should('not.be.checked');
      return;
    }
    const selector = this.resolvePaymentTermSelector(option);
    cy.get(selector, this.common.getTimeoutOptions()).should('be.checked');
  }

  /**
   * Asserts the payment frequency radio selection.
   * @param option - Expected frequency or "Not selected".
   */
  private assertFrequency(option: PaymentFrequencyOption | 'Not selected'): void {
    if (option === 'Not selected') {
      cy.get(L.frequency.weekly, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.frequency.fortnightly, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.frequency.monthly, this.common.getTimeoutOptions()).should('not.be.checked');
      return;
    }
    const selector = this.resolveFrequencySelector(option);
    cy.get(selector, this.common.getTimeoutOptions()).should('be.checked');
  }

  /**
   * Asserts a checkbox/radio checked state.
   * @param selector - Control selector.
   * @param expected - Expected checked state.
   * @param label - Label for logging.
   */
  private assertCheckboxValue(selector: string, expected: boolean, label: string): void {
    log('assert', `Asserting ${label}`, { expected });
    const assertion = expected ? 'be.checked' : 'not.be.checked';
    cy.get(selector, this.common.getTimeoutOptions()).should(assertion);
  }

  /**
   * Asserts the value of an input.
   * @param selector - Input selector.
   * @param expected - Expected value (may be empty string).
   * @param label - Label for logging.
   */
  private assertInputValue(selector: string, expected: string, label: string): void {
    log('assert', `Asserting ${label}`, { expected });
    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Asserts the enforcement option selection.
   * @param option - Expected enforcement option or "Not selected".
   */
  private assertEnforcementOption(option: EnforcementActionOption | 'Not selected'): void {
    if (option === 'Not selected') {
      cy.get(L.enforcement.options.holdOnAccount, this.common.getTimeoutOptions()).should('not.be.checked');
      cy.get(L.enforcement.options.prison, this.common.getTimeoutOptions()).should('not.be.checked');
      return;
    }
    const selector = this.resolveEnforcementSelector(option);
    cy.get(selector, this.common.getTimeoutOptions()).should('be.checked');
  }

  /**
   * Resolves a payment term to its selector.
   * @param option - Payment term option.
   */
  private resolvePaymentTermSelector(option: PaymentTermOption): string {
    switch (option) {
      case 'Pay in full':
        return L.paymentTerms.payInFull;
      case 'Instalments only':
        return L.paymentTerms.instalmentsOnly;
      case 'Lump sum plus instalments':
        return L.paymentTerms.lumpSumPlusInstalments;
      default:
        throw new Error(`Unknown payment term option: ${option as string}`);
    }
  }

  /**
   * Resolves a frequency option to its selector.
   * @param option - Frequency option.
   */
  private resolveFrequencySelector(option: PaymentFrequencyOption): string {
    switch (option) {
      case 'Weekly':
        return L.frequency.weekly;
      case 'Fortnightly':
        return L.frequency.fortnightly;
      case 'Monthly':
        return L.frequency.monthly;
      default:
        throw new Error(`Unknown payment frequency: ${option as string}`);
    }
  }

  /**
   * Resolves an enforcement option to its selector.
   * @param option - Enforcement option.
   */
  private resolveEnforcementSelector(option: EnforcementActionOption): string {
    switch (option) {
      case 'Hold enforcement on account (NOENF)':
        return L.enforcement.options.holdOnAccount;
      case 'Prison (PRIS)':
        return L.enforcement.options.prison;
      default:
        throw new Error(`Unknown enforcement option: ${option as string}`);
    }
  }

  /**
   * Selects an enforcement action option.
   * @param option - Enforcement action to choose.
   */
  private setEnforcementOption(option: EnforcementActionOption): void {
    const selector = this.resolveEnforcementSelector(option);
    log('select', 'Setting enforcement option', { option });
    cy.get(selector, this.common.getTimeoutOptions()).should('exist').scrollIntoView().check({ force: true });
  }
}
