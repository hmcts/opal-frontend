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
}
