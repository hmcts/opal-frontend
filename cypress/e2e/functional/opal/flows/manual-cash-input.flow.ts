import { ManualCashInputActions } from '../actions/manual-cash-input.actions';

/** Business journeys for Manual Cash Input. */
export class ManualCashInputFlow {
  private readonly actions = new ManualCashInputActions();

  /** Opens the create-and-allocate screen. */
  public openCreateAndAllocate(): void {
    this.actions.openCreateAndAllocate();
  }

  /** Opens the create-and-allocate screen with outstanding tills. */
  public openCreateAndAllocateWithOutstandingTills(): void {
    this.actions.openCreateAndAllocateWithOutstandingTills();
  }

  /** Selects a till and declines the Back-link warning. */
  public selectTillAndDeclineBackNavigation(): void {
    this.actions.selectTillAndDeclineBackNavigation();
  }

  /** Selects a till and accepts the Back-link warning. */
  public selectTillAndAcceptBackNavigation(): void {
    this.actions.selectTillAndAcceptBackNavigation();
  }

  /** Verifies that the selected till remains selected. */
  public assertSelectionIsRetained(): void {
    this.actions.assertSelectionIsRetained();
  }

  /** Verifies that the Finance landing page is displayed. */
  public assertFinanceLandingPageIsDisplayed(): void {
    this.actions.assertFinanceLandingPageIsDisplayed();
  }

  /** Sorts the till table and refreshes the browser page. */
  public sortTillsAndRefresh(): void {
    this.actions.sortTillsAndRefresh();
  }

  /** Verifies that browser refresh resets till-table sorting. */
  public assertTillSortingIsReset(): void {
    this.actions.assertTillSortingIsReset();
  }

  /** Opens Select Business Unit to begin creating a till. */
  public startCreateTill(): void {
    this.actions.startCreateTill();
  }

  /** Opens Select Business Unit for a user with exactly one permitted business unit. */
  public startCreateTillWithOneBusinessUnit(): void {
    this.actions.startCreateTillWithOneBusinessUnit();
  }

  /** Verifies that the selectable business units are alphabetically ordered. */
  public assertBusinessUnitsAreAlphabetical(): void {
    this.actions.assertBusinessUnitsAreAlphabetical();
  }

  /**
   * Selects a business unit.
   * @param businessUnit - Name of the business unit to select.
   */
  public selectBusinessUnit(businessUnit: string): void {
    this.actions.selectBusinessUnit(businessUnit);
  }

  /** Continues with the selected business unit. */
  public continueWithSelectedBusinessUnit(): void {
    this.actions.continueWithSelectedBusinessUnit();
  }

  /** Attempts to continue without selecting a business unit. */
  public continueWithoutBusinessUnit(): void {
    this.actions.continueWithoutBusinessUnit();
  }

  /** Continues with the automatically selected read-only business unit. */
  public continueWithReadOnlyBusinessUnit(): void {
    this.actions.continueWithReadOnlyBusinessUnit();
  }

  /**
   * Verifies the selected business unit and empty-till guidance on Till Details.
   * @param businessUnit - Name of the selected business unit.
   */
  public assertEmptyTillDetails(businessUnit: string): void {
    this.actions.assertEmptyTillDetails(businessUnit);
  }

  /** Opens Payment Category from Till Details. */
  public addPayment(): void {
    this.actions.addPayment();
  }

  /** Selects a payment category and continues.
   * @param category - Payment category value to select.
   */
  public continueWithPaymentCategory(category: 'criminal' | 'courtFee' | 'suspense'): void {
    this.actions.continueWithPaymentCategory(category);
  }

  /** Verifies the Search for an Account destination. */
  public assertSearchForAccountIsDisplayed(): void {
    this.actions.assertSearchForAccountIsDisplayed();
  }

  /** Verifies the Payment Category page remains displayed. */
  public assertPaymentCategoryIsDisplayed(): void {
    this.actions.assertPaymentCategoryIsDisplayed();
  }

  /** Attempts to continue without selecting a payment category. */
  public continueWithoutPaymentCategory(): void {
    this.actions.continueWithoutPaymentCategory();
  }

  /** Verifies the Payment Category validation summary, field message, and summary link focus. */
  public assertPaymentCategoryValidation(): void {
    this.actions.assertPaymentCategoryValidation();
  }

  /** Cancels Payment Category and returns to Till Details. */
  public cancelPaymentCategory(): void {
    this.actions.cancelPaymentCategory();
  }

  /** Opens Delete Till from Till Details. */
  public deleteTill(): void {
    this.actions.deleteTill();
  }

  /** Cancels without a selection. */
  public cancelWithoutBusinessUnit(): void {
    this.actions.cancelWithoutBusinessUnit();
  }

  /** Selects a business unit and declines the unsaved-changes warning. */
  public selectBusinessUnitAndDeclineCancel(): void {
    this.actions.selectBusinessUnitAndDeclineCancel();
  }

  /** Accepts the unsaved-changes warning after a business-unit selection. */
  public acceptCancelAfterBusinessUnitSelection(): void {
    this.actions.acceptCancelAfterBusinessUnitSelection();
  }
}
