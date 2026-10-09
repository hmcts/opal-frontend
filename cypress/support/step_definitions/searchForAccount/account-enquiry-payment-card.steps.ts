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

const getTodayDisplayDate = (): string =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

/**
 * @step Supports the Cucumber step: I go to the Payment terms section
 */
When('I go to the Payment terms section', () => {
  log('step', 'Navigating to Payment terms section');
  flow().goToPaymentTermsTab();
});

/**
 * @step Supports the Cucumber step: I start a payment card request
 */
When('I start a payment card request', () => {
  log('step', 'Starting payment card request');
  flow().startPaymentCardRequest();
});

/**
 * @step Supports the Cucumber step: I confirm the payment card request
 */
When('I confirm the payment card request', () => {
  log('step', 'Confirming payment card request');
  flow().confirmPaymentCardRequest();
});

/**
 * @step Supports the Cucumber step: I should see the request payment card confirmation screen
 */
Then('I should see the request payment card confirmation screen', () => {
  log('step', 'Asserting request payment card confirmation screen');
  flow().assertConfirmationScreen(CONFIRMATION_HEADING);
});

/**
 * @step Supports the Cucumber step: I should see the payment card request success message
 */
Then('I should see the payment card request success message', () => {
  log('step', 'Asserting payment card request success message');
  flow().waitForPaymentTermsRefresh();
  flow().assertSuccessBanner(SUCCESS_MESSAGE);
});

/**
 * @step Supports the Cucumber step: the payment card last requested date should be today date
 */
Then('the payment card last requested date should be today date', () => {
  const today = getTodayDisplayDate();
  log('step', 'Asserting payment card last requested date', { today });
  flow().assertPaymentCardLastRequestedEquals(today);
});

/**
 * @step Supports the Cucumber step: I should see the payment card request already exists error
 */
Then('I should see the payment card request already exists error', () => {
  log('step', 'Asserting existing payment card request error');
  flow().assertPaymentCardRequestAlreadyExistsError(ALREADY_EXISTS_MESSAGE);
});
