import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { AutomaticCashInputFlow } from '../../e2e/functional/opal/flows/automatic-cash-input.flow';

const automaticCashInputFlow = () => new AutomaticCashInputFlow();

When('I open Automatic Cash Input Select Business Units', () => {
  automaticCashInputFlow().openSelectBusinessUnits();
});

Then('only business units with Process and allocate payments permission are displayed', () => {
  automaticCashInputFlow().assertOnlyPermittedBusinessUnitsAreDisplayed();
});

When('I select business units and continue to Processing', () => {
  automaticCashInputFlow().selectBusinessUnitsAndContinueWithStubbedProcessFiles();
});

Then('only files for the selected business units are displayed', () => {
  automaticCashInputFlow().assertOnlySelectedBusinessUnitFilesAreDisplayed();
});
