/**
 * Global API interceptor actions for stubbing error responses and asserting global alerts.
 * Provides network stubs and UI assertions used by global API interceptor E2E scenarios.
 *
 * @file
 * @remarks Centralizes CEP error handling and banner assertions for reuse across flows.
 * @example
 * const actions = new GlobalApiInterceptorActions();
 * actions.stubBusinessUnitsError(400);
 */
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { FixedPenaltyReviewLocators as FixedPenaltyLocators } from '../../../../shared/selectors/manual-account-creation/fixed-penalty.locators';
import { CommonActions } from './common/common.actions';

const log = createScopedLogger('GlobalApiInterceptorActions');

const GLOBAL_ERROR_MESSAGE = 'You can try again. If the problem persists, contact the service desk.';
const RETRIABLE_WARNING_TITLE = 'Temporary System Issue';
const RETRIABLE_WARNING_MESSAGE = 'Please try again later or contact the help desk.';
const RETRIABLE_WARNING_OPERATION_ID = 'OP12345';
const NON_RETRIABLE_ERROR_TITLE = 'Internal Server Error';
const NON_RETRIABLE_ERROR_DETAIL = 'An unexpected error occurred. Please report this issue using the Operation ID.';
const NON_RETRIABLE_OPERATION_ID = 'OP67890';

type KeyValueRow = { key: string; value: string };

/**
 * Actions for stubbing global API errors and asserting global alert content.
 */
export class GlobalApiInterceptorActions {
  private readonly common = new CommonActions();

  /**
   * Stubs the business units request with a CEP-style error response.
   * @param statusCode - HTTP status to return for the business units request.
   * @remarks Uses a fixed error body to mirror existing CEP error stubs.
   * @example
   * actions.stubBusinessUnitsError(400);
   */
  public stubBusinessUnitsError(statusCode: number): void {
    log('intercept', 'Stubbing business units error response', { statusCode });
    cy.intercept('GET', '/opal-fines-service/business-units**', {
      statusCode,
      body: { error: NON_RETRIABLE_ERROR_TITLE },
    }).as('getBusinessUnitsError');
  }

  /**
   * Waits for the CEP-style business units error response and validates it.
   * @param statusCode - Expected HTTP status returned by the stub.
   * @remarks Confirms both status code and the error body.
   * @example
   * actions.waitForBusinessUnitsError(400);
   */
  public waitForBusinessUnitsError(statusCode: number): void {
    log('wait', 'Waiting for business units error response', { statusCode });
    cy.wait('@getBusinessUnitsError').then((interception) => {
      const response = interception.response;
      expect(response, 'Business units error response').to.exist;
      expect(response?.statusCode).to.equal(statusCode);
      expect(response?.body?.error).to.equal(NON_RETRIABLE_ERROR_TITLE);
    });
  }

  /**
   * Stubs a retriable business units error response.
   * @param statusCode - HTTP status to return for the business units request.
   * @remarks Uses the retriable body payload and operation id expected by the UI.
   * @example
   * actions.stubBusinessUnitsRetriableError(500);
   */
  public stubBusinessUnitsRetriableError(statusCode: number): void {
    log('intercept', 'Stubbing retriable business units error response', { statusCode });
    cy.intercept('GET', '/opal-fines-service/business-units**', {
      statusCode,
      body: {
        retriable: true,
        title: RETRIABLE_WARNING_TITLE,
        detail: RETRIABLE_WARNING_MESSAGE,
        operation_id: RETRIABLE_WARNING_OPERATION_ID,
      },
    }).as('getBusinessUnitsRetriableError');
  }

  /**
   * Waits for the retriable business units error response and validates it.
   * @param statusCode - Expected HTTP status returned by the stub.
   * @remarks Confirms retriable metadata and operation id.
   * @example
   * actions.waitForBusinessUnitsRetriableError(500);
   */
  public waitForBusinessUnitsRetriableError(statusCode: number): void {
    log('wait', 'Waiting for retriable business units error response', { statusCode });
    cy.wait('@getBusinessUnitsRetriableError').then((interception) => {
      const response = interception.response;
      expect(response, 'Business units retriable response').to.exist;
      expect(response?.statusCode).to.equal(statusCode);
      expect(response?.body?.retriable).to.be.true;
      expect(response?.body?.title).to.equal(RETRIABLE_WARNING_TITLE);
      expect(response?.body?.detail).to.include('contact the help desk');
      expect(response?.body?.operation_id).to.equal(RETRIABLE_WARNING_OPERATION_ID);
    });
  }

  /**
   * Stubs a non-retriable business units error response.
   * @param statusCode - HTTP status to return for the business units request.
   * @remarks Uses the non-retriable payload expected by the UI error routing.
   * @example
   * actions.stubBusinessUnitsNonRetriableError(500);
   */
  public stubBusinessUnitsNonRetriableError(statusCode: number): void {
    log('intercept', 'Stubbing non-retriable business units error response', { statusCode });
    cy.intercept('GET', '/opal-fines-service/business-units**', {
      statusCode,
      body: {
        retriable: false,
        title: NON_RETRIABLE_ERROR_TITLE,
        detail: NON_RETRIABLE_ERROR_DETAIL,
        operation_id: NON_RETRIABLE_OPERATION_ID,
      },
    }).as('getBusinessUnitsNonRetriableError');
  }

  /**
   * Waits for the non-retriable business units error response and validates it.
   * @param statusCode - Expected HTTP status returned by the stub.
   * @remarks Confirms the payload includes the non-retriable operation id.
   * @example
   * actions.waitForBusinessUnitsNonRetriableError(500);
   */
  public waitForBusinessUnitsNonRetriableError(statusCode: number): void {
    log('wait', 'Waiting for non-retriable business units error response', { statusCode });
    cy.wait('@getBusinessUnitsNonRetriableError').then((interception) => {
      const response = interception.response;
      expect(response, 'Business units non-retriable response').to.exist;
      expect(response?.statusCode).to.equal(statusCode);
      expect(response?.body?.retriable).to.be.false;
      expect(response?.body?.title).to.equal(NON_RETRIABLE_ERROR_TITLE);
      expect(response?.body?.detail).to.include('Operation ID');
      expect(response?.body?.operation_id).to.equal(NON_RETRIABLE_OPERATION_ID);
    });
  }

  /**
   * Stubs a business units network failure (no response).
   * @remarks Uses forceNetworkError to simulate connectivity loss.
   * @example
   * actions.stubBusinessUnitsNetworkFailure();
   */
  public stubBusinessUnitsNetworkFailure(): void {
    log('intercept', 'Stubbing business units network failure');
    cy.intercept(
      {
        method: 'GET',
        url: '**/opal-fines-service/business-units*',
      },
      { forceNetworkError: true },
    ).as('getBusinessUnitsNetworkError');
  }

  /**
   * Waits for the business units network failure request.
   * @remarks Confirms the request is triggered even without a response body.
   * @example
   * actions.waitForBusinessUnitsNetworkFailure();
   */
  public waitForBusinessUnitsNetworkFailure(): void {
    log('wait', 'Waiting for business units network failure');
    cy.wait('@getBusinessUnitsNetworkError');
  }

  /**
   * Stubs a retriable defendant accounts search error.
   * @param statusCode - HTTP status to return for the defendant accounts search.
   * @remarks Uses the retriable payload expected by the global warning banner.
   * @example
   * actions.stubDefendantAccountsSearchRetriableError(500);
   */
  public stubDefendantAccountsSearchRetriableError(statusCode: number): void {
    log('intercept', 'Stubbing retriable defendant accounts search error', { statusCode });
    cy.intercept('POST', '/opal-fines-service/defendant-accounts/search', {
      statusCode,
      body: {
        retriable: true,
        title: RETRIABLE_WARNING_TITLE,
        detail: RETRIABLE_WARNING_MESSAGE,
        operation_id: RETRIABLE_WARNING_OPERATION_ID,
      },
    }).as('defendantAccountsSearchRetriableError');
  }

  /**
   * Waits for the retriable defendant accounts search error and validates it.
   * @param statusCode - Expected HTTP status returned by the stub.
   * @remarks Confirms retriable metadata and operation id.
   * @example
   * actions.waitForDefendantAccountsSearchRetriableError(500);
   */
  public waitForDefendantAccountsSearchRetriableError(statusCode: number): void {
    log('wait', 'Waiting for retriable defendant accounts search error', { statusCode });
    cy.wait('@defendantAccountsSearchRetriableError').then((interception) => {
      const response = interception.response;
      expect(response, 'Defendant accounts retriable response').to.exist;
      expect(response?.statusCode).to.equal(statusCode);
      expect(response?.body?.retriable).to.be.true;
      expect(response?.body?.title).to.equal(RETRIABLE_WARNING_TITLE);
      expect(response?.body?.detail).to.include('contact the help desk');
      expect(response?.body?.operation_id).to.equal(RETRIABLE_WARNING_OPERATION_ID);
    });
  }

  /**
   * Stubs a non-retriable defendant accounts search error.
   * @param statusCode - HTTP status to return for the defendant accounts search.
   * @remarks Uses the non-retriable payload expected by the error page.
   * @example
   * actions.stubDefendantAccountsSearchNonRetriableError(500);
   */
  public stubDefendantAccountsSearchNonRetriableError(statusCode: number): void {
    log('intercept', 'Stubbing non-retriable defendant accounts search error', { statusCode });
    cy.intercept('POST', '/opal-fines-service/defendant-accounts/search', {
      statusCode,
      body: {
        retriable: false,
        title: NON_RETRIABLE_ERROR_TITLE,
        detail: 'Sorry, there is a problem with the service',
        operation_id: NON_RETRIABLE_OPERATION_ID,
      },
    }).as('defendantAccountsSearchNonRetriableError');
  }

  /**
   * Waits for the non-retriable defendant accounts search error and validates it.
   * @param statusCode - Expected HTTP status returned by the stub.
   * @remarks Confirms the non-retriable flag and operation id.
   * @example
   * actions.waitForDefendantAccountsSearchNonRetriableError(500);
   */
  public waitForDefendantAccountsSearchNonRetriableError(statusCode: number): void {
    log('wait', 'Waiting for non-retriable defendant accounts search error', { statusCode });
    cy.wait('@defendantAccountsSearchNonRetriableError').then((interception) => {
      const response = interception.response;
      expect(response, 'Defendant accounts non-retriable response').to.exist;
      expect(response?.statusCode).to.equal(statusCode);
      expect(response?.body?.retriable).to.be.false;
      expect(response?.body?.title).to.equal(NON_RETRIABLE_ERROR_TITLE);
      expect(response?.body?.operation_id).to.equal(NON_RETRIABLE_OPERATION_ID);
    });
  }

  /**
   * Asserts the global error banner is visible with the standard message.
   * @remarks Uses the shared global alert selector and standard error message.
   * @example
   * actions.assertGlobalErrorBanner();
   */
  public assertGlobalErrorBanner(): void {
    log('assert', 'Asserting global error banner message');
    this.assertGlobalBannerContains([GLOBAL_ERROR_MESSAGE]);
  }

  /**
   * Asserts the global warning banner contains the values in the table.
   * @param table - DataTable of expected banner values.
   * @remarks Ignores table header rows such as "field | value".
   * @example
   * actions.assertGlobalWarningBannerFromTable(table);
   */
  public assertGlobalWarningBannerFromTable(table: DataTable): void {
    const rows = this.readKeyValueRows(table);
    const expected = rows
      .filter((row) => !this.isHeaderRow(row))
      .map((row) => row.value)
      .filter(Boolean);
    log('assert', 'Asserting global warning banner contains expected values', { expected });
    this.assertGlobalBannerContains(expected);
  }

  /**
   * Asserts the global banner is not visible.
   * @remarks Uses the shared global alert selector for absence checks.
   * @example
   * actions.assertGlobalBannerNotVisible();
   */
  public assertGlobalBannerNotVisible(): void {
    log('assert', 'Asserting global banner is not visible');
    cy.get(FixedPenaltyLocators.globalErrorBanner).should('not.exist');
  }

  /**
   * Asserts error page content from a key/value table.
   * @param table - DataTable containing "header" and "message" rows.
   * @remarks Supports multiple message rows for composite assertions.
   * @example
   * actions.assertErrorPageContent(table);
   */
  public assertErrorPageContent(table: DataTable): void {
    const rows = this.readKeyValueRows(table).filter((row) => !this.isHeaderRow(row));
    log('assert', 'Asserting error page content', { rows });

    for (const row of rows) {
      const key = row.key.trim().toLowerCase();
      const value = row.value.trim();
      if (!value) continue;

      if (key === 'header' || key === 'heading' || key === 'title') {
        this.common.assertHeaderContains(value);
      } else {
        this.common.assertTextOnPage(value);
      }
    }
  }

  /**
   * Reads key/value rows from a DataTable for shared parsing.
   * @param table - DataTable containing key/value pairs.
   * @returns Parsed key/value rows with trimmed values.
   * @remarks Trims whitespace and drops empty rows.
   * @example
   * const rows = this.readKeyValueRows(table);
   */
  private readKeyValueRows(table: DataTable): KeyValueRow[] {
    const rows = table.raw().map((row) => row.map((cell) => (cell ?? '').trim()));
    return rows
      .filter((row) => row.length >= 2)
      .map(([key, value]) => ({ key: key ?? '', value: value ?? '' }))
      .filter((row) => row.key || row.value);
  }

  /**
   * Determines whether a table row represents a header row.
   * @param row - Parsed key/value row.
   * @returns True when the row matches a header pattern.
   * @remarks Header rows are ignored for banner and error page assertions.
   * @example
   * const isHeader = this.isHeaderRow(row);
   */
  private isHeaderRow(row: KeyValueRow): boolean {
    const key = row.key.trim().toLowerCase();
    const value = row.value.trim().toLowerCase();
    return (key === 'field' || key === 'type') && (value === 'value' || value === 'text');
  }

  /**
   * Asserts the global banner contains all expected values.
   * @param values - Expected text fragments to locate within the banner.
   * @remarks Uses a single banner query to validate multiple expectations.
   * @example
   * this.assertGlobalBannerContains(['Temporary System Issue', 'OP12345']);
   */
  private assertGlobalBannerContains(values: string[]): void {
    const expected = values.map((value) => value.trim()).filter(Boolean);
    cy.get(FixedPenaltyLocators.globalErrorBanner, this.common.getTimeoutOptions())
      .should('exist')
      .should(($el) => {
        const text = $el.text();
        for (const value of expected) {
          expect(text).to.include(value);
        }
      });
  }
}
