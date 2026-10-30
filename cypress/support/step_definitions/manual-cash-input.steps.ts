import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCashInputFlow } from '../../e2e/functional/opal/flows/manual-cash-input.flow';

const manualCashInputFlow = () => new ManualCashInputFlow();

When('I open Manual Cash Input', () => {
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

When('I create a till', () => {
  manualCashInputFlow().startCreateTill();
});

When('I create a till with one unit', () => {
  manualCashInputFlow().startCreateTillWithOneBusinessUnit();
});

Then('the Manual Cash Input business units are listed alphabetically', () => {
  manualCashInputFlow().assertBusinessUnitsAreAlphabetical();
});

When('I select {string}', (businessUnit: string) => {
  manualCashInputFlow().selectBusinessUnit(businessUnit);
});

When('I continue', () => {
  manualCashInputFlow().continueWithSelectedBusinessUnit();
});

When('I continue without a selection', () => {
  manualCashInputFlow().continueWithoutBusinessUnit();
});

When('I continue with the read-only unit', () => {
  manualCashInputFlow().continueWithReadOnlyBusinessUnit();
});

Then('I see empty Till Details for {string}', (businessUnit: string) => {
  manualCashInputFlow().assertEmptyTillDetails(businessUnit);
});

When('I add a payment to the till', () => {
  manualCashInputFlow().addPayment();
});

When('I delete the till being created', () => {
  manualCashInputFlow().deleteTill();
});

When('I cancel', () => {
  manualCashInputFlow().cancelWithoutBusinessUnit();
});

When('I cancel with a unit', () => {
  manualCashInputFlow().selectBusinessUnitAndDeclineCancel();
});

When('I accept the warning', () => {
  manualCashInputFlow().acceptCancelAfterBusinessUnitSelection();
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
