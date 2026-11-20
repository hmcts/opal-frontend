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
