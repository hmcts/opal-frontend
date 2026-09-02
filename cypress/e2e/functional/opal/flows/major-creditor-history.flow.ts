import { MajorCreditorHistoryActions } from '../actions/account-details/details.major-creditor-history.actions';

/** Business flow for the Major Creditor History and notes tab. */
export class MajorCreditorHistoryFlow {
  private readonly historyAndNotes = new MajorCreditorHistoryActions();

  /** Opens the Major Creditor History and notes tab and verifies its API response. */
  public openHistoryAndNotes(): void {
    this.historyAndNotes.openHistoryAndNotesTab();
  }

  /** Verifies that the Major Creditor History and notes tab shell is displayed. */
  public assertHistoryAndNotesShellVisible(): void {
    this.historyAndNotes.assertHistoryAndNotesShellVisible();
  }
}
