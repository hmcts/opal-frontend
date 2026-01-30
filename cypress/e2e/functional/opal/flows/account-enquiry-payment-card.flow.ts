/**
 * @file account-enquiry-payment-card.flow.ts
 * @description Flow for Request payment card journeys within Account Enquiry.
 *
 * Combines navigation to Payment terms, opening the confirmation screen,
 * and asserting success/error outcomes.
 */
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { AccountDetailsNavActions } from '../actions/account-details/details.nav.actions';
import { AccountDetailsPaymentTermsActions } from '../actions/account-details/details.payment-terms.actions';

const log = createScopedLogger('AccountEnquiryPaymentCardFlow');

/**
 * High-level flow for Request payment card actions in Account Enquiry.
 */
export class AccountEnquiryPaymentCardFlow {
  private readonly nav = new AccountDetailsNavActions();
  private readonly paymentTerms = new AccountDetailsPaymentTermsActions();

  /**
   * Navigates to the Payment terms tab and asserts it is active.
   */
  public goToPaymentTermsTab(): void {
    log('method', 'goToPaymentTermsTab()');
    this.nav.goToPaymentTermsTab();
    this.nav.assertPaymentTermsTabIsActive();
    this.paymentTerms.assertPaymentTermsTabVisible();
  }

  /**
   * Asserts the Payment terms tab is active and visible.
   */
  public assertOnPaymentTermsTab(): void {
    log('method', 'assertOnPaymentTermsTab()');
    this.nav.assertPaymentTermsTabIsActive();
    this.paymentTerms.assertPaymentTermsTabVisible();
  }

  /**
   * Starts a payment card request from the Payment terms tab.
   */
  public startPaymentCardRequest(): void {
    log('method', 'startPaymentCardRequest()');
    this.paymentTerms.startPaymentCardRequest();
  }

  /**
   * Asserts the confirmation page content.
   *
   * @param expectedHeader - Expected confirmation heading text.
   */
  public assertConfirmationScreen(expectedHeader: string): void {
    log('method', 'assertConfirmationScreen()', { expectedHeader });
    this.paymentTerms.assertOnRequestPaymentCardConfirmation(expectedHeader);
  }

  /**
   * Confirms the payment card request and waits for the request API call.
   */
  public confirmPaymentCardRequest(): void {
    log('method', 'confirmPaymentCardRequest()');
    this.paymentTerms.confirmPaymentCardRequest();
  }

  /**
   * Cancels the payment card request and returns to Payment terms.
   */
  public cancelPaymentCardRequest(): void {
    log('method', 'cancelPaymentCardRequest()');
    this.paymentTerms.cancelPaymentCardRequest();
    this.nav.assertPaymentTermsTabIsActive();
  }

  /**
   * Captures the current payment card last requested value into an alias.
   *
   * @param aliasName - Alias to store the value under.
   */
  public capturePaymentCardLastRequested(aliasName: string): void {
    log('method', 'capturePaymentCardLastRequested()', { aliasName });
    this.paymentTerms.capturePaymentCardLastRequested(aliasName);
  }

  /**
   * Asserts the payment card last requested value matches a stored alias.
   *
   * @param aliasName - Alias containing the expected value.
   */
  public assertPaymentCardLastRequestedMatchesAlias(aliasName: string): void {
    log('method', 'assertPaymentCardLastRequestedMatchesAlias()', { aliasName });
    this.paymentTerms.assertPaymentCardLastRequestedMatchesAlias(aliasName);
  }

  /**
   * Asserts the payment card last requested value equals the expected text.
   *
   * @param expected - Expected display value.
   */
  public assertPaymentCardLastRequestedEquals(expected: string): void {
    log('method', 'assertPaymentCardLastRequestedEquals()', { expected });
    this.paymentTerms.assertPaymentCardLastRequestedEquals(expected);
  }

  /**
   * Asserts the success banner message.
   *
   * @param expected - Expected success message.
   */
  public assertSuccessBanner(expected: string): void {
    log('method', 'assertSuccessBanner()', { expected });
    this.paymentTerms.assertSuccessBannerText(expected);
  }

  /**
   * Waits for the Payment terms refresh call to complete.
   */
  public waitForPaymentTermsRefresh(): void {
    log('method', 'waitForPaymentTermsRefresh()');
    this.paymentTerms.waitForPaymentTermsRefresh();
  }

  /**
   * Asserts the success banner is not visible.
   */
  public assertSuccessBannerNotVisible(): void {
    log('method', 'assertSuccessBannerNotVisible()');
    this.paymentTerms.assertSuccessBannerNotVisible();
  }

  /**
   * Asserts the "already exists" error message is displayed.
   *
   * @param expected - Expected error text.
   */
  public assertPaymentCardRequestAlreadyExistsError(expected: string): void {
    log('method', 'assertPaymentCardRequestAlreadyExistsError()', { expected });
    this.paymentTerms.assertPaymentCardRequestAlreadyExistsError(expected);
  }
}
