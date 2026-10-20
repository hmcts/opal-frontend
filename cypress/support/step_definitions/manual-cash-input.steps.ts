import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCashInputFlow } from '../../e2e/functional/opal/flows/manual-cash-input.flow';

const manualCashInputFlow = () => new ManualCashInputFlow();

When('I open Manual Cash Input create and allocate', () => {
  manualCashInputFlow().openCreateAndAllocate();
});

When('I open Manual Cash Input with outstanding tills', () => {
  manualCashInputFlow().openCreateAndAllocateWithOutstandingTills();
});

When('I select a till and decline the Manual Cash Input leave-page warning', () => {
  manualCashInputFlow().selectTillAndDeclineBackNavigation();
});

When('I select a till and accept the Manual Cash Input leave-page warning', () => {
  manualCashInputFlow().selectTillAndAcceptBackNavigation();
});

When('I select Create Till from Manual Cash Input', () => {
  manualCashInputFlow().startCreateTill();
});

Then('I remain on Manual Cash Input with the till selected', () => {
  manualCashInputFlow().assertSelectionIsRetained();
});

Then('I return to the Finance landing page', () => {
  manualCashInputFlow().assertFinanceLandingPageIsDisplayed();
});

When('I sort Manual Cash Input tills and refresh the page', () => {
  manualCashInputFlow().sortTillsAndRefresh();
});

Then('Manual Cash Input till sorting is reset', () => {
  manualCashInputFlow().assertTillSortingIsReset();
});
