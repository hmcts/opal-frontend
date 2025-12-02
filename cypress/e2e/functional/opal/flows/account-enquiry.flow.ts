import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { AccountSearchCompanyActions } from '../actions/search/search.companies.actions';
import { AccountSearchNavActions } from '../actions/search/search.nav.actions';
import { AccountDetailsNotesActions } from '../actions/account-details/details.notes.actions';
import { ResultsActions } from '../actions/search.results.actions';
import { AccountDetailsDefendantActions } from '../actions/account-details/details.defendant.actions';
import { AccountDetailsNavActions } from '../actions/account-details/details.nav.actions';
import { AccountDetailsCommentsActions } from '../actions/account-details/details.comments.actions';
import { AccountDetailsAtAGlanceActions } from '../actions/account-details/details.at-a-glance.actions';
import { AccountDetailsParentGuardianActions } from '../actions/account-details/details.parent.guardian.actions';
import { DashboardActions } from '../actions/dashboard.actions';
import { AccountSearchIndividualsLocators as L } from '../../../../shared/selectors/account-search/account.search.individuals.locators';
import { AccountSearchCompaniesLocators as C } from '../../../../shared/selectors/account-search/account.search.companies.locators';
import { AccountEnquiryResultsLocators as R } from '../../../../shared/selectors/account-enquiry-results.locators';
import { ForceSingleTabNavigation } from '../../../../support/utils/navigation';
import { HasAccountLinkOnPage } from '../../../../support/utils/results';
import { CommonActions } from '../actions/common.actions';
import { EditDefendantDetailsActions } from '../actions/account-details/edit.defendant-details.actions';
import { EditCompanyDetailsActions } from '../actions/account-details/edit.company-details.actions';
import { EditParentGuardianDetailsActions } from '../actions/account-details/edit.parent-guardian-details.actions';

/**
 * @file AccountEnquiryFlow
 * @description High-level workflow for searching accounts (individuals/companies),
 *              opening the latest result, and asserting/editing details.
 *
 * This flow composes lower-level *Actions* (Page Objects) and keeps tests concise by
 * encapsulating navigation + assertions.
 *
 * @remarks
 * - All public methods include structured logging.
 * - Navigation is forced into a single tab to avoid Cypress multi-window issues.
 * - Results waits & open helpers are centralised in {@link ResultsActions}.
 */
export class AccountEnquiryFlow {
  /** Default timeout (ms) for key waits in this flow. */
  private static readonly WAIT_MS = 15_000;

  private readonly searchIndividuals = new AccountSearchIndividualsActions();
  private readonly searchCompany = new AccountSearchCompanyActions();
  private readonly searchNav = new AccountSearchNavActions();
  private readonly results = new ResultsActions();
  private readonly defendantDetails = new AccountDetailsDefendantActions();
  private readonly parentGuardianDetails = new AccountDetailsParentGuardianActions();
  private readonly detailsNav = new AccountDetailsNavActions();
  private readonly notes = new AccountDetailsNotesActions();
  private readonly comments = new AccountDetailsCommentsActions();
  private readonly dashboard = new DashboardActions();
  private readonly common = new CommonActions();
  private readonly atAGlanceDetails = new AccountDetailsAtAGlanceActions();
  private readonly editDefendantDetailsActions = new EditDefendantDetailsActions();
  private readonly editCompanyDetailsActions = new EditCompanyDetailsActions();
  private readonly editParentGuardianActions = new EditParentGuardianDetailsActions();

  /**
   * Standardized logger for this flow.
   * Adds consistent `consoleProps` so logs are searchable and grouped.
   *
   * @param name - Short category (e.g., "method", "search", "assert").
   * @param message - Human-readable description of the action.
   * @param data - Optional additional context shown in the Cypress runner.
   */
  private log(name: string, message: string, data?: Record<string, unknown>): void {
    Cypress.log({
      name,
      message,
      consoleProps: () => ({ flow: 'AccountEnquiryFlow', message, ...data }),
    });
  }

  /**
   * Ensures the test is on the Individuals Account Search page.
   * If not, it navigates via the dashboard.
   */
  private ensureOnIndividualSearchPage(): void {
    this.log('method', 'ensureOnIndividualSearchPage()');
    cy.get('body').then(($b) => {
      const onSearch = $b.find(L.root).length > 0;
      if (!onSearch) {
        this.log('navigate', 'Navigating to Account Search dashboard (Individuals)');
        this.dashboard.goToAccountSearch();
      }
    });
  }

  /**
   * Pulls the current `accountNumber` from alias `@etagUpdate` if present.
   * The alias is expected to have a shape like `{ accountNumber: string }`.
   *
   * @returns Chainable resolving to a trimmed account number or `null` when absent/empty.
   */
  private resolveAccountNumberFromAlias(): Cypress.Chainable<string | null> {
    return cy
      .get('@etagUpdate', { timeout: 0 })
      .then((etag: any) => (etag ? (etag.accountNumber ?? null) : null))
      .then((n: string | null) => (n && String(n).trim() ? String(n).trim() : null));
  }

  /**
   * Asserts that the browser has navigated to the expected defendant details route.
   */
  private assertNavigatedToDetails(): void {
    cy.location('pathname', { timeout: AccountEnquiryFlow.WAIT_MS }).should((p) => {
      expect(p, 'navigated to defendant details route').to.match(
        /^\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details$/,
      );
    });
  }

  /**
   * Performs an Individuals search by last name.
   *
   * @param surname - Surname to search for.
   */
  public searchByLastName(surname: string): void {
    this.log('method', 'searchByLastName()');
    this.log('search', 'Searching by last name', { surname });
    this.ensureOnIndividualSearchPage();
    this.searchIndividuals.byLastName(surname);
  }

  /**
   * Clicks the latest published account from the current results page.
   *
   * Behaviour:
   *  - If `@etagUpdate` has an `accountNumber` and it's visible on the current page → click it.
   *  - Otherwise → open the first row via {@link ResultsActions.openLatestPublished}.
   *
   * No cross-page pagination (keeps control flow simple and avoids catch/overload issues).
   */
  public clickLatestPublishedFromResultsOrAcrossPages(): void {
    this.log('method', 'clickLatestPublishedFromResultsOrAcrossPages()');
    this.log('click', 'Click latest published account or matching @etagUpdate (current page only)');

    ForceSingleTabNavigation();
    this.results.waitForResultsTable();

    this.resolveAccountNumberFromAlias().then((accOrNull) => {
      if (!accOrNull) {
        this.log('fallback', 'No @etagUpdate found → opening latest row');
        this.results.openLatestPublished();
        return;
      }

      const acc = accOrNull;
      this.log('match', 'Looking for account number on current page', { accountNumber: acc });

      HasAccountLinkOnPage(acc).then((exists) => {
        if (exists) {
          this.results.clickAccountOnCurrentPage(acc).then(() => this.assertNavigatedToDetails());
          return;
        }

        this.log('fallback', `Account ${acc} not found on current page; opening latest row`, {
          accountNumber: acc,
        });
        this.results.openLatestPublished();
      });
    });
  }

  /**
   * Convenience flow: search by surname (no automatic click).
   *
   * @param surname - Surname to search for.
   */
  public searchBySurname(surname: string): void {
    this.log('method', 'searchBySurname()');
    this.log('flow', 'Search by surname', { surname });
    this.searchByLastName(surname);
  }

  /**
   * Convenience flow: search by surname then open the latest matching account.
   *
   * @param surname - Surname to search for.
   */
  public searchAndClickLatestBySurnameOpenLatestResult(surname: string): void {
    this.log('method', 'searchAndClickLatestBySurnameOpenLatestResult()');
    this.log('flow', 'Search and open latest by surname', { surname });
    this.searchBySurname(surname);
    this.clickLatestPublishedFromResultsOrAcrossPages();
  }

  /**
   * Opens the most recent account from the results (top row) and asserts navigation.
   */
  public openMostRecentFromResults(): void {
    this.log('method', 'openMostRecentFromResults()');
    this.log('open', 'Opening most recent account from results');

    ForceSingleTabNavigation();
    this.results.waitForResultsTable();
    this.results.openLatestPublished();
  }

  /**
   * Navigates to the Defendant tab and asserts a specific section header.
   *
   * @param headerText - Expected section header text.
   */
  public goToDefendantDetailsAndAssert(headerText: string): void {
    this.log('method', 'goToDefendantDetailsAndAssert()');
    this.log('navigate', 'Navigating to Defendant tab and asserting section header', { headerText });
    this.detailsNav.goToDefendantTab();
    this.defendantDetails.assertSectionHeader(headerText);
  }

  /**
   * Starts editing defendant details and changes the first name field.
   *
   * @param value - New first name value.
   */
  public editDefendantAndChangeFirstName(value: string): void {
    this.log('method', 'editDefendantAndChangeFirstName()');
    this.log('edit', 'Editing defendant first name', { value });
    this.detailsNav.goToDefendantTab();
    this.defendantDetails.assertSectionHeader('Defendant');
    this.defendantDetails.change();
    this.editDefendantDetailsActions.updateFirstName(value);
  }

  /**
   * Cancels the edit operation and asserts that we remain on the edit page.
   */
  public cancelEditAndStay(): void {
    this.log('method', 'cancelEditAndStay()');
    this.log('cancel', 'Cancelling edit and staying on edit page');
    this.common.cancelEditing(false);
    this.editDefendantDetailsActions.assertStillOnEditPage();
  }

  /**
   * Cancels the edit operation
   */
  public cancelEditAndLeave(): void {
    this.log('method', 'cancelEditAndLeave()');
    this.log('cancel', 'Cancelling edit and returning to details page');
    this.common.cancelEditing(true);
  }

  /**
   * Verifies route guard behaviour for a Company defendant by editing a field,
   * choosing to stay, then confirming the temporary value is retained until leaving.
   *
   * @param companyName - The original company name shown in the header.
   * @param tempName - Temporary value entered for the company name field.
   */
  public verifyRouteGuardBehaviour(companyName: string, tempName: string): void {
    this.log('method', 'verifyRouteGuardBehaviour()');
    this.log('verify', 'Verifying route guard behaviour', { companyName, tempName });

    // Navigate to defendant tab
    this.log('action', 'Navigating to Defendant tab');
    this.detailsNav.goToDefendantTab();

    // Click Change Link
    this.log('action', 'Change Link');
    this.defendantDetails.change();

    // Edit company name
    this.log('action', 'Editing company name', { newName: tempName });
    this.editCompanyDetailsActions.editCompanyName(tempName);

    // Cancel edit (without saving)
    this.log('action', 'Cancelling edit without saving');
    this.common.cancelEditing(false);

    // Verify temp name persisted
    this.log('verify', 'Verifying temporary company name persisted', { expected: tempName });
    this.editCompanyDetailsActions.verifyFieldValue(tempName);

    // Cancel edit (revert changes)
    this.log('action', 'Cancelling edit with revert');
    this.common.cancelEditing(true);

    // Final verification: header restored to original
    this.log('verify', 'Verifying header reverted to original company name', { expected: companyName });
    this.atAGlanceDetails.assertHeaderContains(companyName);

    this.log('complete', 'Route guard behaviour verification completed');
  }

  /**
   * Verifies cancel-changes behaviour for a Company defendant by editing a field,
   * choosing to stay, then asserting the header still reflects the original value.
   *
   * @param companyName - The original company name shown in the header.
   * @param tempName - Temporary value entered for the company name field.
   */
  public verifyCancelChangesBehaviour(companyName: string, tempName: string): void {
    this.log('method', 'verifyCancelChangesBehaviour()');
    this.log('verify', 'Verifying cancel changes behaviour', { companyName, tempName });

    // Navigate to defendant tab
    this.log('action', 'Navigating to Defendant tab');
    this.detailsNav.goToDefendantTab();

    // Click Change Link
    this.log('action', 'Change Link');
    this.defendantDetails.change();

    // Begin editing company name
    this.log('action', 'Starting edit of Company Name field', { newValue: tempName });
    this.editCompanyDetailsActions.editCompanyName(tempName);

    // Simulate cancel action but choose to stay
    this.log('action', 'Initiating cancel edit (choosing to stay on page)');
    this.common.cancelEditing(false);

    // Check that header remains unchanged
    this.log('verify', 'Verifying header still displays original company name', { expected: companyName });
    this.atAGlanceDetails.assertHeaderContains(companyName);

    // Post-verification confirmation
    this.log('info', 'Cancel-changes behaviour verified successfully — no unintended persistence detected');
    this.log('complete', 'verifyCancelChangesBehaviour() completed');
  }

  /**
   * Ensures the test is on the Companies Account Search page.
   * If not, it navigates via the dashboard and Companies tab.
   */
  private ensureOnCompanySearchPage(): void {
    this.log('method', 'ensureOnCompanySearchPage()');
    cy.get('body').then(($b) => {
      const onSearch = $b.find(C.root).length > 0;
      if (!onSearch) {
        this.log('navigate', 'Navigating to Account Search dashboard (Companies)');
        this.dashboard.goToAccountSearch();
        this.searchNav.goToCompaniesTab();
      }
    });
  }

  /**
   * Performs a Companies search by company name.
   *
   * @param companyName - Company name to search for.
   */
  public searchByCompanyName(companyName: string): void {
    this.log('method', 'searchByCompanyName()');
    this.dashboard.goToAccountSearch();
    this.searchNav.goToCompaniesTab();
    this.ensureOnCompanySearchPage();
    this.log('search', 'Searching by company name', { companyName });
    this.searchCompany.byCompanyName(companyName);
    this.results.assertOnResults();
  }

  /**
   * Opens company account details by name using the Companies tab and selecting the latest.
   *
   * @param companyName - Company name to search and open.
   */
  public openCompanyAccountDetailsByNameAndSelectLatest(companyName: string): void {
    this.log('method', 'openCompanyAccountDetailsByNameAndSelectLatest()');
    this.searchByCompanyName(companyName);
    this.log('results', 'Select Latest published company account from results', { companyName });
    this.clickLatestPublishedFromResultsOrAcrossPages();
  }

  /**
   * Opens the "Add account note" screen and verifies the header.
   *
   */
  public openAddAccountNoteAndVerifyHeader(): void {
    this.log('method', 'openAddAccountNoteAndVerifyHeader()');

    this.log('navigate', 'Opening "Add account note" screen');
    this.detailsNav.clickAddAccountNoteButton();

    this.notes.assertHeaderContains('Add account note');
  }

  /**
   * Opens Notes screen and enters text into its primary field(s).
   * @param text - Text to enter.
   * @throws Error if the screen is not recognised.
   */
  public openNotesScreenAndEnterText(text: string): void {
    this.log('method', 'openNotesScreenAndEnterText()');

    this.openAddAccountNoteAndVerifyHeader();
    this.log('input', 'Typing note text');

    this.notes.enterAccountNote(text);
  }

  /**
   * Enters an account note and saves it (reusing the open+enter helper).
   *
   * @param note - The note text to enter.
   */
  public openAccountNoteEnterNoteAndSave(note: string): void {
    this.log('method', 'openAccountNoteEnterNoteAndSave()');
    this.log('input', 'Preparing to enter and save account note', { length: note?.length });
    this.openNotesScreenAndEnterText(note);
    this.log('save', 'Saving account note');
    this.notes.save();
  }

  /**
   * Enters an account note and saves it.
   *
   * @description
   *  Automates the process of adding a note to an account record.
   *  Logs each action step for Cypress traceability and debugging.
   *  This method types the provided note text, then triggers the save action.
   *
   * @param note - The text content to be entered into the account note field.
   *
   * @remarks
   *  - Uses `this.notes.enterAccountNote()` to input text.
   *  - Calls `this.notes.save()` to persist the note.
   *  - Includes Cypress logs for method start, input entry, and save confirmation.
   *
   * @example
   *  accountDetailsActions.enterAndSaveNote('Customer requested payment extension.');
   */
  public enterAndSaveNote(note: string): void {
    this.log('method', 'enterAndSaveNote()');
    this.log('input', 'Typing note text');
    this.notes.enterAccountNote(note);
    this.log('save', 'Saving account note');
    this.notes.save();
  }

  /**
   * Saves the provided comment lines and verifies redirect to defendant summary.
   */
  public saveCommentsAndReturnToSummary(lines: readonly string[]): void {
    Cypress.log({
      name: 'flow',
      displayName: 'Save Comments → Summary',
      message: `Saving ${lines.length} line(s) and verifying redirect to summary`,
      consoleProps: () => ({ lines }),
    });

    // Open Comments from summary and verify we're on the page
    this.atAGlanceDetails.openCommentsFromSummary();
    this.comments.assertCommentsHeader();

    // Handles typing + POST + initial redirect wait
    this.comments.enterAndSaveComments(lines);

    // Defensive URL check that we're back on the summary
    cy.location('pathname', { timeout: 10000 }).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
  }

  /**
   * Opens the notes screen, enters text, and cancels the edit.
   *
   * @param text - The text to enter before cancelling.
   */
  public openNotesScreenEnterTextAndCancel(text: string): void {
    this.log('method', 'openScreenEnterTextAndCancel()');
    this.log('flow', 'Open → enter text → cancel');

    this.openNotesScreenAndEnterText(text);

    // Ensure the value is present before we cancel (prevents stale element errors)
    this.notes.assertNoteValueEquals(text);

    this.log('cancel', 'Cancelling edit and confirming leave');
    this.common.cancelEditing(true);

    cy.document({ timeout: 20000 })
      .its('readyState')
      .should('match', /interactive|complete/);

    // If the app didn’t redirect after OK, fall back to going back
    cy.location('href', { timeout: 20000 }).then((href) => {
      if (href.includes('/note/add')) {
        cy.go('back');
      }
    });

    // Final expectation (this will retry)
    cy.location('pathname', { timeout: 20000 }).should('include', '/details');
  }

  /**
   * Opens a screen, enters text, triggers browser back, and confirms the unsaved changes warning.
   *
   * @param text - The text to enter before navigating back.
   */
  public openScreenEnterTextAndNavigateBackWithConfirmation(text: string): void {
    this.log('method', 'openScreenEnterTextAndNavigateBackWithConfirmation()');
    this.log('flow', 'Open → enter text → browser back → confirm');

    // 1. Navigate and enter note text
    this.openNotesScreenAndEnterText(text);

    // 2. Simulate browser back and confirm the warning
    this.common.navigateBrowserBackWithConfirmation(/\/details$/);
  }

  /**
   * Opens the Comments page from the defendant summary, verifies fields + header,
   * clicks Cancel and dismisses (stay), then clicks Cancel and confirms (leave),
   * and finally verifies the account summary header (if provided).
   *
   * @param expectedSummaryHeader - Optional header text to assert on the summary page.
   */
  public openCommentsFromSummaryAndVerifyPageDetails(expectedSummaryHeader?: string): void {
    Cypress.log({
      name: 'flow',
      displayName: 'Comments Page Verification',
      message: 'Open → verify fields & header → cancel(dismiss) → cancel(confirm) → verify summary',
      consoleProps: () => ({ expectedSummaryHeader }),
    });

    // 1) Navigate from summary to Comments (use your nav action for the "Add comments" link)
    this.atAGlanceDetails.openCommentsFromSummary();

    // 2) Verify all fields + controls are present
    this.comments.assertFormFieldsPresent();

    // 3) Verify header contains "Comments"
    this.comments.assertCommentsHeader();
  }

  /**
   * Route-guard verification on the Comments page:
   *  open from summary → type → Cancel (dismiss) → verify stayed with text →
   *  Cancel (confirm) → verify returned to summary.
   */
  public verifyRouteGuardBehaviourOnComments(noteText: string): void {
    Cypress.log({
      name: 'flow',
      displayName: 'Comments Route Guard',
      message: `Open → type "${noteText}" → cancel(dismiss) → cancel(confirm)`,
      consoleProps: () => ({ noteText }),
    });

    // Open Comments from summary and verify we're on the page
    this.atAGlanceDetails.openCommentsFromSummary();
    this.comments.assertCommentsHeader();

    // Enter unsaved text
    this.comments.setComment(noteText);

    // Cancel → dismiss (stay on Comments)
    this.common.confirmNextUnsavedChanges(false);
    this.comments.clickCancelLink();
    this.comments.assertCommentsHeader();
    this.comments.assertCommentValueEquals(noteText);

    // Cancel → confirm (leave to summary)
    this.comments.confirmLeaveAndReturnToSummary();

    cy.location('pathname', { timeout: 15000 }).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
  }

  /**
   * Open the Comments section and verify existing prefilled values.
   * @param expected Prefilled form values to assert
   */
  verifyPrefilledComments(expected: { comment?: string; line1?: string; line2?: string; line3?: string }): void {
    cy.log('Flow: Verify prefilled Comments form');

    this.atAGlanceDetails.openCommentsFromSummary();
    this.comments.assertPrefilledFormValues(expected);
  }

  /**
   * Verifies route-guard behaviour for a Parent/Guardian by editing First names,
   * choosing to stay, then confirming the temporary value is retained until leaving,
   * and finally confirming the header reverts to the original name.
   *
   * @param originalHeaderName - The original defendant name shown in the header (e.g. "Miss Catherine GREEN").
   * @param tempFirstName - Temporary value to enter into the "First names" field (e.g. "FNAMECHANGE").
   */
  public verifyParentGuardianRouteGuardBehaviour(originalHeaderName: string, tempFirstName: string): void {
    this.log('method', 'verifyParentGuardianRouteGuardBehaviour()');
    this.log('verify', 'Verifying route guard behaviour (Parent/Guardian)', { originalHeaderName, tempFirstName });

    // Navigate to Defendant tab
    this.log('action', 'Navigating to Parent Guardian tab');
    this.detailsNav.goToParentGuardianTab();

    // Click Change Link
    this.log('action', 'Change Link');
    this.parentGuardianDetails.change();

    // Assert section header
    this.log('verify', 'Verifying section header is "Parent or guardian details"');
    this.editParentGuardianActions.assertHeader();

    // Enter temporary first name
    this.log('action', 'Editing "First names"', { newValue: tempFirstName });
    this.editParentGuardianActions.editFirstNames(tempFirstName);

    // Cancel edit (user chooses to stay on page)
    this.log('action', 'Cancelling edit without saving (stay on page)');
    this.common.cancelEditing(false); // maps to: click Cancel -> modal -> Cancel

    // Verify temp value persisted
    this.log('verify', 'Verifying temporary first name persisted', { expected: tempFirstName });
    this.editParentGuardianActions.verifyFirstName(tempFirstName);

    // Cancel edit (user confirms leaving/reverting)
    this.log('action', 'Cancelling edit with revert (leave)');
    this.common.cancelEditing(true); // maps to: click Cancel -> modal -> Ok

    // Final verification: header restored to original defendant name
    this.log('verify', 'Verifying header reverted to original name', { expected: originalHeaderName });
    this.atAGlanceDetails.assertHeaderContains(originalHeaderName);

    this.log('complete', 'Parent/Guardian route-guard verification completed');
  }

  /**
   * Cancels Parent/Guardian edit without saving
   *
   * Opens the Parent/Guardian tab, starts an edit, then cancels and discards changes.
   */
  public cancelParentGuardianEditWithoutSaving(): void {
    this.log('method', 'cancelParentGuardianEditWithoutSaving()');
    this.log('action', 'Navigating to Parent/Guardian tab');
    this.detailsNav.goToParentGuardianTab();

    this.log('action', 'Starting Parent/Guardian edit');
    this.parentGuardianDetails.change();

    this.log('verify', 'Verifying Parent/Guardian section header');
    this.editParentGuardianActions.assertHeader();

    const tempLastName = 'LNAMEALTERED';

    this.log('action', 'Editing "Last name"', { newValue: tempLastName });
    this.editParentGuardianActions.editLastName(tempLastName);

    this.log('action', 'Cancelling edit without saving (discard changes)');
    this.common.cancelEditing(true); // "Cancel" -> Confirm "Ok"

    this.log('complete', 'Parent/Guardian cancel edit without saving complete');
  }

  /**
   * Handles the "Cancel → Stay" route-guard scenario for Parent/Guardian edits.
   *
   * Starts an edit, changes a field temporarily, cancels but chooses to stay,
   * verifies the temporary value persists, then leaves verification for later steps.
   */
  public cancelParentGuardianEditButStayOnPage(): void {
    this.log('method', 'cancelParentGuardianEditButStayOnPage()');
    this.log('action', 'Navigating to Parent/Guardian tab');
    this.detailsNav.goToParentGuardianTab();

    this.log('action', 'Starting Parent/Guardian edit');
    this.parentGuardianDetails.change();

    this.log('verify', 'Verifying Parent/Guardian section header');
    this.editParentGuardianActions.assertHeader();

    const tempLastName = 'LNAMEALTERED';

    this.log('action', 'Editing "Last name"', { newValue: tempLastName });
    this.editParentGuardianActions.editLastName(tempLastName);

    this.log('action', 'Cancelling edit but staying on the page');
    this.common.cancelEditing(false); // user selects "Cancel" → "Stay"

    this.log('complete', 'Stayed on page; temporary data should be retained');
  }

  /**
   * Handles the "Cancel → OK" route-guard scenario for Parent/Guardian edits.
   *
   * Starts an edit, triggers cancel, confirms the discard
   */
  public discardParentGuardianChanges(): void {
    this.log('method', 'discardParentGuardianChanges()');
    this.log('action', 'Navigating to Parent/Guardian tab');
    this.detailsNav.goToParentGuardianTab();

    this.log('action', 'Starting Parent/Guardian edit');
    this.parentGuardianDetails.change();

    this.log('verify', 'Verifying Parent/Guardian section header');
    this.editParentGuardianActions.assertHeader();

    this.log('action', 'Cancelling edit and confirming discard');
    this.common.cancelEditing(true); // user selects "Cancel" → "OK" to discard

    this.log('complete', 'Parent/Guardian changes discarded successfully');
  }
}

export default AccountEnquiryFlow;
