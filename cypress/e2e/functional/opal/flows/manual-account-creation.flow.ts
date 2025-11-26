import { DashboardActions } from '../actions/dashboard.actions';
import { DefendantType, ManualCreateAccountActions } from '../actions/manual-account-creation/create-account.actions';
import { ManualAccountDetailsActions } from '../actions/manual-account-creation/account-details.actions';
import { ManualAccountCommentsNotesActions } from '../actions/manual-account-creation/account-comments-notes.actions';
import { ManualCreateAccountLocators } from '../../../../shared/selectors/manual-account-creation/create-account.locators';
import { ManualAccountTaskNavigationActions } from '../actions/manual-account-creation/task-navigation.actions';
import { log } from '../../../../support/utils/log.helper';

/**
 * Flow for Manual Account Creation.
 *
 * Purpose: encapsulate multi-step journeys across the Manual Account Creation
 * feature so Cucumber steps remain intent-driven and thin.
 */
export class ManualAccountCreationFlow {
  private readonly dashboard = new DashboardActions();
  private readonly createAccount = new ManualCreateAccountActions();
  private readonly accountDetails = new ManualAccountDetailsActions();
  private readonly commentsAndNotes = new ManualAccountCommentsNotesActions();
  private readonly taskNavigation = new ManualAccountTaskNavigationActions();

  /**
   * Starts a Fine manual account and lands on the task list.
   */
  startFineAccount(businessUnit: string, defendantType: DefendantType): void {
    log('flow', 'Start manual fine account', { businessUnit, defendantType });
    this.ensureOnCreateAccountPage();
    this.createAccount.selectBusinessUnit(businessUnit);
    this.createAccount.selectAccountType('Fine');
    this.createAccount.selectDefendantType(defendantType);
    this.createAccount.continueToAccountDetails();
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Opens the Account comments and notes task, sets values, and returns to the task list.
   */
  provideAccountCommentsAndNotes(comment: string, note: string): void {
    log('flow', 'Provide account comments and notes', { comment, note });
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.setComment(comment);
    this.commentsAndNotes.setNote(note);
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Opens the Account comments and notes task and asserts the header.
   */
  viewAccountCommentsAndNotes(): void {
    log('flow', 'View Account comments and notes task');
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.assertHeader();
  }

  /**
   * Returns to account details from the current manual account form.
   */
  returnToAccountDetails(): void {
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * From Account comments and notes, continue to Review and submit and assert the destination header.
   */
  proceedToReviewFromComments(expectedHeader: string): void {
    log('flow', 'Proceed to review from comments and notes', { expectedHeader });
    this.commentsAndNotes.assertReviewAndSubmitVisible();
    this.commentsAndNotes.clickReviewAndSubmit();
    this.accountDetails.assertOnAccountDetailsPage(expectedHeader);
  }

  private ensureOnCreateAccountPage(): void {
    cy.get('body').then(($body) => {
      const isOnPage = $body.find(ManualCreateAccountLocators.businessUnit.input).length > 0;
      if (!isOnPage) {
        log('navigate', 'Navigating to Manual Account Creation via dashboard');
        this.dashboard.goToManualAccountCreation();
      }
    });

    this.createAccount.assertOnCreateAccountPage();
  }
}
