import type { Interception } from 'cypress/types/net-stubbing';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('ManualAccountRequestMonitorActions');
let matchedLocalJusticeAreasRequest: Interception | null = null;

/**
 * Network intercept and assertion helpers for Manual Account Creation journeys.
 */
export class ManualAccountRequestMonitorActions {
  private static readonly LOCAL_JUSTICE_AREAS_ALIAS = 'getLocalJusticeAreas';
  private static readonly DRAFT_ACCOUNT_CREATE_ALIAS = 'postDraftAccount';

  /**
   * Starts intercepting local justice area lookup requests.
   */
  monitorLocalJusticeAreasRequests(): void {
    log('intercept', 'Monitoring local justice area requests');
    matchedLocalJusticeAreasRequest = null;
    cy.intercept({ method: 'GET', url: '**/local-justice-areas*' }).as(
      ManualAccountRequestMonitorActions.LOCAL_JUSTICE_AREAS_ALIAS,
    );
  }

  /**
   * Asserts the latest local justice area request includes exactly the expected lja_type values.
   * @param expectedLjaTypes - Expected lja_type values (order-insensitive).
   */
  assertLatestLocalJusticeAreasRequestIncludes(expectedLjaTypes: string[]): void {
    const normalizedExpected = this.normalizeUniqueValues(expectedLjaTypes).sort();
    this.getCapturedRequests(ManualAccountRequestMonitorActions.LOCAL_JUSTICE_AREAS_ALIAS).then((requests) => {
      const matchingRequest = this.findLatestRequestWithLjaTypes(requests, normalizedExpected);
      const actualLjaTypes = matchingRequest ? this.getSearchParams(matchingRequest, 'lja_type').sort() : [];

      expect(
        actualLjaTypes,
        `expected a local justice area request with lja_type values [${normalizedExpected.join(', ')}], captured: ${this.describeCapturedLjaTypes(requests)}`,
      ).to.deep.equal(normalizedExpected);

      matchedLocalJusticeAreasRequest = matchingRequest;
    });
  }

  /**
   * Asserts the latest local justice area request excludes the supplied lja_type values.
   * @param excludedLjaTypes - lja_type values that must be absent.
   */
  assertLatestLocalJusticeAreasRequestExcludes(excludedLjaTypes: string[]): void {
    const normalizedExcluded = this.normalizeUniqueValues(excludedLjaTypes);
    this.getRequestForExclusionAssertion().then((request) => {
      const actualLjaTypes = this.getSearchParams(request, 'lja_type');

      normalizedExcluded.forEach((excludedType) => {
        expect(actualLjaTypes, `local justice area request should not include lja_type=${excludedType}`).to.not.include(
          excludedType,
        );
      });
    });
  }

  /**
   * Starts intercepting draft account create requests.
   */
  monitorDraftAccountCreateRequests(): void {
    log('intercept', 'Monitoring draft account create requests');
    cy.intercept({ method: 'POST', url: '**/opal-fines-service/draft-accounts*' }).as(
      ManualAccountRequestMonitorActions.DRAFT_ACCOUNT_CREATE_ALIAS,
    );
  }

  /**
   * Asserts originator_type on the latest draft account create request.
   * @param expectedOriginatorType - Expected payload.account.originator_type.
   */
  assertLatestDraftAccountCreateOriginatorType(expectedOriginatorType: string): void {
    this.getCapturedRequests(ManualAccountRequestMonitorActions.DRAFT_ACCOUNT_CREATE_ALIAS).then((requests) => {
      const latestRequest = this.getLatestRequest(requests, 'draft account create');
      const requestBody = latestRequest.request.body as {
        account?: { originator_type?: string };
      };

      expect(requestBody.account, 'draft account payload.account').to.exist;
      expect(requestBody.account?.originator_type).to.equal(expectedOriginatorType);
    });
  }

  /**
   * Returns all captured requests for the provided alias.
   * @param alias - Cypress alias without @.
   * @returns Captured interceptions array.
   */
  private getCapturedRequests(alias: string): Cypress.Chainable<Interception[]> {
    return cy
      .get(`@${alias}.all`)
      .then((requests: unknown) => (Array.isArray(requests) ? (requests as Interception[]) : []));
  }

  /**
   * Returns the most recent request from captured interceptions.
   * @param requests - Captured interceptions.
   * @param description - Human-readable request type for assertions.
   * @returns Latest interception.
   */
  private getLatestRequest(requests: Interception[], description: string): Interception {
    expect(requests, `captured ${description} requests`).to.have.length.greaterThan(0);
    return requests[requests.length - 1];
  }

  /**
   * Returns the most recent request whose lja_type params exactly match the expected values.
   * @param requests - Captured interceptions.
   * @param expectedLjaTypes - Expected lja_type values.
   * @returns Matching interception, if any.
   */
  private findLatestRequestWithLjaTypes(requests: Interception[], expectedLjaTypes: string[]): Interception | null {
    const expectedKey = JSON.stringify(expectedLjaTypes);

    return (
      [...requests]
        .reverse()
        .find((request) => JSON.stringify(this.getSearchParams(request, 'lja_type').sort()) === expectedKey) ?? null
    );
  }

  /**
   * Returns the request to use for exclusion assertions.
   * @returns Matching request from the include step, or the latest captured request as a fallback.
   */
  private getRequestForExclusionAssertion(): Cypress.Chainable<Interception> {
    if (matchedLocalJusticeAreasRequest) {
      return cy.wrap(matchedLocalJusticeAreasRequest, { log: false });
    }

    return this.getCapturedRequests(ManualAccountRequestMonitorActions.LOCAL_JUSTICE_AREAS_ALIAS).then((requests) =>
      this.getLatestRequest(requests, 'local justice area'),
    );
  }

  /**
   * Extracts unique query parameter values from an intercepted request URL.
   * @param request - Intercepted request.
   * @param key - Query parameter key.
   * @returns Unique query param values.
   */
  private getSearchParams(request: Interception, key: string): string[] {
    const url = new URL(request.request.url);
    return [...new Set(url.searchParams.getAll(key))];
  }

  /**
   * Trims, de-duplicates and removes empty values.
   * @param values - Raw values to normalize.
   * @returns Normalized unique values.
   */
  private normalizeUniqueValues(values: string[]): string[] {
    return values
      .map((value) => value?.trim())
      .filter(Boolean)
      .filter((value, index, arr) => arr.indexOf(value) === index);
  }

  /**
   * Builds a compact debug description of captured lja_type query params.
   * @param requests - Captured interceptions.
   * @returns Human-readable summary of captured request params.
   */
  private describeCapturedLjaTypes(requests: Interception[]): string {
    if (!requests.length) {
      return 'none';
    }

    return requests
      .map((request, index) => {
        const values = this.getSearchParams(request, 'lja_type').sort();
        return `${index + 1}:[${values.join(', ')}]`;
      })
      .join(' ');
  }
}
