import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCashInputSearchResultsFlow } from '../../e2e/functional/opal/flows/manual-cash-input-search-results.flow';

const manualCashInputSearchResultsFlow = () => new ManualCashInputSearchResultsFlow();

When('I search for a matching defendant and open Manual Cash Input Search Results', () => {
  manualCashInputSearchResultsFlow().searchForMatchingDefendantAndOpenResults();
});

When('I open the first Manual Cash Input account result in a new tab', () => {
  manualCashInputSearchResultsFlow().openFirstAccountResultInNewTab();
});

When('I submit combined account number and company criteria in Manual Cash Input Search', () => {
  manualCashInputSearchResultsFlow().submitCombinedCompanySearch();
});

When('I select Go back from the Invalid Search Combination screen', () => {
  manualCashInputSearchResultsFlow().returnToSearchFromInvalidCombination();
});

Then('I see Search for an account with the submitted company criteria retained', () => {
  manualCashInputSearchResultsFlow().assertCompanySearchCriteriaRetained();
});

When('I create a till for account confirmation', () => {
  manualCashInputSearchResultsFlow().createTillForAccountChecks();
});

When('I select a Manual Cash Input account that is {string}', (state: string) => {
  manualCashInputSearchResultsFlow().openAccountForPayment(state);
});

When('I select a consolidated Manual Cash Input account whose master is {string}', (state: string) => {
  manualCashInputSearchResultsFlow().openAccountForPayment('consolidated', state);
});

Then('I see Manual Cash Input account {string} on {string}', (accountNumber: string, heading: string) => {
  manualCashInputSearchResultsFlow().assertPaymentAccount(accountNumber, heading);
});

Then('the Manual Cash Input restriction is {string}', (warning: string) => {
  manualCashInputSearchResultsFlow().assertPaymentWarning(warning);
});

When('I confirm Manual Cash Input account ID {string}', (id: string) => {
  manualCashInputSearchResultsFlow().confirmPaymentAccount(id);
});

When('I continue with Manual Cash Input next step {string}', (choice: string) => {
  manualCashInputSearchResultsFlow().continuePaymentNextStep(choice);
});

Then('I see the Manual Cash Input next step validation and focus', () => {
  manualCashInputSearchResultsFlow().assertPaymentChoiceError();
});

When('I pay the restricted Manual Cash Input account into suspense', () => {
  manualCashInputSearchResultsFlow().payAccountIntoSuspense(false);
});

When('I pay the consolidated Manual Cash Input account into suspense', () => {
  manualCashInputSearchResultsFlow().payAccountIntoSuspense(true);
});

When('I return from Manual Cash Input account details to the retained results', () => {
  manualCashInputSearchResultsFlow().returnToPaymentResults(false);
});

When('I use browser Back from the Manual Cash Input master to the retained results', () => {
  manualCashInputSearchResultsFlow().returnToPaymentResults(true);
});

When('I cancel Manual Cash Input account confirmation and start a new payment', () => {
  manualCashInputSearchResultsFlow().cancelPaymentAccountAndStartNewPayment();
});

When('I open Manual Cash Input account ID {string} in Account Enquiry', (id: string) => {
  manualCashInputSearchResultsFlow().openPaymentAccountEnquiry(id);
});
