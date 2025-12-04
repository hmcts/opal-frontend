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
import { ManualOffenceReviewActions } from '../actions/manual-account-creation/offence-review.actions';
import { ManualOffenceSearchActions } from '../actions/manual-account-creation/offence-search.actions';
import { ManualPaymentTermsActions } from '../actions/manual-account-creation/payment-terms.actions';
import {
  LanguageOption,
  ManualLanguagePreferencesActions,
} from '../actions/manual-account-creation/language-preferences.actions';
import { ManualOffenceMinorCreditorActions } from '../actions/manual-account-creation/offence-minor-creditor.actions';
import { accessibilityActions } from '../actions/accessibility/accessibility.actions';
import { calculateWeeksInPast } from '../../../../support/utils/dateUtils';
import { resolveSearchFieldKey, resolveSearchResultColumn } from '../../../../support/utils/macFieldResolvers';
import { ManualOffenceDetailsLocators as L } from '../../../../shared/selectors/manual-account-creation/offence-details.locators';

export type CompanyAliasRow = { alias: string; name: string };
type LanguagePreferenceLabel = 'Document language' | 'Hearing language';
type OffenceImpositionInput = {
  imposition: number;
  resultCode?: string;
  amountImposed?: string;
  amountPaid?: string;
  creditorType?: string;
  creditorSearch?: string;
};
type MinorCreditorWithBacs = {
  title?: string;
  firstNames?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;
  accountName?: string;
  sortCode?: string;
  accountNumber?: string;
  paymentReference?: string;
};
type MinorCreditorSummary = Partial<{
  'Minor creditor': string;
  Address: string;
  'Payment method': string;
  'Account name': string;
  'Sort code': string;
  'Account number': string;
  'Payment reference': string;
}>;

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
  private readonly pathTimeout = this.common.getPathTimeout();
  private readonly courtDetails = new ManualCourtDetailsActions();
  private readonly personalDetails = new ManualPersonalDetailsActions();
  private readonly offenceDetails = new ManualOffenceDetailsActions();
  private readonly offenceReview = new ManualOffenceReviewActions();
  private readonly offenceSearch = new ManualOffenceSearchActions();
  private readonly offenceMinorCreditor = new ManualOffenceMinorCreditorActions();
  private readonly paymentTerms = new ManualPaymentTermsActions();
  private readonly languagePreferences = new ManualLanguagePreferencesActions();

  /**
   * Starts a Fine manual account and lands on the task list.
   * @param businessUnit - Business unit to select.
   * @param defendantType - Defendant type option to choose.
   */
  startFineAccount(businessUnit: string, defendantType: DefendantType): void {
    log('flow', 'Start manual fine account', { businessUnit, defendantType });
    this.ensureOnCreateAccountPage();
    this.createAccount.selectBusinessUnit(businessUnit);
    this.createAccount.selectAccountType('Fine');
    this.createAccount.selectDefendantType(defendantType);
    this.createAccount.continueToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Starts a fine manual account and opens the requested task.
   * @param businessUnit - Business unit to select.
   * @param defendantType - Defendant type option to choose.
   * @param taskName - Task to open after creation.
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
   * @param businessUnit - Business unit to reselect.
   * @param accountType - Account type to choose.
   * @param defendantType - Defendant type to choose.
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
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Opens the Language preferences change link from Account details and asserts the destination page.
   * @param label - The language row to open (Document language or Hearing language).
   */
  openLanguagePreferencesFromAccountDetails(label: LanguagePreferenceLabel): void {
    log('flow', 'Opening language preferences from Account details', { label });
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openLanguagePreference(label);
    this.languagePreferences.assertOnLanguagePreferencesPage();
  }

  /**
   * Updates language preferences while on the Language preferences page.
   * @param payload - Document and hearing language selections.
   */
  setLanguagePreferences(payload: Partial<Record<LanguagePreferenceLabel, LanguageOption>>): void {
    const document = payload['Document language'] ?? (payload as any).document;
    const hearing = payload['Hearing language'] ?? (payload as any).hearing;

    log('flow', 'Setting language preferences', { document, hearing });
    this.languagePreferences.assertOnLanguagePreferencesPage();

    if (document) {
      this.languagePreferences.selectLanguage('Documents', document);
    }

    if (hearing) {
      this.languagePreferences.selectLanguage('Court hearings', hearing);
    }
  }

  /**
   * Asserts language selections on the Language preferences page.
   * @param expectations - Expected selections for document/hearing.
   */
  assertLanguageSelections(expectations: Partial<Record<LanguagePreferenceLabel, LanguageOption>>): void {
    const document = expectations['Document language'] ?? (expectations as any).document;
    const hearing = expectations['Hearing language'] ?? (expectations as any).hearing;

    log('assert', 'Asserting language selections', { document, hearing });
    this.languagePreferences.assertOnLanguagePreferencesPage();

    if (document) {
      this.languagePreferences.assertLanguageSelected('Documents', document, true);
    }
    if (hearing) {
      this.languagePreferences.assertLanguageSelected('Court hearings', hearing, true);
    }
  }

  /**
   * Saves language preferences and asserts return to Account details.
   */
  saveLanguagePreferencesAndReturn(): void {
    log('flow', 'Saving language preferences and returning to Account details');
    this.languagePreferences.saveChanges();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Cancels language preferences with a chosen dialog response.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelLanguagePreferences(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancelling language preferences', { choice });
    this.languagePreferences.assertOnLanguagePreferencesPage();
    this.languagePreferences.cancelAndChoose(choice);
  }

  /**
   * Cancels language preferences, confirms leaving, and asserts Account details is shown.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelLanguagePreferencesAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancelling language preferences and returning to Account details', { choice });
    this.cancelLanguagePreferences(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Opens a task from account details and asserts the destination page.
   * @param taskName - Task list entry to open.
   */
  openTaskFromAccountDetails(taskName: ManualAccountTaskName): void {
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openTask(taskName);

    if (taskName === 'Company details') {
      this.companyDetails.assertOnCompanyDetailsPage();
      return;
    }

    if (taskName === 'Account comments and notes') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', 'account-comments');
      this.commentsAndNotes.assertHeader();
      return;
    }

    if (taskName === 'Contact details') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
      this.contactDetails.assertOnContactDetailsPage();
      return;
    }

    if (taskName === 'Employer details') {
      cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/employer-details');
      this.employerDetails.assertOnEmployerDetailsPage();
      return;
    }

    if (taskName === 'Court details') {
      this.courtDetails.assertOnCourtDetailsPage();
    }
  }

  /**
   * Opens the Account comments and notes task, sets values, and returns to the task list.
   * @param comment - Comment text to enter.
   * @param note - Note text to enter.
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
   * @param comment - Comment text to enter.
   * @param note - Note text to enter.
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
   * @param expectedHeader - Header text expected on the review page.
   */
  proceedToReviewFromComments(expectedHeader: string): void {
    log('flow', 'Proceed to review from comments and notes', { expectedHeader });
    this.commentsAndNotes.assertReviewAndSubmitVisible();
    this.commentsAndNotes.clickReviewAndSubmit();
    cy.location('pathname', { timeout: this.pathTimeout }).should((path) => {
      expect(path).to.match(/(check-account|review-account)/i);
    });
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Asserts both comment and note values on the Account comments and notes task.
   * @param comment - Expected comment text.
   * @param note - Expected note text.
   */
  assertAccountCommentsAndNotes(comment: string, note: string): void {
    log('flow', 'Asserting account comments and notes values', { comment, note });
    this.commentsAndNotes.assertCommentValue(comment);
    this.commentsAndNotes.assertNoteValue(note);
  }

  /**
   * Returns to Account details and asserts the requested task status.
   * @param taskName - Task to check.
   * @param expectedStatus - Expected status string.
   */
  returnToAccountDetailsAndAssertStatus(taskName: ManualAccountTaskName, expectedStatus: string): void {
    log('flow', 'Return to account details and assert task status', { taskName, expectedStatus });
    this.taskNavigation.returnToAccountDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertTaskStatus(taskName, expectedStatus);
  }

  /**
   * Provides court details by opening the task from Account details.
   * @param payload - Court details key/value map.
   */
  provideCourtDetailsFromAccountDetails(payload: Partial<Record<ManualCourtFieldKey, string>>): void {
    log('flow', 'Provide court details from Account details', { payload });
    this.openTaskFromAccountDetails('Court details');
    this.courtDetails.fillCourtDetails(payload);
  }

  /**
   * Completes Court details assuming navigation is handled by the caller.
   * @param lja - Local justice area code.
   * @param pcr - Prosecutor case reference.
   * @param enforcementCourt - Enforcement court value.
   */
  completeCourtDetails(lja: string, pcr: string, enforcementCourt: string): void {
    log('flow', 'Complete court details (navigation handled by caller)', { lja, pcr, enforcementCourt });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.fillCourtDetails({ lja, pcr, enforcementCourt });
  }

  /**
   * Provides employer details by opening the task from Account details.
   * @param payload - Employer details key/value map.
   */
  provideEmployerDetailsFromAccountDetails(payload: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Provide employer details from Account details', { payload });
    this.openTaskFromAccountDetails('Employer details');
    this.employerDetails.fillEmployerDetails(payload);
  }

  /**
   * Completes Employer details assuming navigation is handled by the caller.
   * @param payload - Employer details key/value map.
   */
  completeEmployerDetails(payload: Partial<Record<ManualEmployerFieldKey, string>>): void {
    log('flow', 'Complete employer details (navigation handled by caller)', { payload });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.fillEmployerDetails(payload);
  }

  /**
   * Asserts Employer details field values on the task.
   * @param expected - Field/value pairs to assert.
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
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelEmployerDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Employer details', { choice });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.cancelAndChoose(choice);
  }

  /**
   * Cancels Employer details and asserts return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelEmployerDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Employer details and return to Account details', { choice });
    this.cancelEmployerDetails(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates from Employer details to Offence details using the nested CTA.
   * @param expectedHeader - Header text expected on Offence details.
   */
  continueToOffenceDetailsFromEmployer(expectedHeader: string = 'Add an offence'): void {
    log('flow', 'Continue to Offence details from Employer details', { expectedHeader });
    this.employerDetails.assertOnEmployerDetailsPage();
    this.employerDetails.clickNestedFlowButton('Add offence details');
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/offence-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Asserts Court details field values on the task.
   * @param expected - Field/value pairs to assert.
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
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelCourtDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Court details', { choice });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.cancelAndChoose(choice);
  }

  /**
   * Cancels Court details and asserts return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelCourtDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Court details and return to Account details', { choice });
    this.cancelCourtDetails(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Navigates to Personal details via the Court details nested CTA.
   * @param expectedHeader - Header text expected on Personal details.
   */
  continueToPersonalDetailsFromCourt(expectedHeader: string = 'Personal details'): void {
    log('flow', 'Continue to Personal details from Court details', { expectedHeader });
    this.courtDetails.assertOnCourtDetailsPage();
    this.courtDetails.clickNestedFlowButton('Add personal details');
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/personal-details');
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * Provides personal details from the Account details task list.
   * @param payload - Personal details values to populate.
   */
  providePersonalDetailsFromAccountDetails(payload: {
    title: string;
    firstNames: string;
    lastName: string;
    addressLine1: string;
  }): void {
    log('flow', 'Provide personal details from Account details', payload);
    this.accountDetails.openTask('Personal details');
    this.personalDetails.fillBasicDetails(payload);
  }

  /**
   * Completes personal details assuming navigation is handled by the caller.
   * @param payload - Personal details values to populate.
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
   * @param payload - Offence details and imposition values.
   */
  provideOffenceDetailsFromAccountDetails(payload: {
    dateOfSentence: string;
    offenceCode: string;
    resultCode: string;
    amountImposed: string;
    amountPaid: string;
  }): void {
    log('flow', 'Provide offence details from Account details', payload);
    this.accountDetails.assertOnAccountDetailsPage();
    this.accountDetails.openTask('Offence details');
    this.offenceDetails.fillOffenceDetails(payload);
    this.offenceDetails.clickReviewOffence();
  }

  /**
   * Adds impositions (financials + creditor types) for an offence and sets offence details.
   * @param payload - Offence code, relative sentence weeks, and imposition rows.
   */
  addOffenceWithImpositions(payload: {
    offenceCode: string;
    weeksAgo: number;
    impositions: OffenceImpositionInput[];
  }): void {
    const { offenceCode, weeksAgo } = payload;
    const impositions = [...payload.impositions].sort((a, b) => a.imposition - b.imposition);
    const dateOfSentence = calculateWeeksInPast(weeksAgo);

    log('flow', 'Adding offence with impositions and creditor types', {
      offenceCode,
      weeksAgo,
      impositionCount: impositions.length,
    });

    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.setOffenceField('Offence code', offenceCode);
    this.offenceDetails.setOffenceField('Date of sentence', dateOfSentence);

    cy.wrap(impositions).each((row: OffenceImpositionInput) => {
      const index = Number(row.imposition) - 1;
      if (Number.isNaN(index) || index < 0) {
        throw new Error(`Invalid imposition index: ${row.imposition}`);
      }

      return this.ensureImpositionIndex(index).then(() => {
        if (row.resultCode) {
          this.offenceDetails.setImpositionField(index, 'Result code', row.resultCode);
        }
        if (row.amountImposed) {
          this.offenceDetails.setImpositionField(index, 'Amount imposed', row.amountImposed);
        }
        if (row.amountPaid) {
          this.offenceDetails.setImpositionField(index, 'Amount paid', row.amountPaid);
        }

        const type = (row.creditorType || '').toLowerCase();
        if (type.includes('major')) {
          this.offenceDetails.selectCreditorType(index, 'major');
          if (row.creditorSearch) {
            this.offenceDetails.setMajorCreditor(index, row.creditorSearch);
          }
        } else if (type.includes('minor')) {
          this.offenceDetails.selectCreditorType(index, 'minor');
        }
      });
    });
  }

  /**
   * Completes an Individual minor creditor with BACS details and saves.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (individual) including optional BACS.
   */
  maintainIndividualMinorCreditorWithBacs(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Maintaining individual minor creditor with BACS', { imposition, details });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Individual');

    if (details.title) {
      this.offenceMinorCreditor.selectTitle(details.title);
    }
    if (details.firstNames) {
      this.offenceMinorCreditor.setField('firstNames', details.firstNames);
    }
    if (details.lastName) {
      this.offenceMinorCreditor.setField('lastName', details.lastName);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }

    const hasBacsDetails = [
      details.accountName,
      details.sortCode,
      details.accountNumber,
      details.paymentReference,
    ].some(Boolean);
    if (hasBacsDetails) {
      this.offenceMinorCreditor.togglePayByBacs(true);
      if (details.accountName) {
        this.offenceMinorCreditor.setField('accountName', details.accountName);
      }
      if (details.sortCode) {
        this.offenceMinorCreditor.setField('sortCode', details.sortCode);
      }
      if (details.accountNumber) {
        this.offenceMinorCreditor.setField('accountNumber', details.accountNumber);
      }
      if (details.paymentReference) {
        this.offenceMinorCreditor.setField('paymentReference', details.paymentReference);
      }
    }

    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Completes a Company minor creditor with BACS details and saves.
   * @param imposition - 1-based imposition number.
   * @param details - Minor creditor payload (company) including optional BACS.
   */
  maintainCompanyMinorCreditorWithBacs(imposition: number, details: MinorCreditorWithBacs): void {
    const index = imposition - 1;
    log('flow', 'Maintaining company minor creditor with BACS', { imposition, details });
    this.offenceDetails.assertOnAddOffencePage();
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Company');

    if (details.company) {
      this.offenceMinorCreditor.setField('company', details.company);
    }
    if (details.address1) {
      this.offenceMinorCreditor.setField('address1', details.address1);
    }
    if (details.address2) {
      this.offenceMinorCreditor.setField('address2', details.address2);
    }
    if (details.address3) {
      this.offenceMinorCreditor.setField('address3', details.address3);
    }
    if (details.postcode) {
      this.offenceMinorCreditor.setField('postcode', details.postcode);
    }

    const hasBacsDetails = [
      details.accountName,
      details.sortCode,
      details.accountNumber,
      details.paymentReference,
    ].some(Boolean);
    if (hasBacsDetails) {
      this.offenceMinorCreditor.togglePayByBacs(true);
      if (details.accountName) {
        this.offenceMinorCreditor.setField('accountName', details.accountName);
      }
      if (details.sortCode) {
        this.offenceMinorCreditor.setField('sortCode', details.sortCode);
      }
      if (details.accountNumber) {
        this.offenceMinorCreditor.setField('accountNumber', details.accountNumber);
      }
      if (details.paymentReference) {
        this.offenceMinorCreditor.setField('paymentReference', details.paymentReference);
      }
    }

    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Asserts a minor creditor summary for an imposition (expands the details).
   * @param imposition - 1-based imposition number.
   * @param expectations - Expected summary values.
   */
  assertMinorCreditorSummary(imposition: number, expectations: MinorCreditorSummary): void {
    const index = imposition - 1;
    log('assert', 'Asserting minor creditor summary', { imposition, expectations });
    this.offenceDetails.toggleMinorCreditorDetails(index, 'Show details');
    this.offenceDetails.assertMinorCreditorDetails(index, expectations);
  }

  /**
   * Asserts remove imposition links visibility for a set of impositions.
   * @param impositions - Array of 1-based imposition numbers.
   * @param expectedVisible - Whether links should be visible.
   */
  assertRemoveImpositionLinks(impositions: number[], expectedVisible: boolean = true): void {
    log('assert', 'Asserting remove imposition links', { impositions, expectedVisible });
    impositions.forEach((imposition) => {
      const index = imposition - 1;
      this.offenceDetails.assertRemoveImpositionLink(index, expectedVisible);
    });
  }

  /**
   * Provides payment terms from the Account details task list.
   * @param payload - Payment terms payload including collection order and dates.
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
   * @param statuses - List of task/status pairs to assert.
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
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/contact-details');
    this.contactDetails.assertOnContactDetailsPage();
  }

  /**
   * Cancels Company details and returns to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  cancelCompanyDetailsAndReturn(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Cancel Company details and return to Account details', { choice });
    this.common.cancelEditing(true);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Continues from Contact details to Employer details.
   */
  continueToEmployerDetailsFromContact(): void {
    log('flow', 'Continue to Employer details from Contact details');
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.clickAddEmployerDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/employer-details');
    this.common.assertHeaderContains('Employer details', this.pathTimeout);
  }

  /**
   * Continues from Contact details to Offence details.
   */
  continueToOffenceDetailsFromContact(): void {
    log('flow', 'Continue to Offence details from Contact details');
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.clickAddOffenceDetails();
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/offence-details');
    this.common.assertHeaderContains('offence', this.pathTimeout);
  }

  /**
   * Cancels Contact details without navigation expectations.
   * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
   */
  cancelContactDetails(choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave'): void {
    log('flow', 'Cancel Contact details', { choice });
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.cancelAndChoose(choice);
  }

  /**
   * Confirms cancellation on Contact details and asserts return to Account details.
   * @param choice - Confirmation choice (Ok/Leave).
   */
  confirmContactDetailsCancellation(choice: 'Ok' | 'Leave'): void {
    log('flow', 'Confirm Contact details cancellation and return', { choice });
    this.contactDetails.assertOnContactDetailsPage();
    this.contactDetails.cancelAndChoose(choice);
    cy.location('pathname', { timeout: this.pathTimeout }).should('include', '/account-details');
    this.accountDetails.assertOnAccountDetailsPage();
  }

  /**
   * Populates Company details using a data table object.
   * @param data - Field/value pairs for company details.
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
   * @param aliases - Alias rows containing alias number and name.
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
   * @param aliases - Alias rows to validate.
   * @param expectedChecked - Whether the add-aliases checkbox should be checked.
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
   * @param data - Field/value pairs for company details.
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
   * Moves from the offence review page to Payment terms via CTA.
   */
  continueToPaymentTermsFromReview(): void {
    log('flow', 'Continue to payment terms from offence review');
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.clickAddPaymentTerms();
  }

  /**
   * Submits the offence search form, guarding the search page.
   */
  submitOffenceSearch(): void {
    log('flow', 'Submit offence search');
    this.offenceSearch.assertOnSearchPage();
    this.offenceSearch.submitSearch();
  }

  /**
   * Returns from the offence search results to the search form.
   */
  returnToOffenceSearchForm(): void {
    log('flow', 'Return to offence search form');
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.clickBackLink();
    this.offenceSearch.assertOnSearchPage();
  }

  /**
   * Populates offence search criteria and submits the form.
   * @param criteria - Field/value pairs keyed by field label.
   */
  searchOffences(criteria: Record<string, string>): void {
    this.offenceSearch.assertOnSearchPage();
    Object.entries(criteria).forEach(([label, value]) => {
      if (value === undefined || value === null) return;
      const trimmed = value.toString().trim();
      const field = resolveSearchFieldKey(label);
      if (trimmed === '') {
        this.offenceSearch.clearSearchField(field);
      } else {
        this.offenceSearch.setSearchField(field, trimmed);
      }
    });
    this.offenceSearch.submitSearch();
  }

  /**
   * Asserts every offence search result row contains the given values.
   * @param rows - Array of { Column, Value } expectations.
   */
  assertAllOffenceResults(rows: Array<{ Column: string; Value: string }>): void {
    this.offenceSearch.assertOnResultsPage();
    rows.forEach(({ Column, Value }) => {
      this.offenceSearch.assertAllResultsContain(resolveSearchResultColumn(Column), Value);
    });
  }

  /**
   * Asserts offence search results include rows with provided values.
   * @param rows - Array of { Column, Values[] } expectations.
   */
  assertOffenceResultsContain(rows: Array<{ Column: string; Values: string[] }>): void {
    this.offenceSearch.assertOnResultsPage();
    rows.forEach(({ Column, Values }) => {
      this.offenceSearch.assertResultsIncludeValues(resolveSearchResultColumn(Column), Values);
    });
  }

  /**
   * Enables inactive offences checkbox and runs the search (guards state).
   */
  enableInactiveOffencesAndSearch(): void {
    cy.get('body').then(($body) => {
      const onResultsPage = $body.find(L.search.resultsTable).length > 0;
      if (onResultsPage) {
        this.offenceSearch.clickBackLink();
      }
    });
    this.offenceSearch.assertOnSearchPage();
    this.offenceSearch.toggleIncludeInactive(true);
    this.offenceSearch.submitSearch();
    this.offenceSearch.assertOnResultsPage();
  }

  /**
   * Disables inactive offences and reruns the search.
   */
  resetInactiveOffencesAndSearch(): void {
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.clickBackLink();
    this.offenceSearch.assertOnSearchPage();
    this.offenceSearch.toggleIncludeInactive(false);
    this.offenceSearch.submitSearch();
    this.offenceSearch.assertOnResultsPage();
  }

  /**
   * Asserts results contain both active and inactive offences.
   */
  assertActiveAndInactiveResults(): void {
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.getResultColumnValues('Used to').then((values) => {
      expect(values.some((v) => v.includes('Present'))).to.be.true;
      expect(values.some((v) => v && !v.includes('Present'))).to.be.true;
    });
  }

  /**
   * Asserts results contain only active offences.
   */
  assertActiveOnlyResults(): void {
    this.offenceSearch.assertOnResultsPage();
    this.offenceSearch.getResultColumnValues('Used to').then((values) => {
      expect(values.length).to.be.greaterThan(0);
      expect(values.every((v) => v.includes('Present'))).to.be.true;
    });
  }

  /**
   * Runs accessibility checks on the minor creditor form for an imposition.
   * @param imposition - 1-based imposition number.
   * @param company - Company name to populate in company mode.
   */
  runMinorCreditorAccessibility(imposition: number, company: string): void {
    const index = imposition - 1;
    this.offenceDetails.openMinorCreditorDetails(index);
    this.offenceMinorCreditor.assertOnMinorCreditorPage();
    this.offenceMinorCreditor.selectCreditorType('Individual');
    accessibilityActions().checkAccessibilityOnly();

    this.offenceMinorCreditor.selectCreditorType('Company');
    this.offenceMinorCreditor.setField('company', company);
    this.offenceMinorCreditor.togglePayByBacs(true);
    accessibilityActions().checkAccessibilityOnly();
    this.offenceMinorCreditor.togglePayByBacs(false);
    this.offenceMinorCreditor.save();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Runs accessibility checks on remove minor creditor confirmation.
   * @param imposition - 1-based imposition number.
   */
  runRemoveMinorCreditorAccessibility(imposition: number): void {
    const index = imposition - 1;
    this.offenceDetails.clickMinorCreditorAction(index, 'Remove');
    this.common.assertHeaderContains('Are you sure you want to remove this minor creditor?');
    accessibilityActions().checkAccessibilityOnly();
    this.offenceDetails.cancelRemoveMinorCreditor();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Runs accessibility checks on remove imposition confirmation.
   * @param imposition - 1-based imposition number.
   */
  runRemoveImpositionAccessibility(imposition: number): void {
    const index = imposition - 1;
    this.offenceDetails.clickRemoveImposition(index);
    this.common.assertHeaderContains('Are you sure you want to remove this imposition?');
    accessibilityActions().checkAccessibilityOnly();
    this.offenceDetails.cancelRemoveImposition();
    this.offenceDetails.assertOnAddOffencePage();
  }

  /**
   * Runs accessibility checks across the offence removal flow.
   * @param offenceCode - Offence code to remove.
   */
  runOffenceRemovalAccessibility(offenceCode: string): void {
    this.offenceReview.assertOnReviewPage();
    this.offenceReview.clickRemoveOffence(offenceCode);
    this.offenceReview.assertOnRemoveOffencePage(offenceCode);
    accessibilityActions().checkAccessibilityOnly();
    this.offenceReview.confirmRemoveOffence();
    this.offenceReview.assertOnReviewPage();
    this.common.assertHeaderContains('Offences and impositions');
    accessibilityActions().checkAccessibilityOnly();
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

  /**
   * Ensures the requested imposition index exists by adding rows as needed.
   * @param index - Zero-based imposition index to guarantee.
   */
  private ensureImpositionIndex(index: number): Cypress.Chainable<number> {
    return this.offenceDetails.getImpositionCount().then((count) => {
      const needed = index - count + 1;
      if (needed > 0) {
        return cy
          .wrap(Array.from({ length: needed }))
          .each(() => this.offenceDetails.clickAddAnotherImposition())
          .then(() => this.offenceDetails.getImpositionCount());
      }
      return cy.wrap(count);
    });
  }
}
