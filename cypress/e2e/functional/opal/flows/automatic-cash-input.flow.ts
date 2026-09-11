import { AutomaticCashInputActions } from '../actions/automatic-cash-input.actions';

/**
 * Business journeys for Automatic Cash Input.
 */
export class AutomaticCashInputFlow {
  private readonly actions = new AutomaticCashInputActions();

  /**
   * Opens the Automatic Cash Input Select Business Units screen.
   */
  public openSelectBusinessUnits(): void {
    this.actions.openSelectBusinessUnits();
  }

  /**
   * Verifies the displayed BUs are restricted to the signed-in user's permission scope.
   */
  public assertOnlyPermittedBusinessUnitsAreDisplayed(): void {
    this.actions.assertOnlyPermittedBusinessUnitsAreDisplayed();
  }

  /**
   * Selects BUs and moves to Processing with deterministic eligible file data.
   */
  public selectBusinessUnitsAndContinueWithStubbedProcessFiles(): void {
    this.actions.selectBusinessUnitsAndContinueWithStubbedProcessFiles();
  }

  /**
   * Verifies Processing only renders files for the BUs selected earlier in the journey.
   */
  public assertOnlySelectedBusinessUnitFilesAreDisplayed(): void {
    this.actions.assertOnlySelectedBusinessUnitFilesAreDisplayed();
  }
}
