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

  /** Verifies the selected business unit is displayed. */
  public assertSearchForAccountBusinessUnitIsDisplayed(): void {
    this.actions.assertSearchForAccountBusinessUnitIsDisplayed();
  }

  /** Verifies the quick and advanced search fields are displayed. */
  public assertSearchForAccountFieldsAreDisplayed(): void {
    this.actions.assertSearchForAccountFieldsAreDisplayed();
  }

  /** Verifies the details destination for the selected payment category.
   * @param category - Payment category whose details destination should be displayed.
   */
  public assertPaymentCategoryDetailsAreDisplayed(category: 'courtFee' | 'suspense'): void {
    this.actions.assertPaymentCategoryDetailsAreDisplayed(category);
  }

  /** Completes Suspense Details for an unidentified credit-transfer payment. */
  public submitUnidentifiedCreditTransferSuspensePayment(): void {
    this.actions.submitUnidentifiedCreditTransferSuspensePayment();
  }

  /** Verifies the Check Suspense Payment summary. */
  public assertCheckSuspensePaymentIsDisplayed(): void {
    this.actions.assertCheckSuspensePaymentIsDisplayed();
  }

  /**
   * Verifies that a suspense note is mandatory for the selected save action.
   * @param action - Save destination selected by the user.
   */
  public assertSuspenseNoteIsRequired(action: 'reviewTill' | 'addAnother'): void {
    this.actions.assertSuspenseNoteIsRequired(action);
  }

  /** Verifies whitespace cannot satisfy the suspense note requirement. */
  public assertWhitespaceSuspenseNoteIsRejected(): void {
    this.actions.assertWhitespaceSuspenseNoteIsRejected();
  }

  /** Saves the suspense payment and returns to Till Details. */
  public saveSuspensePaymentAndReviewTill(): void {
    this.actions.saveSuspensePaymentAndReviewTill();
  }

  /** Saves a suspense payment then returns to Payment Category to add another payment. */
  public saveSuspensePaymentAndAddAnotherPayment(): void {
    this.actions.saveSuspensePaymentAndAddAnotherPayment();
  }

  /** Opens the saved suspense payment from Till Details. */
  public changeSavedSuspensePayment(): void {
    this.actions.changeSavedSuspensePayment();
  }

  /** Updates a saved suspense payment and returns to Till Details. */
  public updateSavedSuspensePayment(): void {
    this.actions.updateSavedSuspensePayment();
  }

  /** Opens the suspense details form from the summary. */
  public changeSuspensePaymentDetails(): void {
    this.actions.changeSuspensePaymentDetails();
  }

  /**
   * Opens the Suspense Details screen from an individual payment-detail Change link.
   * @param changeLabel - Visually-hidden detail name included in the Change link.
   */
  public openPaymentDetailChangeLink(changeLabel: string): void {
    this.actions.openPaymentDetailChangeLink(changeLabel);
  }

  /**
   * Changes the credit-transfer source and verifies it in the summary.
   * @param source - Credit-transfer source selected by the user.
   */
  public changeCreditTransferSource(source: string): void {
    this.actions.changeCreditTransferSource(source);
  }

  /**
   * Changes the payment method and verifies its summary data.
   * @param method - Payment-method radio value.
   * @param methodLabel - User-facing payment method displayed in the summary.
   * @param reference - Optional reference required by postal-order and cheque payments.
   */
  public changeSuspensePaymentMethod(method: string, methodLabel: string, reference = ''): void {
    this.actions.changeSuspensePaymentMethod(method, methodLabel, reference);
  }

  /** Changes the payment to an identified payer and enters payer details. */
  public amendSuspensePaymentWithPayerDetails(): void {
    this.actions.amendSuspensePaymentWithPayerDetails();
  }

  /**
   * Changes to an identified reason and verifies it in the summary.
   * @param reason - Suspense-reason radio value.
   * @param reasonLabel - User-facing reason displayed in the summary.
   */
  public amendSuspensePaymentWithReason(reason: string, reasonLabel: string): void {
    this.actions.amendSuspensePaymentWithReason(reason, reasonLabel);
  }

  /** Opens payer details from the summary. */
  public changeSuspensePayerDetails(): void {
    this.actions.changeSuspensePayerDetails();
  }

  /**
   * Opens Payer Details from an individual payer-detail Change link.
   * @param changeLabel - Visually-hidden detail name included in the Change link.
   */
  public openPayerDetailChangeLink(changeLabel: string): void {
    this.actions.openPayerDetailChangeLink(changeLabel);
  }

  /**
   * Cancels a suspense draft and accepts or declines the route-guard warning.
   * @param acceptLeave - Whether to discard the draft and leave the page.
   */
  public cancelSuspensePayment(acceptLeave: boolean): void {
    this.actions.cancelSuspensePayment(acceptLeave);
  }

  /** Saves a suspense payment with the 1,000-character note boundary. */
  public saveMaximumLengthSuspenseNote(): void {
    this.actions.saveMaximumLengthSuspenseNote();
  }

  /**
   * Submits a Court Fee payment with the specified amount and item count.
   * @param amount - Amount paid for the court fee.
   * @param numberOfItems - Number of court fee items paid for.
   */
  public submitCourtFeePayment(amount: string, numberOfItems: string): void {
    this.actions.submitCourtFeePayment(amount, numberOfItems);
  }

  /** Verifies the exact-payment destination. */
  public assertCourtFeePaymentDetailsIsDisplayed(): void {
    this.actions.assertCourtFeePaymentDetailsIsDisplayed();
  }

  /** Verifies the over/underpayment destination. */
  public assertCourtFeeOverUnderpaymentIsDisplayed(): void {
    this.actions.assertCourtFeeOverUnderpaymentIsDisplayed();
  }

  /** Verifies whether the confirmation identifies an overpayment or underpayment.
   * @param type - Whether the payment is an overpayment or underpayment.
   */
  public assertCourtFeePaymentTypeIsDisplayed(type: 'overpayment' | 'underpayment'): void {
    this.actions.assertCourtFeePaymentTypeIsDisplayed(type);
  }

  /** Verifies the confirmation banner type and difference amount.
   * @param banner - Alert style expected for the payment difference.
   * @param amount - Difference amount displayed in pounds.
   * @param type - Whether the payment is an overpayment or underpayment.
   */
  public assertCourtFeeDifferenceBannerIsDisplayed(
    banner: 'information' | 'warning',
    amount: string,
    type: 'overpayment' | 'underpayment',
  ): void {
    this.actions.assertCourtFeeDifferenceBannerIsDisplayed(banner, amount, type);
  }

  /** Verifies the court fee, amount, and number of items shown on confirmation.
   * @param courtFee - Selected court fee code, description, and value.
   * @param amount - Entered payment amount.
   * @param numberOfItems - Entered number of items.
   */
  public assertCourtFeePaymentSummaryIsDisplayed(courtFee: string, amount: string, numberOfItems: string): void {
    this.actions.assertCourtFeePaymentSummaryIsDisplayed(courtFee, amount, numberOfItems);
  }

  /** Verifies Confirm and Cancel are available for an overpayment. */
  public assertOverpaymentConfirmationActionsAreDisplayed(): void {
    this.actions.assertOverpaymentConfirmationActionsAreDisplayed();
  }

  /** Selects Confirm for an overpayment. */
  public confirmOverpayment(): void {
    this.actions.confirmOverpayment();
  }

  /** Selects Cancel for an overpayment. */
  public cancelOverpayment(): void {
    this.actions.cancelOverpayment();
  }

  /** Verifies the underpayment screen offers Cancel and return to till and Go back. */
  public assertUnderpaymentConfirmationActionsAreDisplayed(): void {
    this.actions.assertUnderpaymentConfirmationActionsAreDisplayed();
  }

  /** Cancels an underpayment and returns to Till Details. */
  public cancelUnderpaymentAndReturnToTill(): void {
    this.actions.cancelUnderpaymentAndReturnToTill();
  }

  /** Verifies the court fee form has no values after the underpayment draft is discarded. */
  public assertCourtFeeDetailsFormIsBlank(): void {
    this.actions.assertCourtFeeDetailsFormIsBlank();
  }

  /** Selects Back from the overpayment or underpayment confirmation. */
  public goBackFromCourtFeeConfirmation(): void {
    this.actions.goBackFromCourtFeeConfirmation();
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
