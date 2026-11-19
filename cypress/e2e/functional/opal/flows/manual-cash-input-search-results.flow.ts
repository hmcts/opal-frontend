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
}
