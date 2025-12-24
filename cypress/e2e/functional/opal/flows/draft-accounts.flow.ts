/**
 * @fileoverview Draft accounts flows shared across checker/inputter views.
 */
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { CheckAndValidateDraftsActions } from '../actions/draft-account/check-and-validate-drafts.actions';
import {
  CheckAndValidateReviewActions,
  type Decision,
} from '../actions/draft-account/check-and-validate-review.actions';
import { CommonActions } from '../actions/common/common.actions';
import { DashboardActions } from '../actions/dashboard.actions';

const log = createScopedLogger('DraftAccountsFlow');

/**
 * Flow helpers that orchestrate draft account actions.
 */
export class DraftAccountsFlow {
  private readonly dashboard = new DashboardActions();
  private readonly checker = new CheckAndValidateDraftsActions();
  private readonly review = new CheckAndValidateReviewActions();
  private readonly common = new CommonActions();

  /**
   * Opens Check and Validate Draft Accounts and asserts the review header.
   * @example
   *   flow.openCheckAndValidateWithHeader();
   */
  openCheckAndValidateWithHeader(): void {
    log('navigate', 'Opening Check and Validate with header assertion');
    this.dashboard.goToCheckAndValidateDraftAccounts();
    this.common.assertHeaderContains('Review accounts');
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
   */
  recordDecision(decision: Decision, reason?: string): void {
    const normalized = decision.toLowerCase() as Decision;
    log('action', 'Recording checker decision (flow)', { decision: normalized, hasReason: Boolean(reason?.trim()) });
    this.review.selectDecision(normalized);
    if (normalized === 'reject') {
      if (!reason?.trim()) {
        throw new Error('Reject decision requires a reason');
      }
      this.review.enterRejectionReason(reason);
    }
    this.review.submitDecision();
  }
}
