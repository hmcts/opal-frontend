/**
 * @file details.payment-terms.actions.ts
 * @description Actions and assertions for the Account Details Payment terms tab
 * and the Request payment card confirmation page.
 */
import { AccountPaymentTermsDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.paymen-terms.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountDetailsPaymentTermsActions');

/**
 * Actions and assertions for the Payment terms tab and Request payment card confirmation page.
 */
export class AccountDetailsPaymentTermsActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;
  private readonly common = new CommonActions();

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
    cy.get(L.confirmation.confirmButton, { timeout: AccountDetailsPaymentTermsActions.DEFAULT_TIMEOUT }).should('exist');
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
