import { MajorCreditorHistoryActions } from '../actions/account-details/details.major-creditor-history.actions';

/** Business flow for the Major Creditor History and notes tab. */
export class MajorCreditorHistoryFlow {
  private readonly historyAndNotes = new MajorCreditorHistoryActions();

  /** Opens the Major Creditor History and notes tab and verifies its API response. */
  public openHistoryAndNotes(): void {
    this.historyAndNotes.openHistoryAndNotesTab();
  }

  /** Stubs deterministic Major Creditor History and notes data for the current journey. */
  public stubHistoryAndNotesTabData(): void {
    this.historyAndNotes.stubHistoryAndNotesTabData();
  }

  /** Verifies that the Major Creditor History and notes tab shell is displayed. */
  public assertHistoryAndNotesShellVisible(): void {
    this.historyAndNotes.assertHistoryAndNotesShellVisible();
  }

  /** Verifies that the Major Creditor History and notes table rows are displayed. */
  public assertHistoryAndNotesItemsLoaded(): void {
    this.historyAndNotes.assertHistoryAndNotesItemsLoaded();
  }

  /** Filters the Major Creditor History and notes table by date. */
  public filterHistoryAndNotesByDate(): void {
    this.historyAndNotes.applyDateFilter();
  }

  /** Verifies that the Major Creditor History and notes table shows the filtered result. */
  public assertHistoryAndNotesFilteredByDate(): void {
    this.historyAndNotes.assertHistoryAndNotesFilteredByDate();
  }

  /** Opens the first account link in the Major Creditor History and notes table. */
  public openHistoryAndNotesAccountLinkInNewTab(): void {
    this.historyAndNotes.openFirstAccountLinkInNewTabAndAssert();
  }
}
