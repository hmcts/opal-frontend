import { When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCashInputSearchResultsFlow } from '../../e2e/functional/opal/flows/manual-cash-input-search-results.flow';

const manualCashInputSearchResultsFlow = () => new ManualCashInputSearchResultsFlow();

When('I search for a matching defendant and open Manual Cash Input Search Results', () => {
  manualCashInputSearchResultsFlow().searchForMatchingDefendantAndOpenResults();
});

When('I open the first Manual Cash Input account result in a new tab', () => {
  manualCashInputSearchResultsFlow().openFirstAccountResultInNewTab();
});
