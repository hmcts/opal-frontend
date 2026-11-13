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
}
