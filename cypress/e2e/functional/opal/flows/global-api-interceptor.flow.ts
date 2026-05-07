/**
 * Flow helpers for global API interceptor scenarios.
 * Orchestrates navigation, API stubs, and state guards for global error handling.
 *
 * @file
 * @remarks Combines dashboard/account search navigation with error response stubs and banner resets.
 * @example
 * const flow = new GlobalApiInterceptorFlow();
 * flow.openManualAccountCreationWithBusinessUnitsError(400);
 */
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { AccountSearchFlow } from './account-search.flow';
import { AccountSearchCommonActions } from '../actions/search/search.common.actions';
import { AccountSearchCompanyActions } from '../actions/search/search.companies.actions';
import { CommonActions } from '../actions/common/common.actions';
import { GlobalApiInterceptorActions } from '../actions/global-api-interceptor.actions';
import { ManualCreateOrTransferInActions } from '../actions/manual-account-creation/create-transfer.actions';
import { ManualCreateAccountActions } from '../actions/manual-account-creation/create-account.actions';
import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { PrimaryNavigationActions } from '../actions/primary-navigation.actions';
import { AccountDetailsNavActions } from '../actions/account-details/details.nav.actions';
import { EditDefendantDetailsActions } from '../actions/account-details/edit.defendant-details.actions';
import { AccountDetailsNotesActions } from '../actions/account-details/details.notes.actions';

const log = createScopedLogger('GlobalApiInterceptorFlow');

const ACCOUNT_SEARCH_NON_RETRIABLE_HEADER = 'Sorry, there is a problem with the service';

/**
 * Flow helpers for global API interceptor scenarios.
 */
export class GlobalApiInterceptorFlow {
  private readonly actions = new GlobalApiInterceptorActions();
  private readonly searchIndividuals = new AccountSearchIndividualsActions();
  private readonly primaryNavigation = new PrimaryNavigationActions();
  private readonly createAccount = new ManualCreateAccountActions();
  private readonly originatorType = new ManualCreateOrTransferInActions();
  private readonly common = new CommonActions();
  private readonly accountSearchFlow = new AccountSearchFlow();
  private readonly accountSearchCommon = new AccountSearchCommonActions();
  private readonly accountSearchCompanies = new AccountSearchCompanyActions();
  private readonly detailsNav = new AccountDetailsNavActions();
  private readonly editDefendantDetails = new EditDefendantDetailsActions();
  private readonly notes = new AccountDetailsNotesActions();

  /**
   * Opens Manual Account Creation and triggers a CEP-style business units error.
   * @param statusCode - HTTP status to stub for the business units request.
   * @remarks Guards that the user remains on the dashboard after the failure.
   * @example
   * flow.openManualAccountCreationWithBusinessUnitsError(400);
   */
  public openManualAccountCreationWithBusinessUnitsError(statusCode: number): void {
    log('flow', 'Opening Manual Account Creation with business units error', { statusCode });
    this.searchIndividuals.assertOnSearchLandingPage();
    this.actions.stubBusinessUnitsError(statusCode);
    this.primaryNavigation.chooseItem('Accounts');
    this.primaryNavigation.assertLandingPage('Accounts', '/fines/dashboard/accounts');
    this.createAccount.openFromAccountsPage();
    this.originatorType.assertOnCreateOrTransferInPage();
    this.originatorType.selectOriginatorType('New');
    this.originatorType.continueToCreateAccount();
    this.actions.waitForBusinessUnitsError(statusCode);
    this.originatorType.assertOnCreateOrTransferInPage();
  }

  /**
   * Opens Manual Account Creation and triggers a retriable business units error.
   * @param statusCode - HTTP status to stub for the business units request.
   * @remarks Guards that the user remains on the dashboard after the failure.
   * @example
   * flow.openManualAccountCreationWithRetriableBusinessUnitsError(500);
   */
  public openManualAccountCreationWithRetriableBusinessUnitsError(statusCode: number): void {
    log('flow', 'Opening Manual Account Creation with retriable business units error', { statusCode });
    this.searchIndividuals.assertOnSearchLandingPage();
    this.actions.stubBusinessUnitsRetriableError(statusCode);
    this.primaryNavigation.chooseItem('Accounts');
    this.primaryNavigation.assertLandingPage('Accounts', '/fines/dashboard/accounts');
    this.createAccount.openFromAccountsPage();
    this.originatorType.assertOnCreateOrTransferInPage();
    this.originatorType.selectOriginatorType('New');
    this.originatorType.continueToCreateAccount();
    this.actions.waitForBusinessUnitsRetriableError(statusCode);
    this.originatorType.assertOnCreateOrTransferInPage();
  }

  /**
   * Opens Manual Account Creation and triggers a non-retriable business units error.
   * @param statusCode - HTTP status to stub for the business units request.
   * @remarks Guards the expected error page header based on the status code.
   * @example
   * flow.openManualAccountCreationWithNonRetriableBusinessUnitsError(500);
   */
  public openManualAccountCreationWithNonRetriableBusinessUnitsError(statusCode: number): void {
    const expectedHeader = this.resolveBusinessUnitsHeader(statusCode);
    log('flow', 'Opening Manual Account Creation with non-retriable business units error', {
      statusCode,
      expectedHeader,
    });
    this.searchIndividuals.assertOnSearchLandingPage();
    this.actions.stubBusinessUnitsNonRetriableError(statusCode);
    this.primaryNavigation.chooseItem('Accounts');
    this.primaryNavigation.assertLandingPage('Accounts', '/fines/dashboard/accounts');
    this.createAccount.openFromAccountsPage();
    this.originatorType.assertOnCreateOrTransferInPage();
    this.originatorType.selectOriginatorType('New');
    this.originatorType.continueToCreateAccount();
    this.actions.waitForBusinessUnitsNonRetriableError(statusCode);
    this.common.assertHeaderContains(expectedHeader);
  }

  /**
   * Opens Manual Account Creation and triggers a business units network failure.
   * @remarks Guards that the user remains on the dashboard after the failure.
   * @example
   * flow.openManualAccountCreationWithBusinessUnitsNetworkFailure();
   */
  public openManualAccountCreationWithBusinessUnitsNetworkFailure(): void {
    log('flow', 'Opening Manual Account Creation with business units network failure');
    this.searchIndividuals.assertOnSearchLandingPage();
    this.actions.stubBusinessUnitsNetworkFailure();
    this.primaryNavigation.chooseItem('Accounts');
    this.primaryNavigation.assertLandingPage('Accounts', '/fines/dashboard/accounts');
    this.createAccount.openFromAccountsPage();
    this.originatorType.assertOnCreateOrTransferInPage();
    this.originatorType.selectOriginatorType('New');
    this.originatorType.continueToCreateAccount();
    this.actions.waitForBusinessUnitsNetworkFailure();
    this.originatorType.assertOnCreateOrTransferInPage();
  }

  /**
   * Attempts a Companies search and triggers a retriable search error.
   * @param reference - Reference or case number to search for.
   * @param statusCode - HTTP status to stub for the defendant accounts search.
   * @remarks Guards that the Companies search form remains visible.
   * @example
   * flow.searchCompaniesWithRetriableError('NOMATCH999', 500);
   */
  public searchCompaniesWithRetriableError(reference: string, statusCode: number): void {
    log('flow', 'Searching Companies with retriable error', { reference, statusCode });
    this.actions.stubDefendantAccountsSearchRetriableError(statusCode);
    this.accountSearchFlow.viewCompaniesForm();
    this.accountSearchCommon.enterReferenceOrCaseNumber(reference);
    this.accountSearchCommon.clickSearchButton();
    this.actions.waitForDefendantAccountsSearchRetriableError(statusCode);
    this.accountSearchCompanies.assertOnSearchPage();
  }

  /**
   * Attempts a Companies search and triggers a non-retriable search error.
   * @param reference - Reference or case number to search for.
   * @param statusCode - HTTP status to stub for the defendant accounts search.
   * @remarks Guards the expected error page header for account search.
   * @example
   * flow.searchCompaniesWithNonRetriableError('NOMATCH999', 500);
   */
  public searchCompaniesWithNonRetriableError(reference: string, statusCode: number): void {
    log('flow', 'Searching Companies with non-retriable error', { reference, statusCode });
    this.actions.stubDefendantAccountsSearchNonRetriableError(statusCode);
    this.accountSearchFlow.viewCompaniesForm();
    this.accountSearchCommon.enterReferenceOrCaseNumber(reference);
    this.accountSearchCommon.clickSearchButton();
    this.actions.waitForDefendantAccountsSearchNonRetriableError(statusCode);
    this.common.assertHeaderContains(this.resolveAccountSearchHeader(statusCode));
  }

  /**
   * Opens the FAE Fixed penalty tab and triggers the fixed-penalty details GET network failure.
   * @remarks Guards that the user remains on the same Account Details route after the failure.
   * @example
   * flow.openFixedPenaltyDetailsWithNetworkFailure();
   */
  public openFixedPenaltyDetailsWithNetworkFailure(): void {
    log('flow', 'Opening FAE fixed penalty tab with network failure');
    this.actions.stubDefendantAccountFixedPenaltyNetworkFailure();
    this.detailsNav.goToFixedPenaltyTab();
    this.actions.waitForDefendantAccountFixedPenaltyNetworkFailure();
    cy.location('pathname', this.common.getPathTimeoutOptions()).should(
      'match',
      /\/fines\/account\/defendant\/\d+\/details$/,
    );
    this.detailsNav.assertFixedPenaltyTabIsActive();
  }

  /**
   * Saves Defendant details and triggers a non-retriable concurrency error from the party update endpoint.
   * @param statusCode - HTTP status to stub for the Replace Defendant Account Party request.
   * @remarks Guards the FAE Replace Defendant Account Party endpoint.
   * @example
   * flow.saveDefendantDetailsWithPartyConcurrencyError(409);
   */
  public saveDefendantDetailsWithPartyConcurrencyError(statusCode: number): void {
    const expectedHeader = this.resolveDefendantAccountPartyHeader(statusCode);
    log('flow', 'Saving defendant details with defendant account party concurrency error', {
      statusCode,
      expectedHeader,
    });
    this.actions.stubDefendantAccountPartyConcurrencyError(statusCode);
    this.editDefendantDetails.saveChanges();
    this.actions.waitForDefendantAccountPartyConcurrencyError(statusCode);
    cy.location('pathname', this.common.getTimeoutOptions()).should('eq', '/error/concurrency-failure');
    this.common.assertHeaderContains(expectedHeader);
  }

  /**
   * Saves an account note and triggers the Add Note POST non-retriable permission error.
   * @param noteText - Text to enter into the Add account note form.
   * @param statusCode - HTTP status to stub for the Add Note request.
   * @remarks Guards the Permission Denied page header after the common interceptor handles the error.
   * @example
   * flow.saveAccountNoteWithNonRetriablePermissionError('Permission denied test note', 403);
   */
  public saveAccountNoteWithNonRetriablePermissionError(noteText: string, statusCode: number): void {
    const expectedHeader = this.resolveAddNoteNonRetriableHeader(statusCode);
    log('flow', 'Saving account note with non-retriable permission error', { statusCode });
    this.notes.assertHeaderContains('Add account note');
    this.actions.stubAddNoteNonRetriablePermissionError(statusCode);
    this.notes.enterAccountNote(noteText);
    this.notes.save();
    this.actions.waitForAddNoteNonRetriablePermissionError(statusCode);
    this.common.assertHeaderContains(expectedHeader);
  }

  /**
   * Clicks Go back on the Permission Denied page and asserts the Add account note page is restored.
   * @remarks Covers the FAE Add Note back-navigation acceptance criterion.
   * @example
   * flow.returnToAddAccountNoteFromPermissionDenied();
   */
  public returnToAddAccountNoteFromPermissionDenied(): void {
    log('flow', 'Returning from Permission Denied page to Add account note');
    this.actions.clickPermissionDeniedBackLink();
    this.notes.assertHeaderContains('Add account note');
  }

  /**
   * Refreshes the current page and confirms the global banner is cleared.
   * @param expectedHeader - Expected header text after refresh.
   * @remarks Uses header assertions to guard the refresh destination.
   * @example
   * flow.refreshAndAssertBannerCleared('Dashboard');
   */
  public refreshAndAssertBannerCleared(expectedHeader: string): void {
    log('flow', 'Refreshing page and confirming banner cleared', { expectedHeader });
    cy.reload();
    this.common.assertHeaderContains(expectedHeader);
    this.actions.assertGlobalBannerNotVisible();
  }

  /**
   * Resolves the expected header for business units non-retriable errors.
   * @param statusCode - HTTP status used to route to the correct error page.
   * @returns Expected error page header for the given status.
   * @remarks Throws for unsupported status codes to avoid false positives.
   * @example
   * const header = this.resolveBusinessUnitsHeader(409);
   */
  private resolveBusinessUnitsHeader(statusCode: number): string {
    switch (statusCode) {
      case 500:
        return 'Sorry, there is a problem with the service';
      case 409:
        return 'Sorry, there is a problem';
      case 403:
        return 'You do not have permission for this';
      default:
        throw new Error(`Unsupported business units error status: ${statusCode}`);
    }
  }

  /**
   * Resolves the expected header for account search non-retriable errors.
   * @param statusCode - HTTP status used to route to the correct error page.
   * @returns Expected error page header for the given status.
   * @remarks Throws for unsupported status codes to avoid false positives.
   * @example
   * const header = this.resolveAccountSearchHeader(500);
   */
  private resolveAccountSearchHeader(statusCode: number): string {
    if (statusCode === 500) {
      return ACCOUNT_SEARCH_NON_RETRIABLE_HEADER;
    }
    throw new Error(`Unsupported account search error status: ${statusCode}`);
  }

  /**
   * Resolves the expected header for Replace Defendant Account Party non-retriable errors.
   * @param statusCode - HTTP status used to route to the correct error page.
   * @returns Expected error page header for the given status.
   * @remarks Throws for unsupported status codes to avoid false positives.
   * @example
   * const header = this.resolveDefendantAccountPartyHeader(409);
   */
  private resolveDefendantAccountPartyHeader(statusCode: number): string {
    if (statusCode === 409) {
      return 'Sorry, there is a problem';
    }
    throw new Error(`Unsupported defendant account party error status: ${statusCode}`);
  }

  /**
   * Resolves the expected header for Add Note non-retriable errors.
   * @param statusCode - HTTP status used to route to the correct error page.
   * @returns Expected error page header for the given status.
   * @remarks Throws for unsupported status codes to avoid false positives.
   * @example
   * const header = this.resolveAddNoteNonRetriableHeader(403);
   */
  private resolveAddNoteNonRetriableHeader(statusCode: number): string {
    if (statusCode === 403) {
      return 'You do not have permission for this';
    }
    throw new Error(`Unsupported add note error status: ${statusCode}`);
  }
}
