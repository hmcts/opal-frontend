import { ManualCashInputSearchResultsActions } from '../actions/manual-cash-input-search-results.actions';

/** Business journeys for Manual Cash Input Search Results. */
export class ManualCashInputSearchResultsFlow {
  private readonly actions = new ManualCashInputSearchResultsActions();

  /** Searches for a matching defendant and opens Search Results. */
  public searchForMatchingDefendantAndOpenResults(): void {
    this.actions.searchForMatchingDefendantAndOpenResults();
  }

  /** Opens the first Search Results account link and verifies its Account Enquiry destination. */
  public openFirstAccountResultInNewTab(): void {
    this.actions.openFirstAccountResultInNewTab();
  }

  /** Submits conflicting account-number and company criteria to open the Invalid Search Combination screen. */
  public submitCombinedCompanySearch(): void {
    this.actions.submitCombinedCompanySearch();
  }

  /** Selects Go back from Invalid Search Combination and confirms company criteria are restored. */
  public returnToSearchFromInvalidCombination(): void {
    this.actions.returnToSearchFromInvalidCombination();
  }

  /** Confirms Search for an account returns with the submitted company criteria and tab retained. */
  public assertCompanySearchCriteriaRetained(): void {
    this.actions.assertCompanySearchCriteriaRetained();
  }

  /** Creates a till using complete account-confirmation BU reference data. */
  public createTillForAccountChecks(): void {
    this.actions.createTillForAccountChecks();
  }

  /**
   * Searches, selects and opens the requested synthetic account state.
   * @param state - Synthetic selected-account state.
   * @param masterState - Synthetic master-account state.
   */
  public openAccountForPayment(state: string, masterState = 'eligible'): void {
    this.actions.openAccountForPayment(state, masterState);
  }

  /**
   * Verifies the account identity, selected BU and payment eligibility.
   * @param accountNumber - Expected displayed account number.
   * @param heading - Expected page heading.
   */
  public assertPaymentAccount(accountNumber: string, heading: string): void {
    this.actions.assertPaymentAccount(accountNumber, heading);
  }

  /**
   * Verifies the account's restriction banner.
   * @param warning - Expected restriction text.
   */
  public assertPaymentWarning(warning: string): void {
    this.actions.assertPaymentWarning(warning);
  }

  /**
   * Confirms the selected account and its onward destination.
   * @param id - Selected defendant account ID.
   */
  public confirmPaymentAccount(id: string): void {
    this.actions.confirmPaymentAccount(id);
  }

  /**
   * Submits one consolidated-account next step.
   * @param choice - Master, suspense or none for validation.
   */
  public continuePaymentNextStep(choice: string): void {
    this.actions.continuePaymentNextStep(choice);
  }

  /** Verifies required-choice validation and focus. */
  public assertPaymentChoiceError(): void {
    this.actions.assertPaymentChoiceError();
  }

  /**
   * Pays the selected account into suspense via its available control.
   * @param consolidated - Whether the screen has consolidated next-step radios.
   */
  public payAccountIntoSuspense(consolidated: boolean): void {
    this.actions.payAccountIntoSuspense(consolidated);
  }

  /**
   * Returns to the original search result set.
   * @param browserBack - Whether to use browser Back instead of the page link.
   */
  public returnToPaymentResults(browserBack: boolean): void {
    this.actions.returnToPaymentResults(browserBack);
  }

  /** Cancels this payment and starts a new payment from the retained till. */
  public cancelPaymentAccountAndStartNewPayment(): void {
    this.actions.cancelPaymentAccountAndStartNewPayment();
  }

  /**
   * Verifies the account enquiry link and follows its destination.
   * @param id - Defendant account ID displayed on the payment screen.
   */
  public openPaymentAccountEnquiry(id: string): void {
    this.actions.openPaymentAccountEnquiry(id);
  }
}
