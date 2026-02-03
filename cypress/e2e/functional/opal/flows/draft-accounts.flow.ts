/**
 * @file Draft accounts flows shared across checker/inputter views.
 * @description Coordinates navigation and assertions across Create/Manage and Check/Validate draft flows,
 * keeping Cucumber steps thin and delegating to shared draft actions.
 */
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { CheckAndValidateDraftsActions } from '../actions/draft-account/check-and-validate-drafts.actions';
import {
  CheckAndValidateReviewActions,
  type Decision,
} from '../actions/draft-account/check-and-validate-review.actions';
import { CommonActions } from '../actions/common/common.actions';
import { DashboardActions } from '../actions/dashboard.actions';
import { recordCreatedAccount } from '../../../../support/utils/accountCapture';
import { captureScenarioScreenshot } from '../../../../support/utils/screenshot';

const log = createScopedLogger('DraftAccountsFlow');

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
   * @returns Cypress chainable for the capture task.
   */
  private captureApprovedAccountEvidence(): Cypress.Chainable<void> {
    return cy.get<number>('@lastCreatedDraftId').then((accountId) =>
      cy
        .request({
          method: 'GET',
          url: `/opal-fines-service/draft-accounts/${accountId}`,
          failOnStatusCode: false,
        })
        .then((response) => {
          const body = this.isRecord(response.body) ? response.body : {};
          const statusValue = typeof body['account_status'] === 'string' ? body['account_status'] : undefined;
          const accountType = typeof body['account_type'] === 'string' ? body['account_type'] : 'draft';
          const accountNumber =
            typeof body['account_number'] === 'string'
              ? body['account_number']
              : this.isRecord(body['account']) && typeof body['account']['account_number'] === 'string'
                ? body['account']['account_number']
                : undefined;
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
            updatedAt,
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
    this.review.selectDecision(normalized);
    if (normalized === 'reject') {
      if (!reason?.trim()) {
        throw new Error('Reject decision requires a reason');
      }
      this.review.enterRejectionReason(reason);
    }
    captureScenarioScreenshot('check-validate-decision-before-submit');
    this.review.submitDecision();
    if (normalized === 'approve') {
      return this.waitForPublishStatus(['Published', 'Publishing Pending', 'Legacy Response Pending']).then(() =>
        this.captureApprovedAccountEvidence(),
      );
    }
    return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
  }
}
