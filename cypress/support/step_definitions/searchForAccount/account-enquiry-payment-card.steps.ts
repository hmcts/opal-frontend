/**
 * @file account-enquiry-payment-card.steps.ts
 * @description
 * Cucumber step definitions for Request payment card Account Enquiry journeys.
 *
 * Steps are thin shims that delegate to the AccountEnquiryPaymentCardFlow.
 */

import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { AccountEnquiryPaymentCardFlow } from '../../../e2e/functional/opal/flows/account-enquiry-payment-card.flow';
import { log } from '../../utils/log.helper';

const flow = () => new AccountEnquiryPaymentCardFlow();

const CONFIRMATION_HEADING = 'Do you want to request a payment card for the defendant?';
const SUCCESS_MESSAGE = 'Payment card request submitted successfully';
const ALREADY_EXISTS_MESSAGE = 'A payment card request already exists for this account.';
const LAST_REQUESTED_ALIAS = 'paymentCardLastRequested';

const getTodayDisplayDate = (): string =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

When('I go to the Payment terms section', () => {
  log('step', 'Navigating to Payment terms section');
  flow().goToPaymentTermsTab();
});

When('I start a payment card request', () => {
  log('step', 'Starting payment card request');
  flow().startPaymentCardRequest();
});

When('I confirm the payment card request', () => {
  log('step', 'Confirming payment card request');
  flow().confirmPaymentCardRequest();
});

When('I cancel the payment card request', () => {
  log('step', 'Cancelling payment card request');
  flow().cancelPaymentCardRequest();
});

When('I capture the payment card last requested value', () => {
  log('step', 'Capturing payment card last requested value');
  flow().capturePaymentCardLastRequested(LAST_REQUESTED_ALIAS);
});

Then('I should see the request payment card confirmation screen', () => {
  log('step', 'Asserting request payment card confirmation screen');
  flow().assertConfirmationScreen(CONFIRMATION_HEADING);
});

Then('I should return to the Payment terms section', () => {
  log('step', 'Asserting Payment terms section is active');
  flow().assertOnPaymentTermsTab();
});

Then('I should see the payment card request success message', () => {
  log('step', 'Asserting payment card request success message');
  flow().waitForPaymentTermsRefresh();
  flow().assertSuccessBanner(SUCCESS_MESSAGE);
});

Then('I should not see a payment card request success message', () => {
  log('step', 'Asserting success banner is not visible');
  flow().assertSuccessBannerNotVisible();
});

Then('the payment card last requested value should match the captured value', () => {
  log('step', 'Asserting payment card last requested value unchanged');
  flow().assertPaymentCardLastRequestedMatchesAlias(LAST_REQUESTED_ALIAS);
});

Then('the payment card last requested date should be today date', () => {
  const today = getTodayDisplayDate();
  log('step', 'Asserting payment card last requested date', { today });
  flow().assertPaymentCardLastRequestedEquals(today);
});

Then('I should see the payment card request already exists error', () => {
  log('step', 'Asserting existing payment card request error');
  flow().assertPaymentCardRequestAlreadyExistsError(ALREADY_EXISTS_MESSAGE);
});
