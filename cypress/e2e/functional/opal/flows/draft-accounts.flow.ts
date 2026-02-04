/**
 * @file Draft accounts flows shared across checker/inputter views.
 * @description Coordinates navigation and assertions across Create/Manage and Check/Validate draft flows,
 * keeping Cucumber steps thin and delegating to shared draft actions.
 */
import type { CyHttpMessages } from 'cypress/types/net-stubbing';
import { createScopedLogger, createScopedSyncLogger } from '../../../../support/utils/log.helper';
import { CheckAndValidateDraftsActions } from '../actions/draft-account/check-and-validate-drafts.actions';
import {
  CheckAndValidateReviewActions,
  type Decision,
} from '../actions/draft-account/check-and-validate-review.actions';
import { CommonActions } from '../actions/common/common.actions';
import { DashboardActions } from '../actions/dashboard.actions';
import { recordCreatedAccount } from '../../../../support/utils/accountCapture';
import { captureScenarioScreenshot } from '../../../../support/utils/screenshot';
import { isEvidenceCaptureEnabled } from '../../../../support/utils/evidenceMode';

const log = createScopedLogger('DraftAccountsFlow');
const logSync = createScopedSyncLogger('DraftAccountsFlow');

type RequestPayloadEntry = {
  source: 'ui';
  endpoint?: string;
  method?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  direction?: 'request' | 'response';
};

/**
 * Flow helpers that orchestrate draft account actions.
 */
export class DraftAccountsFlow {
  private readonly dashboard = new DashboardActions();
  private readonly checker = new CheckAndValidateDraftsActions();
  private readonly review = new CheckAndValidateReviewActions();
  private readonly common = new CommonActions();
  /** Max attempts to poll for a publish status after approval. */
  private readonly publishWaitAttempts = 10;
  /** Delay between publish status polls (ms). */
  private readonly publishWaitDelayMs = 1000;

  /**
   * Type guard for plain object records.
   * @param value - Candidate value.
   * @returns True when value is a non-null object (not an array).
   */
  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  /**
   * Poll draft account status until it reaches one of the expected values.
   * @param statuses - Allowed publish statuses to wait for.
   * @returns Cypress chainable that resolves once the status is reached.
   */
  private waitForPublishStatus(statuses: string[]): Cypress.Chainable<void> {
    const expected = statuses.map((status) => status.trim().toLowerCase());

    return cy.get<number>('@lastCreatedDraftId').then((accountId) => {
      const attempt = (remaining: number): Cypress.Chainable<void> =>
        cy
          .request({
            method: 'GET',
            url: `/opal-fines-service/draft-accounts/${accountId}`,
            failOnStatusCode: false,
          })
          .then((response) => {
            const body = this.isRecord(response.body) ? response.body : {};
            const statusValue = typeof body['account_status'] === 'string' ? body['account_status'] : '';
            const normalized = statusValue.trim().toLowerCase();

            if (response.status === 200 && expected.includes(normalized)) {
              log('done', 'Draft account reached publish status', { accountId, status: statusValue });
              return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
            }

            if (remaining <= 1) {
              expect(response.status, 'GET /draft-accounts status').to.eq(200);
              expect(normalized, 'draft account status').to.be.oneOf(expected);
              return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
            }

            log('info', 'Waiting for publish status after approval', {
              accountId,
              status: statusValue || 'unknown',
              remaining: remaining - 1,
            });

            return cy.wait(this.publishWaitDelayMs, { log: false }).then(() => attempt(remaining - 1));
          });

      return attempt(this.publishWaitAttempts);
    });
  }

  /**
   * Record UI approval evidence after publish status resolves.
   * @param requestPayloads - Optional PATCH request/response payloads captured during approval.
   * @returns Cypress chainable for the capture task.
   */
  private captureApprovedAccountEvidence(requestPayloads?: RequestPayloadEntry[]): Cypress.Chainable<void> {
    return cy.get<number>('@lastCreatedDraftId').then((accountId) =>
      cy
        .request({
          method: 'GET',
          url: `/opal-fines-service/draft-accounts/${accountId}`,
          failOnStatusCode: false,
        })
        .then((response) => {
          const body = this.isRecord(response.body) ? response.body : {};
          const normalizeCourtId = (value: unknown): string | undefined => {
            if (typeof value === 'string') {
              const trimmed = value.trim();
              return trimmed ? trimmed : undefined;
            }
            if (typeof value === 'number' && Number.isFinite(value)) {
              return String(value);
            }
            return undefined;
          };
          const readImposingCourtId = (record: Record<string, unknown>): string | undefined => {
            const direct = normalizeCourtId(record['imposing_court_id']);
            if (direct) return direct;
            const account = this.isRecord(record['account']) ? record['account'] : null;
            const offences = account && Array.isArray(account['offences']) ? account['offences'] : [];
            for (const offence of offences) {
              if (!this.isRecord(offence)) continue;
              const fromOffence = normalizeCourtId(offence['imposing_court_id']);
              if (fromOffence) return fromOffence;
            }
            const rootOffences = Array.isArray(record['offences']) ? record['offences'] : [];
            for (const offence of rootOffences) {
              if (!this.isRecord(offence)) continue;
              const fromOffence = normalizeCourtId(offence['imposing_court_id']);
              if (fromOffence) return fromOffence;
            }
            return undefined;
          };
          const statusValue = typeof body['account_status'] === 'string' ? body['account_status'] : undefined;
          const accountType = typeof body['account_type'] === 'string' ? body['account_type'] : 'draft';
          const accountNumber =
            typeof body['account_number'] === 'string'
              ? body['account_number']
              : this.isRecord(body['account']) && typeof body['account']['account_number'] === 'string'
                ? body['account']['account_number']
                : undefined;
          const imposingCourtId = readImposingCourtId(body);
          const updatedAt =
            typeof body['account_status_date'] === 'string'
              ? body['account_status_date']
              : typeof body['status_date'] === 'string'
                ? body['status_date']
                : undefined;

          if (response.status !== 200) {
            log('warn', 'Approval evidence GET failed', { accountId, status: response.status });
            return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
          }

          return recordCreatedAccount({
            source: 'ui',
            accountType,
            status: statusValue,
            accountId,
            accountNumber,
            imposingCourtId,
            updatedAt,
            requestPayloads: requestPayloads?.length ? requestPayloads : undefined,
            requestSummary: {
              endpoint: `/opal-fines-service/draft-accounts/${accountId}`,
              method: 'GET',
            },
          });
        }),
    );
  }

  /**
   * Opens Check and Validate Draft Accounts and asserts the review header.
   * @example
   *   flow.openCheckAndValidateWithHeader();
   */
  openCheckAndValidateWithHeader(): void {
    log('navigate', 'Opening Check and Validate with header assertion');
    this.dashboard.goToCheckAndValidateDraftAccounts();
    this.common.assertHeaderContains('Review accounts');
    // If the failed-drafts stub alias exists, wait for it so tab counts render before assertions.
    const aliases = ((Cypress as any).state?.('aliases') ?? {}) as Record<string, unknown>;
    if (aliases['getFailedDraftAccountSummaries']) {
      cy.wait('@getFailedDraftAccountSummaries', this.common.getTimeoutOptions());
    }
  }

  /**
   * Opens a draft account by defendant name and asserts the resulting header.
   * @param defendantName - Name to click in the table.
   * @param expectedHeader - Header text expected on the details page.
   * @example
   *   flow.openDraftAndAssertHeader('GREEN, Oliver', 'Mr Oliver GREEN');
   */
  openDraftAndAssertHeader(defendantName: string, expectedHeader: string): void {
    log('navigate', 'Opening draft and asserting header', { defendantName, expectedHeader });
    this.checker.openDefendant(defendantName);
    this.common.assertHeaderContains(expectedHeader);
  }

  /**
   * Asserts the page header and checker status heading together.
   * @param expectedHeader - Header text expected on the page.
   * @param expectedStatusHeading - Checker status heading (e.g., "To review").
   * @example
   *   flow.assertHeaderAndStatusHeading('Review accounts', 'To review');
   */
  assertHeaderAndStatusHeading(expectedHeader: string, expectedStatusHeading: string): void {
    log('assert', 'Asserting header and checker status heading', { expectedHeader, expectedStatusHeading });
    this.common.assertHeaderContains(expectedHeader);
    this.checker.assertStatusHeading(expectedStatusHeading);
  }

  /**
   * Asserts the review page header and status tag.
   * @param expectedHeader - Header text expected on the review page.
   * @param expectedStatus - Status tag text expected (e.g., "In review").
   */
  assertReviewHeaderAndStatus(expectedHeader: string, expectedStatus: string): void {
    log('assert', 'Asserting review header and status tag', { expectedHeader, expectedStatus });
    this.common.assertHeaderContains(expectedHeader);
    this.review.assertStatusTag(expectedStatus);
  }

  /**
   * Opens draft deletion from review and asserts the confirmation page is shown.
   * @example
   *   flow.deleteFromReviewAndAssertConfirmation();
   */
  deleteFromReviewAndAssertConfirmation(): void {
    log('navigate', 'Opening delete from review and asserting confirmation');
    this.review.openDeleteAccount();
    this.review.assertOnDeleteConfirmation();
  }

  /**
   * Orchestrates selecting an approve/reject decision and submitting the form.
   * @param decision - Decision to choose.
   * @param reason - Optional rejection reason (required for reject).
   * @returns Cypress chainable for the decision flow.
   */
  recordDecision(decision: Decision, reason?: string): Cypress.Chainable<void> {
    const normalized = decision.toLowerCase() as Decision;
    log('action', 'Recording checker decision (flow)', { decision: normalized, hasReason: Boolean(reason?.trim()) });
    const shouldCapturePayload = isEvidenceCaptureEnabled();
    const patchPayloads: RequestPayloadEntry[] = [];
    const normalizeEndpoint = (endpoint: string): string => {
      if (!endpoint) return '';
      try {
        const url = new URL(endpoint, 'http://placeholder.local');
        return url.pathname || endpoint;
      } catch {
        return endpoint;
      }
    };
    const toPayloadRecord = (value: unknown): Record<string, unknown> | null => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>;
      }
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>;
          }
        } catch {
          return null;
        }
      }
      return null;
    };
    if (shouldCapturePayload) {
      const draftAccountUrlPattern = /\/(?:opal-fines-service\/)?draft-accounts\/.*/;
      const capturePayload = (req: CyHttpMessages.IncomingHttpRequest) => {
        const endpoint = normalizeEndpoint(req.url ?? '');
        const method = req.method?.toUpperCase() || 'PATCH';
        const requestTimestamp = new Date().toISOString();
        const requestBody = toPayloadRecord(req.body);
        if (requestBody) {
          patchPayloads.push({
            source: 'ui',
            endpoint,
            method,
            timestamp: requestTimestamp,
            payload: requestBody,
            direction: 'request',
          });
        }
        logSync('intercept', 'Captured draft account mutation request', {
          endpoint,
          method,
          hasBody: Boolean(requestBody),
        });

        req.continue((res: CyHttpMessages.IncomingHttpResponse) => {
          const responseTimestamp = new Date().toISOString();
          const responsePayload = toPayloadRecord(res.body);
          const responseSummary: Record<string, unknown> = { ...(responsePayload ?? {}) };
          if (typeof res.statusCode === 'number') {
            responseSummary['status'] = res.statusCode;
          }
          const etagHeader =
            typeof res.headers?.['etag'] === 'string'
              ? res.headers['etag']
              : typeof res.headers?.['ETag'] === 'string'
                ? res.headers['ETag']
                : undefined;
          if (etagHeader) {
            responseSummary['etag'] = etagHeader;
          }
          if (responsePayload) {
            responseSummary['responseKeys'] = Object.keys(responsePayload);
          }
          patchPayloads.push({
            source: 'ui',
            endpoint,
            method,
            timestamp: responseTimestamp,
            payload: responseSummary,
            direction: 'response',
          });
          logSync('intercept', 'Captured draft account mutation response', {
            endpoint,
            method,
            status: res.statusCode,
            hasBody: Boolean(responsePayload),
          });
        });
      };

      cy.intercept({ method: 'PATCH', url: draftAccountUrlPattern, middleware: true }, capturePayload).as(
        'draftAccountMutation',
      );
      cy.intercept({ method: 'PUT', url: draftAccountUrlPattern, middleware: true }, capturePayload).as(
        'draftAccountMutation',
      );
    }
    this.review.selectDecision(normalized);
    if (normalized === 'reject') {
      if (!reason?.trim()) {
        throw new Error('Reject decision requires a reason');
      }
      this.review.enterRejectionReason(reason);
    }
    captureScenarioScreenshot('check-validate-decision-before-submit');
    this.review.submitDecision();
    const aliases = ((Cypress as any).state?.('aliases') ?? {}) as Record<string, unknown>;
    const expectsFailure =
      Boolean(aliases['draftDecisionExpectFailure']) || Cypress.env('draftDecisionExpectFailure') === true;
    if (expectsFailure) {
      log('info', 'Draft decision failure expected; skipping publish wait');
      Cypress.env('draftDecisionExpectFailure', false);
      if (aliases['draftDecisionExpectFailure']) {
        cy.wrap(false, { log: false }).as('draftDecisionExpectFailure');
      }
      if (aliases['patchDraftAccountError']) {
        return cy.wait('@patchDraftAccountError', { timeout: 15000 }).then(() =>
          cy.wrap(undefined, { log: false }),
        ) as Cypress.Chainable<void>;
      }
      return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
    }
    if (normalized === 'approve') {
      const hasPatchResponse = (): boolean => patchPayloads.some((entry) => entry.direction === 'response');
      const logPatchCaptureSummary = () => {
        if (!shouldCapturePayload) return;
        const requestCount = patchPayloads.filter((entry) => entry.direction === 'request').length;
        const responseCount = patchPayloads.filter((entry) => entry.direction === 'response').length;
        const lastEntry = patchPayloads[patchPayloads.length - 1];
        log('info', 'Draft account approval payload capture summary', {
          requestCount,
          responseCount,
          lastEndpoint: lastEntry?.endpoint,
          lastMethod: lastEntry?.method,
        });
        if (!responseCount) {
          log('warn', 'No draft account mutation response captured before evidence write');
        }
      };
      const waitForPatchPayloads = (): Cypress.Chainable<void> => {
        if (!shouldCapturePayload) {
          return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
        }
        return cy.wait('@draftAccountMutation', { timeout: 15000 }).then(() =>
          cy.wrap(null, { log: false }).then(
            () =>
              new Cypress.Promise<void>((resolve) => {
                const start = Date.now();
                const timeoutMs = 15000;
                const poll = () => {
                  if (hasPatchResponse()) {
                    resolve();
                    return;
                  }
                  if (Date.now() - start >= timeoutMs) {
                    resolve();
                    return;
                  }
                  setTimeout(poll, 200);
                };
                poll();
              }),
          ),
        ) as Cypress.Chainable<void>;
      };

      return waitForPatchPayloads()
        .then(() => logPatchCaptureSummary())
        .then(() => this.waitForPublishStatus(['Published', 'Publishing Pending', 'Legacy Response Pending']))
        .then(() => this.captureApprovedAccountEvidence(patchPayloads));
    }
    return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
  }
}
