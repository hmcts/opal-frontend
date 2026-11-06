/**
 * @file account-enquiry.change-links.steps.ts
 * @description
 * Additional Account Enquiry step definitions used only by the PO-2671 / PO-8248
 * Defendant tab section Change action scenarios.
 */

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { AccountDetailsChangeLinksActions } from '../../../e2e/functional/opal/actions/account-details/details.change-links.actions';

const changeLinks = () => new AccountDetailsChangeLinksActions();

/**
 * @step Selects a specific Change action from the Defendant tab summary cards.
 * @param section - Visible summary card title to target.
 */
When('the {string} Defendant tab Change action is selected', (section: string) => {
  changeLinks().openDefendantTabChangeLink(section);
});

/**
 * @step Selects a specific Change action from the Parent or guardian tab summary cards.
 * @param section - Visible summary card title to target.
 */
When('the {string} Parent or guardian tab Change action is selected', (section: string) => {
  changeLinks().openParentGuardianTabChangeLink(section);
});

/**
 * @step Confirms the amend page route, fragment, and target section after selecting a Change action.
 * @param partyType - `individual` or `company` amend route target.
 * @param fragment - Expected fragment inside the amend page.
 */
Then(
  'I should be on the {string} amend route with fragment {string}',
  (partyType: 'individual' | 'company' | 'parentGuardian', fragment: string) => {
    changeLinks().assertOnAmendRouteWithFragment(partyType, fragment);
  },
);

/**
 * @step Verifies the Payment terms Change action is scoped inside the payment terms panel.
 */
Then('I should only see one Change action inside the Payment terms panel', () => {
  changeLinks().assertSinglePaymentTermsChangeLink();
});

/**
 * @step Verifies the Payment terms amend screen is displayed after selecting Change.
 */
Then('I should be on the Payment terms amend screen', () => {
  changeLinks().assertPaymentTermsAmendScreen();
});
