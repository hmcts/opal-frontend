import { DashboardActions } from '../actions/dashboard.actions';
import { DefendantType, ManualCreateAccountActions } from '../actions/manual-account-creation/create-account.actions';
import { ManualAccountDetailsActions } from '../actions/manual-account-creation/account-details.actions';
import { ManualAccountCommentsNotesActions } from '../actions/manual-account-creation/account-comments-notes.actions';
import { ManualCreateAccountLocators } from '../../../../shared/selectors/manual-account-creation/create-account.locators';
import { ManualAccountTaskName } from '../../../../shared/selectors/manual-account-creation/account-details.locators';
import { ManualAccountTaskNavigationActions } from '../actions/manual-account-creation/task-navigation.actions';
import { log } from '../../../../support/utils/log.helper';
import { CommonActions } from '../actions/common/common.actions';
import { ManualCompanyDetailsActions } from '../actions/manual-account-creation/company-details.actions';
import { AccountType } from '../actions/manual-account-creation/create-account.actions';

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
  private readonly companyDetails = new ManualCompanyDetailsActions();
  private readonly taskNavigation = new ManualAccountTaskNavigationActions();
  private readonly common = new CommonActions();

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
    cy.location('pathname', { timeout: 15_000 }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Starts a fine manual account and opens the requested task.
   */
  startFineAccountAndOpenTask(
    businessUnit: string,
    defendantType: DefendantType,
    taskName: ManualAccountTaskName,
  ): void {
    log('flow', 'Start fine account and open task', { businessUnit, defendantType, taskName });
    this.startFineAccount(businessUnit, defendantType);
    this.openTaskFromAccountDetails(taskName);
  }

  /**
   * Reloads the create account page and restarts manual account creation.
   */
  restartManualAccount(businessUnit: string, accountType: AccountType, defendantType: DefendantType): void {
    log('flow', 'Restart manual account after refresh', { businessUnit, accountType, defendantType });
    cy.reload();
    this.createAccount.assertOnCreateAccountPage();
    this.createAccount.selectBusinessUnit(businessUnit);
    this.createAccount.selectAccountType(accountType);
    this.createAccount.selectDefendantType(defendantType);
    this.goToAccountDetails();
  }

  /**
   * Continues from the create account page to the account details task list.
   */
  goToAccountDetails(): void {
    log('flow', 'Continue to account details task list');
    this.createAccount.continueToAccountDetails();
    cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Opens a task from account details and asserts the destination page.
   */
  openTaskFromAccountDetails(taskName: ManualAccountTaskName): void {
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openTask(taskName);

    if (taskName === 'Company details') {
      this.companyDetails.assertOnCompanyDetailsPage();
      return;
    }

    if (taskName === 'Account comments and notes') {
      cy.location('pathname', { timeout: 20_000 }).should('include', 'account-comments');
      this.commentsAndNotes.assertHeader();
    }
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
   * Opens the Company details task and asserts the destination.
   */
  openCompanyDetailsTask(): void {
    log('flow', 'Opening Company details task');
    this.accountDetails.openTask('Company details');
    this.companyDetails.assertOnCompanyDetailsPage();
  }

  /**
   * Returns to account details from the current manual account form.
   */
  returnToAccountDetails(): void {
    this.taskNavigation.returnToAccountDetails();
  }

  /**
   * Navigates from the dashboard to the Manual Account Creation start page.
   * Asserts both the dashboard and the target page.
   */
  goToManualAccountCreationFromDashboard(): void {
    log('flow', 'Navigate to Manual Account Creation from dashboard');
    this.dashboard.assertDashboard();
    this.ensureOnCreateAccountPage();
  }

  /**
   * From Account comments and notes, continue to Review and submit and assert the destination header.
   */
  proceedToReviewFromComments(expectedHeader: string): void {
    log('flow', 'Proceed to review from comments and notes', { expectedHeader });
    this.commentsAndNotes.assertReviewAndSubmitVisible();
    this.commentsAndNotes.clickReviewAndSubmit();
    cy.location('pathname', { timeout: 20_000 }).should((path) => {
      expect(path).to.match(/(check-account|review-account)/i);
    });
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  private ensureOnCreateAccountPage(): void {
    this.dashboard.goToManualAccountCreation();
    this.createAccount.assertOnCreateAccountPage();
  }
}
