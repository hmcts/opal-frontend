import { DashboardActions } from '../actions/dashboard.actions';
import {
  AccountType,
  DefendantType,
  ManualCreateAccountActions,
} from '../actions/manual-account-creation/create-account.actions';
import { ManualAccountDetailsActions } from '../actions/manual-account-creation/account-details.actions';
import { ManualAccountCommentsNotesActions } from '../actions/manual-account-creation/account-comments-notes.actions';
import { ManualAccountTaskName } from '../../../../shared/selectors/manual-account-creation/account-details.locators';
import { ManualAccountTaskNavigationActions } from '../actions/manual-account-creation/task-navigation.actions';
import { ManualContactDetailsActions } from '../actions/manual-account-creation/contact-details.actions';
import {
  ManualEmployerDetailsActions,
  ManualEmployerFieldKey,
} from '../actions/manual-account-creation/employer-details.actions';
import { log } from '../../../../support/utils/log.helper';
import { CommonActions } from '../actions/common/common.actions';
import { ManualCompanyDetailsActions } from '../actions/manual-account-creation/company-details.actions';
import {
  ManualCourtDetailsActions,
  ManualCourtFieldKey,
} from '../actions/manual-account-creation/court-details.actions';
import { ManualPersonalDetailsActions } from '../actions/manual-account-creation/personal-details.actions';
import { ManualOffenceDetailsActions } from '../actions/manual-account-creation/offence-details.actions';
import { ManualPaymentTermsActions } from '../actions/manual-account-creation/payment-terms.actions';

export type CompanyAliasRow = { alias: string; name: string };

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
  private readonly contactDetails = new ManualContactDetailsActions();
  private readonly employerDetails = new ManualEmployerDetailsActions();
  private readonly common = new CommonActions();
  private readonly courtDetails = new ManualCourtDetailsActions();
  private readonly personalDetails = new ManualPersonalDetailsActions();
  private readonly offenceDetails = new ManualOffenceDetailsActions();
  private readonly paymentTerms = new ManualPaymentTermsActions();

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
      return;
    }

    if (taskName === 'Contact details') {
      cy.location('pathname', { timeout: 20_000 }).should('include', '/contact-details');
      this.contactDetails.assertOnContactDetailsPage();
      return;
    }

    if (taskName === 'Employer details') {
      cy.location('pathname', { timeout: 20_000 }).should('include', '/employer-details');
      this.employerDetails.assertOnEmployerDetailsPage();
      return;
    }

    if (taskName === 'Court details') {
      this.courtDetails.assertOnCourtDetailsPage();
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
   * Opens Account comments and notes, sets values, and stays on the task.
   */
  setAccountCommentsAndNotes(comment: string, note: string): void {
    log('flow', 'Set account comments and notes on task', { comment, note });
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.setComment(comment);
    this.commentsAndNotes.setNote(note);
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

  /**
   * Asserts both comment and note values on the Account comments and notes task.
   */
  assertAccountCommentsAndNotes(comment: string, note: string): void {
    log('flow', 'Asserting account comments and notes values', { comment, note });
    this.commentsAndNotes.assertCommentValue(comment);
    this.commentsAndNotes.assertNoteValue(note);
  }

  /**
   * Returns to Account details and asserts the requested task status.
   */
  returnToAccountDetailsAndAssertStatus(taskName: ManualAccountTaskName, expectedStatus: string): void {
    log('flow', 'Return to account details and assert task status', { taskName, expectedStatus });
    this.taskNavigation.returnToAccountDetails();
    cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
    this.accountDetails.assertTaskStatus(taskName, expectedStatus);
  }

  /**
   * Provides court details by opening the task from Account details.
   */
  provideCourtDetailsFromAccountDetails(payload: Partial<Record<ManualCourtFieldKey, string>>): void {
    log('flow', 'Provide court details from Account details', { payload });
    this.openTaskFromAccountDetails('Court details');
    this.courtDetails.fillCourtDetails(payload);
  }

  /**
   * Completes Court details assuming navigation is handled by the caller.
   */
  completeCourtDetails(lja: string, pcr: string, enforcementCourt: string): void {
    log('flow', 'Complete court details (navigation handled by caller)', { lja, pcr, enforcementCourt });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.fillCourtDetails({ lja, pcr, enforcementCourt });
  }

  /**
   * Provides employer details by opening the task from Account details.
   */
  provideEmployerDetailsFromAccountDetails(payload: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Provide employer details from Account details', { payload });
    this.openTaskFromAccountDetails('Employer details');
    this.employerDetails.fillEmployerDetails(payload);
  }

  /**
   * Completes Employer details assuming navigation is handled by the caller.
   */
  completeEmployerDetails(payload: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Complete employer details (navigation handled by caller)', { payload });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.fillEmployerDetails(payload);
  }

  /**
   * Asserts Employer details field values on the task.
   */
  assertEmployerDetailsFields(expected: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Asserting Employer details field values', { expected });
    this.employerDetails.assertOnEmployerDetailsPage();
    Object.entries(expected).forEach(([field, value]) => {
      this.employerDetails.assertFieldValue(field as ManualEmployerFieldKey, value as string);
    });
  }

  /**
   * Cancels out of Employer details with a given choice.
   */
  cancelEmployerDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Employer details', { choice });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.cancelAndChoose(choice);
  }

  /**
   * Cancels Employer details and asserts return to Account details.
   */
  cancelEmployerDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Employer details and return to Account details', { choice });
    this.cancelEmployerDetails(choice);
    cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates from Employer details to Offence details using the nested CTA.
   */
  continueToOffenceDetailsFromEmployer(expectedHeader: string = 'Add an offence'): void {
    log('flow', 'Continue to Offence details from Employer details', { expectedHeader });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.clickNestedFlowButton('Add offence details');
    cy.location('pathname', { timeout: 20_000 }).should('include', '/offence-details');
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  /**
   * Asserts Court details field values on the task.
   */
  assertCourtDetailsFields(expected: Partial<Record<ManualCourtFieldKey, string>>): void {
    log('flow', 'Asserting Court details field values', { expected });
    this.courtDetails.assertOnCourtDetailsPage();

    if (expected.lja !== undefined) {
      this.courtDetails.assertFieldValue('lja', expected.lja);
    }
    if (expected.pcr !== undefined) {
      this.courtDetails.assertFieldValue('pcr', expected.pcr);
    }
    if (expected.enforcementCourt !== undefined) {
      this.courtDetails.assertFieldValue('enforcementCourt', expected.enforcementCourt);
    }
  }

  /**
   * Cancels out of Court details with a given choice.
   */
  cancelCourtDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Court details', { choice });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.cancelAndChoose(choice);
  }

  /**
   * Cancels Court details and asserts return to Account details.
   */
  cancelCourtDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Court details and return to Account details', { choice });
    this.cancelCourtDetails(choice);
    cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates to Personal details via the Court details nested CTA.
   */
  continueToPersonalDetailsFromCourt(expectedHeader: string = 'Personal details'): void {
    log('flow', 'Continue to Personal details from Court details', { expectedHeader });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.clickNestedFlowButton('Add personal details');
    cy.location('pathname', { timeout: 20_000 }).should('include', '/personal-details');
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  /**
   * Provides personal details from the Account details task list.
   */
  providePersonalDetailsFromAccountDetails(payload: {
    title: string;
    firstNames: string;
    lastName: string;
    addressLine1: string;
  }): void {
    log('flow', 'Provide personal details from Account details', payload);
    this.taskNavigation.navigateToAccountDetails();
    this.accountDetails.openTask('Personal details');
    this.personalDetails.fillBasicDetails(payload);
  }

  /**
   * Completes personal details assuming navigation is handled by the caller.
   */
  completePersonalDetails(payload: {
    title: string;
    firstNames: string;
    lastName: string;
    addressLine1: string;
  }): void {
    log('flow', 'Complete personal details (navigation handled by caller)', payload);
    this.accountDetails.assertOnAccountDetailsPage();
    this.personalDetails.fillBasicDetails(payload);
  }

  /**
   * Provides offence details from Account details and submits for review.
   */
  provideOffenceDetailsFromAccountDetails(payload: {
    dateOfSentence: string;
    offenceCode: string;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
  }): void {
    log('flow', 'Provide offence details from Account details', payload);
    this.taskNavigation.navigateToAccountDetails();
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openTask('Offence details');
    this.offenceDetails.fillOffenceDetails(payload);
    this.offenceDetails.clickReviewOffence();
  }

  /**
   * Provides payment terms from the Account details task list.
   */
  providePaymentTermsFromAccountDetails(payload: {
    collectionOrder: 'Yes' | 'No';
    collectionOrderWeeksInPast: number;
    payByWeeksInFuture: number;
  }): void {
    log('flow', 'Provide payment terms from Account details', payload);
    this.taskNavigation.navigateToAccountDetails();
    this.accountDetails.openTask('Payment terms');
    this.paymentTerms.completePayInFullWithCollectionOrder(payload);
  }

  /**
   * Asserts multiple task statuses after returning to Account details.
   */
  assertTaskStatuses(statuses: Array<{ task: ManualAccountTaskName; status: string }>): void {
    log('flow', 'Asserting multiple task statuses', { statuses });
    this.taskNavigation.navigateToAccountDetails();
    statuses.forEach(({ task, status }) => this.accountDetails.assertTaskStatus(task, status));
  }

  /**
   * Opens Account comments and notes and asserts the header.
   */
  openAccountCommentsAndNotesTask(): void {
    log('flow', 'Open Account comments and notes task');
    this.accountDetails.openTask('Account comments and notes');
    this.commentsAndNotes.assertHeader();
  }

  /**
   * Navigates from Company details to Contact details.
   */
  continueToContactDetailsFromCompany(): void {
    log('flow', 'Continue to contact details from Company details');
    this.companyDetails.clickAddContactDetails();
    cy.location('pathname', { timeout: 20_000 }).should('include', '/contact-details');
    this.contactDetails.assertOnContactDetailsPage();
  }

  /**
   * Cancels Company details and returns to Account details.
   */
  cancelCompanyDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Company details and return to Account details', { choice });
    this.common.cancelEditing(true);
    cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Continues from Contact details to Employer details.
   */
  continueToEmployerDetailsFromContact(): void {
    log('flow', 'Continue to Employer details from Contact details');
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.clickAddEmployerDetails();
    cy.location('pathname', { timeout: 20_000 }).should('include', '/employer-details');
    this.common.assertHeaderContains('Employer details', 20_000);
  }

  /**
   * Continues from Contact details to Offence details.
   */
  continueToOffenceDetailsFromContact(): void {
    log('flow', 'Continue to Offence details from Contact details');
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.clickAddOffenceDetails();
    cy.location('pathname', { timeout: 20_000 }).should('include', '/offence-details');
    this.common.assertHeaderContains('offence', 20_000);
  }

  /**
   * Cancels Contact details without navigation expectations.
   */
  cancelContactDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Contact details', { choice });
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.cancelAndChoose(choice);
  }

  /**
   * Confirms cancellation on Contact details and asserts return to Account details.
   */
  confirmContactDetailsCancellation(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Confirm Contact details cancellation and return', { choice });
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.cancelAndChoose(choice);
    cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Populates Company details using a data table object.
   */
  fillCompanyDetailsFromTable(data: Record<string, string>): void {
    log('flow', 'Filling Company details from table data', data);
    if (data['company name'] !== undefined) {
      this.companyDetails.setCompanyName(data['company name']);
    }
    if (data['address line 1'] !== undefined) {
      this.companyDetails.setAddressLine1(data['address line 1']);
    }
    if (data['address line 2'] !== undefined) {
      this.companyDetails.setAddressLine2(data['address line 2']);
    }
    if (data['address line 3'] !== undefined) {
      this.companyDetails.setAddressLine3(data['address line 3']);
    }
    if (data['postcode'] !== undefined) {
      this.companyDetails.setPostcode(data['postcode']);
    }
  }

  /**
   * Adds company aliases and toggles the checkbox on.
   */
  addCompanyAliases(aliases: CompanyAliasRow[]): void {
    log('flow', 'Adding company aliases', { aliases });
    this.companyDetails.toggleAddAliases(true);
    aliases.forEach((row, index) => {
      const aliasNumber = Number(row.alias);
      const aliasName = row.name;
      if (!Number.isFinite(aliasNumber)) {
        throw new Error(`Alias index must be numeric. Received: ${row.alias}`);
      }
      if (index > 0) {
        this.companyDetails.addAnotherAlias();
      }
      this.companyDetails.setAliasCompanyName(aliasNumber, aliasName);
    });
  }

  /**
   * Asserts company aliases and checkbox state.
   */
  assertCompanyAliases(aliases: CompanyAliasRow[], expectedChecked: boolean = true): void {
    log('flow', 'Asserting company aliases', { aliases, expectedChecked });
    this.companyDetails.assertAddAliasesChecked(expectedChecked);
    aliases.forEach((row) => {
      const aliasNumber = Number(row.alias);
      const aliasName = row.name;
      if (!Number.isFinite(aliasNumber)) {
        throw new Error(`Alias index must be numeric. Received: ${row.alias}`);
      }
      this.companyDetails.assertAliasCompanyName(aliasNumber, aliasName);
    });
  }

  /**
   * Asserts Company detail field values using table data.
   */
  assertCompanyDetailsFields(data: Record<string, string>): void {
    log('flow', 'Asserting Company details fields', data);
    if (data['company name'] !== undefined) {
      this.companyDetails.assertFieldValue('company', data['company name']);
    }
    if (data['address line 1'] !== undefined) {
      this.companyDetails.assertFieldValue('address1', data['address line 1']);
    }
    if (data['address line 2'] !== undefined) {
      this.companyDetails.assertFieldValue('address2', data['address line 2']);
    }
    if (data['address line 3'] !== undefined) {
      this.companyDetails.assertFieldValue('address3', data['address line 3']);
    }
    if (data['postcode'] !== undefined) {
      this.companyDetails.assertFieldValue('postcode', data['postcode']);
    }
  }

  /**
   * Ensures the Manual Account Creation start page is loaded from the dashboard.
   *
   * @remarks
   * - Clicks the dashboard link to Manual Account Creation.
   * - Asserts the create account header is visible.
   * - Use before selecting business unit/account/defendant type.
   */
  private ensureOnCreateAccountPage(): void {
    this.dashboard.goToManualAccountCreation();
    this.createAccount.assertOnCreateAccountPage();
  }
}
