/**
 * @file fixed-penalty.flow.ts
 * @description Flow helpers for the Fixed Penalty journey (Manual Account Creation), orchestrating
 * dashboard navigation, details entry, review, and submission helpers.
 */
import { DashboardActions } from '../actions/dashboard.actions';
import { DefendantType, ManualCreateAccountActions } from '../actions/manual-account-creation/create-account.actions';
import { FixedPenaltyDetailsActions } from '../actions/manual-account-creation/fixed-penalty-details.actions';
import { FixedPenaltyReviewActions } from '../actions/manual-account-creation/fixed-penalty-review.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { ManualCreateOrTransferInActions } from '../actions/manual-account-creation/create-transfer.actions';

const log = createScopedLogger('FixedPenaltyFlow');

/**
 * Flow helpers for the Fixed Penalty journey.
 */
export class FixedPenaltyFlow {
  private readonly dashboard = new DashboardActions();
  private readonly originatorType = new ManualCreateOrTransferInActions();
  private readonly createAccount = new ManualCreateAccountActions();
  private readonly details = new FixedPenaltyDetailsActions();
  private readonly review = new FixedPenaltyReviewActions();
  /**
   * Starts a Fixed Penalty account from the dashboard.
   * @param businessUnit - Business unit to select.
   * @param defendantType - Defendant type option to choose.
   * @param originatorType - Originator type option to choose.
   */
  startFixedPenaltyAccount(
    businessUnit: string,
    defendantType: DefendantType,
    originatorType: 'New' | 'Transfer in',
  ): void {
    log('flow', 'Starting Fixed Penalty account', { businessUnit, defendantType });
    this.dashboard.assertDashboard();
    this.dashboard.goToManualAccountCreation();
    this.originatorType.assertOnCreateOrTransferInPage();
    this.originatorType.selectOriginatorType(originatorType);
    this.originatorType.continueToCreateAccount();
    this.createAccount.selectBusinessUnit(businessUnit);
    this.createAccount.selectAccountType('Fixed Penalty');
    this.createAccount.selectDefendantType(defendantType);
    this.createAccount.continueToAccountDetails();
    this.details.assertOnDetailsPage();
  }

  /**
   * Completes the Fixed Penalty details form from a composite table.
   * @param rows - Raw DataTable rows including headers.
   */
  completeDetailsFromTable(rows: string[][]): void {
    this.details.assertOnDetailsPage();
    this.details.fillFromTable(rows);
  }

  /**
   * Proceeds to the review page from Fixed Penalty details.
   */
  goToReview(): void {
    this.details.reviewAccount();
    this.review.assertOnReviewPage();
  }

  /**
   * Attempts to proceed to review but expects to remain on the details page due to validation errors.
   */
  attemptReviewExpectingErrors(): void {
    this.details.reviewAccount();
    this.details.assertOnDetailsPage();
  }

  /**
   * Opens a Change link from review and asserts the details page is shown.
   * @param section - Section label to change.
   */
  openChangeAndReturnToReview(section: string): void {
    this.review.openChangeLink(section);
    this.details.assertOnDetailsPage();
    this.details.reviewAccount();
    this.review.assertOnReviewPage();
  }

  /**
   * Navigates back from review to Fixed Penalty details.
   */
  goBackFromReview(): void {
    this.review.goBackToDetails();
    this.details.assertOnDetailsPage();
  }

  /**
   * Submit for review.
   */
  submitForReview(): void {
    this.review.submitForReview();
  }

  /**
   * Submit for review and captures the created account id.
   */
  submitForReviewAndCapture(): void {
    this.review.submitForReviewAndCapture();
  }

  /**
   * Stubs submit-for-review to return an error status.
   * @param statusCode - Status code to stub.
   */
  stubSubmitError(statusCode: number): void {
    this.review.stubSubmitError(statusCode);
  }
}
