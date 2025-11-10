import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { AccountSearchCompanyActions } from '../actions/search/search.companies.actions';
import { AccountSearchNavActions } from '../actions/search/search.nav.actions';
import { ResultsActions } from '../actions/search.results.actions';
import { AccountDetailsDefendantActions } from '../actions/account details/details.defendant.actions';
import { DashboardActions } from '../actions/dashboard.actions';
import { AccountSearchIndividualsLocators as L } from '../../../../shared/selectors/account.search.individuals.locators';
import { AccountEnquiryResultsLocators as R } from '../../../../shared/selectors/accountEnquiryResults.locators';
import { forceSingleTabNavigation } from '../../../../support/utils/navigation';
import { hasAccountLinkOnPage } from '../../../../support/utils/results';
import { CommonActions } from '../actions/common/common.actions';

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
  private readonly details = new AccountDetailsDefendantActions();
  private readonly dashboard = new DashboardActions();
  private readonly common = new CommonActions();

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
   * Ensures the test is on the Account Search page.
   * If not, it navigates via the dashboard.
   */
  private ensureOnSearchPage(): void {
    this.log('method', 'ensureOnSearchPage()');
    cy.get('body').then(($b) => {
      const onSearch = $b.find(L.root).length > 0;
      if (!onSearch) {
        this.log('navigate', 'Navigating to Account Search dashboard');
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
    this.ensureOnSearchPage();
    this.searchIndividuals.byLastName(surname);
  }

  /**
   * Performs a Companies search by company name.
   *
   * @param companyName - Company name to search for.
   */
  public searchByCompanyName(companyName: string): void {
    this.log('method', 'searchByCompanyName()');
    this.log('search', 'Searching by company name', { companyName });
    this.ensureOnSearchPage();
    this.searchCompany.byCompanyName(companyName);
    this.results.assertOnResults();
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

    forceSingleTabNavigation();
    this.results.waitForResultsTable();

    this.resolveAccountNumberFromAlias().then((accOrNull) => {
      if (!accOrNull) {
        this.log('fallback', 'No @etagUpdate found → opening latest row');
        this.results.openLatestPublished();
        return;
      }

      const acc = accOrNull;
      this.log('match', 'Looking for account number on current page', { accountNumber: acc });

      hasAccountLinkOnPage(acc).then((exists) => {
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
   * Convenience flow: search by surname then open the latest matching account.
   *
   * @param surname - Surname to search for.
   */
  public searchBySurname(surname: string): void {
    this.log('method', 'searchAndClickLatestBySurname()');
    this.log('flow', 'Search and open latest by surname', { surname });
    this.searchByLastName(surname);
  }

  /**
   * Convenience flow: search by surname then open the latest matching account.
   *
   * @param surname - Surname to search for.
   */
  public searchAndClickLatestBySurnameOpenLatestResult(surname: string): void {
    this.searchBySurname(surname);
    this.clickLatestPublishedFromResultsOrAcrossPages();
  }

  /**
   * Opens the most recent account from the results (top row) and asserts navigation.
   */
  public openMostRecentFromResults(): void {
    this.log('method', 'openMostRecentFromResults()');
    this.log('open', 'Opening most recent account from results');

    forceSingleTabNavigation();
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
    this.details.goToDefendantTab();
    this.details.assertSectionHeader(headerText);
  }

  /**
   * Starts editing defendant details and changes the first name field.
   *
   * @param value - New first name value.
   */
  public editDefendantAndChangeFirstName(value: string): void {
    this.log('method', 'editDefendantAndChangeFirstName()');
    this.log('edit', 'Editing defendant first name', { value });
    this.details.startEditingDefendantDetails();
    this.details.updateFirstName(value);
  }

  /**
   * Cancels the edit operation and asserts that we remain on the edit page.
   */
  public cancelEditAndStay(): void {
    this.log('method', 'cancelEditAndStay()');
    this.log('cancel', 'Cancelling edit and staying on edit page');
    this.common.cancelEditing(false);
    this.details.assertStillOnEditPage();
  }

  /**
   * Cancels the edit operation and asserts that we have returned to the details page.
   */
  public cancelEditAndLeave(): void {
    this.log('method', 'cancelEditAndLeave()');
    this.log('cancel', 'Cancelling edit and returning to details page');
    this.common.cancelEditing(true);
    this.details.assertReturnedToAccountDetails();
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
    this.details.editCompanyDefendantField('Company name', tempName);
    this.common.cancelEditing(false);
    this.common.verifyFieldValue('Company name', tempName);
    this.common.cancelEditing(true);
    this.details.assertHeaderContains(companyName);
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
    this.details.editCompanyDefendantField('Company name', tempName);
    this.common.cancelEditing(false);
    this.details.assertHeaderContains(companyName);
  }

  /**
   * Opens company account details by name using the Companies tab workflow.
   *
   * @param companyName - Company name to search and open.
   */
  public openCompanyAccountDetailsByName(companyName: string): void {
    this.log('method', 'openCompanyAccountDetailsByName()');
    this.log('flow', 'Opening company account details', { companyName });
    this.ensureOnSearchPage();
    this.searchNav.goToCompaniesTab();
    this.searchByCompanyName(companyName);
    this.clickLatestPublishedFromResultsOrAcrossPages();
  }
}

export default AccountEnquiryFlow;
