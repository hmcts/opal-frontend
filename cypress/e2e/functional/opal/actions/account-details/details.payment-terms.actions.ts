/**
 * @file details.payment-terms.actions.ts
 * @description Actions for the Account Details "Payment terms" tab and amend form.
 */
import { AccountPaymentTermsDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.paymen-terms.details.locators';
import { PAYMENT_TERMS_AMEND_ELEMENTS as A } from '../../../../../shared/selectors/account-enquiries-payment-terms-amend.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountDetailsPaymentTermsActions');

type InstalmentFrequencyCode = 'W' | 'F' | 'M';

/**
 * Actions for the Account Details payment terms tab and amend form.
 */
export class AccountDetailsPaymentTermsActions {
  private readonly common = new CommonActions();
  private static readonly DEFAULT_TIMEOUT = 15_000;
  private readonly common = new CommonActions();

  /**
   * Opens the payment terms amend form from the details tab.
   */
  public openChangeLink(): void {
    log('navigate', 'Opening amend payment terms form');
    cy.get(L.tabRoot, this.common.getTimeoutOptions()).should('be.visible');
    cy.contains(L.changeLink, 'Change').should('be.visible').click();
  }

  /**
   * Asserts the amend form is visible.
   */
  public assertAmendFormVisible(): void {
    log('assert', 'Asserting amend payment terms form is visible');
    cy.get(A.form, this.common.getTimeoutOptions()).should('be.visible');
    cy.get(A.pageHeading, this.common.getTimeoutOptions()).should('contain.text', 'Payment terms');
  }

  /**
   * Completes the instalments-only payment terms form.
   * @param options - Payment terms input values.
   * @param options.instalmentAmount - Amount per instalment.
   * @param options.frequencyCode - Instalment frequency code.
   * @param options.startDate - Start date for instalments.
   * @param options.reason - Reason for change.
   * @param options.requestPaymentCard - Whether to request a payment card.
   */
  public fillInstalmentsOnlyPaymentTerms(options: {
    instalmentAmount: string;
    frequencyCode: InstalmentFrequencyCode;
    startDate: string;
    reason: string;
    requestPaymentCard?: boolean;
  }): void {
    log('input', 'Completing instalments only payment terms', options);

    cy.get(A.instalmentsOnlyRadio, this.common.getTimeoutOptions()).check({ force: true });
    cy.get(A.instalmentAmountInput, this.common.getTimeoutOptions()).clear().type(options.instalmentAmount);

    const frequencySelector = this.getFrequencySelector(options.frequencyCode);
    cy.get(frequencySelector, this.common.getTimeoutOptions()).check({ force: true });

    cy.get(A.startDateInput, this.common.getTimeoutOptions()).clear().type(options.startDate);
    cy.get(A.reasonForChangeTextarea, this.common.getTimeoutOptions()).clear().type(options.reason);

    if (options.requestPaymentCard) {
      cy.get(A.paymentCardCheckbox, this.common.getTimeoutOptions()).check({ force: true });
    }
  }

  /**
   * Submits the payment terms amendments.
   */
  public submitChanges(): void {
    log('input', 'Submitting payment terms changes');
    cy.get(A.submitButton, this.common.getTimeoutOptions()).should('be.enabled').click();
  }

  /**
   * Cancels the payment terms amendments.
   */
  public cancelChanges(): void {
    log('cancel', 'Cancelling payment terms changes');
    cy.get(A.cancelLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Asserts the instalment summary values.
   * @param expected - Expected summary values.
   * @param expected.amount - Instalment amount.
   * @param expected.frequency - Instalment frequency.
   * @param expected.startDate - Instalment start date.
   */
  public assertInstalmentSummary(expected: { amount: string; frequency: string; startDate: string }): void {
    log('assert', 'Asserting instalment summary values', expected);
    cy.get(L.fields.instalmentAmount, this.common.getTimeoutOptions()).should('contain.text', expected.amount);
    cy.get(L.fields.instalmentFrequency, this.common.getTimeoutOptions()).should('contain.text', expected.frequency);
    cy.get(L.fields.startDate, this.common.getTimeoutOptions()).should('contain.text', expected.startDate);
  }

  /**
   * Asserts the pay by date value.
   * @param expected - Expected pay by date value.
   */
  public assertPayByDate(expected: string): void {
    log('assert', 'Asserting pay by date value', { expected });
    cy.get(L.fields.payByDate, this.common.getTimeoutOptions()).should('contain.text', expected);
  }

  /**
   * Asserts that instalment rows are not present.
   */
  public assertInstalmentRowsNotPresent(): void {
    log('assert', 'Asserting instalment rows are not present');
    cy.get(L.fields.instalmentAmount, { timeout: 2000 }).should('not.exist');
    cy.get(L.fields.instalmentFrequency, { timeout: 2000 }).should('not.exist');
  }

  /**
   * Resolves the frequency selector for the given code.
   * @param code - Instalment frequency code.
   * @returns Selector for the matching frequency option.
   */
  private getFrequencySelector(code: InstalmentFrequencyCode): string {
    switch (code) {
      case 'W':
        return A.frequencyWeeklyRadio;
      case 'F':
        return A.frequencyFortnightlyRadio;
      case 'M':
      default:
        return A.frequencyMonthlyRadio;
    }
  }
  
  /**
   * Normalizes whitespace for consistent text comparisons.
   *
   * @param value - Raw text value to normalize.
   * @returns Normalized string with collapsed whitespace.
   */
  private normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }

  /**
   * Asserts the Payment terms tab content is visible.
   */
  public assertPaymentTermsTabVisible(): void {
    log('assert', 'Payment terms tab is visible');
    cy.get(L.tab.root, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT }).should('be.visible');
  }

  /**
   * Clicks the "Request payment card" action link from the Payment terms tab.
   */
  public startPaymentCardRequest(): void {
    log('action', 'Starting payment card request');
    cy.get(L.tab.requestPaymentCardLink, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }

  /**
   * Asserts the Request payment card confirmation page is displayed.
   *
   * @param expectedHeader - Expected confirmation heading text.
   */
  public assertOnRequestPaymentCardConfirmation(expectedHeader: string): void {
    log('assert', 'Request payment card confirmation page is visible', { expectedHeader });
    cy.location('pathname', { timeout: this.common.getPathTimeout() }).should('include', '/payment-card/request');
    cy.get(L.confirmation.header, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .should(($el) => {
        const text = this.normalize($el.text());
        expect(text).to.include(this.normalize(expectedHeader));
      });
    cy.get(L.confirmation.confirmButton, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT }).should(
      'exist',
    );
    cy.get(L.confirmation.cancelLink, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT }).should('exist');
  }

  /**
   * Clicks the confirm button and waits for the payment card request API call.
   */
  public confirmPaymentCardRequest(): void {
    log('action', 'Confirming payment card request');
    cy.intercept('POST', '**/payment-card-request').as('requestPaymentCard');
    cy.intercept('GET', '**/payment-terms/latest').as('paymentTermsLatest');
    cy.get(L.confirmation.confirmButton, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
    cy.wait('@requestPaymentCard');
  }

  /**
   * Waits for the payment terms refresh API call after a request is submitted.
   */
  public waitForPaymentTermsRefresh(): void {
    log('wait', 'Waiting for payment terms refresh');
    cy.wait('@paymentTermsLatest');
  }

  /**
   * Clicks the cancel link on the confirmation page.
   */
  public cancelPaymentCardRequest(): void {
    log('action', 'Cancelling payment card request');
    cy.get(L.confirmation.cancelLink, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }

  /**
   * Captures the current "Payment card last requested" value into an alias.
   *
   * @param aliasName - Alias name to store the value under.
   */
  public capturePaymentCardLastRequested(aliasName: string): void {
    log('action', 'Capturing payment card last requested value', { aliasName });
    cy.get(L.tab.paymentCardLastRequestedValue, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .invoke('text')
      .then((value) => {
        cy.wrap(this.normalize(value), { log: false }).as(aliasName);
      });
  }

  /**
   * Asserts the "Payment card last requested" value equals the provided text.
   *
   * @param expected - Expected display value.
   */
  public assertPaymentCardLastRequestedEquals(expected: string): void {
    log('assert', 'Payment card last requested equals', { expected });
    cy.get(L.tab.paymentCardLastRequestedValue, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .invoke('text')
      .then((value) => {
        const normalized = this.normalize(value);
        expect(normalized).to.eq(this.normalize(expected));
      });
  }

  /**
   * Asserts the "Payment card last requested" value matches a stored alias.
   *
   * @param aliasName - Alias name that contains the expected value.
   */
  public assertPaymentCardLastRequestedMatchesAlias(aliasName: string): void {
    log('assert', 'Payment card last requested matches alias', { aliasName });
    cy.get(`@${aliasName}`).then((expected) => {
      this.assertPaymentCardLastRequestedEquals(String(expected ?? ''));
    });
  }

  /**
   * Asserts the success banner is visible with the expected message.
   *
   * @param expected - Expected banner text.
   */
  public assertSuccessBannerText(expected: string): void {
    log('assert', 'Success banner text', { expected });
    cy.get(L.banners.success, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .find(L.banners.successText)
      .should('contain.text', expected);
  }

  /**
   * Asserts the success banner is not visible.
   */
  public assertSuccessBannerNotVisible(): void {
    log('assert', 'Success banner not visible');
    cy.get(L.banners.success).should('not.exist');
  }

  /**
   * Asserts the "payment card request already exists" error text is present.
   *
   * @param expected - Expected error text.
   */
  public assertPaymentCardRequestAlreadyExistsError(expected: string): void {
    log('assert', 'Existing payment card request error', { expected });
    cy.contains(expected, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT }).should('be.visible');
  }
}
