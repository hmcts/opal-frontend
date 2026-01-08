/**
 * @file Actions for Manual Account Creation - Fixed Penalty review page.
 * @description Encapsulates summary assertions, change-link navigation, submission, and error handling.
 */
import { ManualReviewAccountActions } from './review-account.actions';
import { FixedPenaltyReviewLocators as L } from '../../../../../shared/selectors/manual-account-creation/fixed-penalty.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';
import { aliasDraftAccountPut, readDraftIdFromBody, recordCreatedId } from '../../../../../support/draftAccounts';

type SummaryRow = { label: string; value: string };

const log = createScopedLogger('FixedPenaltyReviewActions');
const GLOBAL_ERROR_MESSAGE = 'You can try again. If the problem persists, contact the service desk.';

/**
 * Actions for the Fixed Penalty review/check account page.
 */
export class FixedPenaltyReviewActions {
  private readonly common = new CommonActions();
  private readonly review = new ManualReviewAccountActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * Asserts the Fixed Penalty review page is visible.
   */
  assertOnReviewPage(): void {
    this.review.assertOnReviewPage('Check fixed penalty account details');
  }

  /**
   * Asserts a summary list section using label/value pairs.
   * @param section - Human-friendly section name (e.g., "Court details").
   * @param rows - Label/value rows to assert.
   */
  assertSummary(section: string, rows: SummaryRow[]): void {
    const summaryListId = this.resolveSummaryListId(section);
    log('assert', 'Asserting Fixed Penalty summary list', { section, summaryListId, rows });
    this.review.assertSummaryList(summaryListId, rows);
  }

  /**
   * Clicks a Change link for the given summary section.
   * @param section - Section label (e.g., "Offence details").
   */
  openChangeLink(section: string): void {
    const cardId = this.resolveSummaryCardId(section);
    log('navigate', 'Opening Change link from review', { section, cardId });
    cy.get(L.changeLink(cardId), this.common.getTimeoutOptions()).should('exist').click({ force: true });
  }

  /**
   * Clicks the Back link to return to Fixed Penalty details.
   */
  goBackToDetails(): void {
    cy.get(L.backLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Clicks the Delete account link on the review page.
   */
  openDeleteAccount(): void {
    cy.get(L.deleteAccountLink, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Cancels deletion on the confirmation page.
   */
  cancelDeletion(): void {
    cy.contains('a', /No - cancel/i, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Submits the Fixed Penalty account for review.
   */
  submitForReview(): void {
    this.review.submitForReview();
  }

  /**
   * Submits for review and captures the created draft account id for cleanup.
   */
  submitForReviewAndCapture(): void {
    cy.intercept('POST', '/opal-fines-service/draft-accounts').as('createAccount');
    this.submitForReview();
    cy.wait('@createAccount').then(({ response }) => {
      expect(response, 'POST /draft-accounts response').to.exist;
      expect(response!.statusCode, 'POST /draft-accounts status').to.equal(201);
      const id = readDraftIdFromBody(response!.body as unknown);
      recordCreatedId(id);
      aliasDraftAccountPut();
      cy.log(`Created Account ID: ${id}`);
    });
  }

  /**
   * Stubs the submit-for-review call to return a specific error status.
   * @param statusCode - HTTP status to return (e.g., 400).
   */
  stubSubmitError(statusCode: number): void {
    cy.intercept('POST', '/opal-fines-service/draft-accounts', {
      statusCode,
      body: { error: 'Bad Request', message: 'Invalid request data' },
    }).as('postDraftAccountError');
  }

  /**
   * Asserts the global error banner is visible.
   */
  assertGlobalErrorBanner(): void {
    cy.get(L.globalErrorBanner, this.common.getTimeoutOptions())
      .should('exist')
      .and('contain.text', GLOBAL_ERROR_MESSAGE);
  }

  /**
   * Asserts the delete confirmation page header.
   */
  assertOnDeleteConfirmation(): void {
    this.common.assertHeaderContains('Are you sure you want to delete this account?', this.pathTimeout);
  }

  /**
   * Resolves a human-friendly section name to the summary list id.
   * @param section - Section label (e.g., "Personal details").
   * @returns summaryListId used by the DOM.
   */
  private resolveSummaryListId(section: string): string {
    const normalized = section.trim().toLowerCase();
    if (normalized.includes('court')) return 'courtDetails';
    if (normalized.includes('company')) return 'companyDetails';
    if (normalized.includes('personal') || normalized.includes('defendant')) return 'personalDetails';
    if (normalized.includes('offence')) return 'fpOffenceDetails';
    if (normalized.includes('account comments') || normalized.includes('notes')) return 'accountCommentsAndNotes';
    throw new Error(`Unsupported summary section: ${section}`);
  }

  /**
   * Resolves a human-friendly section name to the summary card id.
   * @param section - Section label (e.g., "Offence details").
   * @returns summaryCardId used by the DOM.
   */
  private resolveSummaryCardId(section: string): string {
    const normalized = section.trim().toLowerCase();
    if (normalized.includes('court')) return 'court-details';
    if (normalized.includes('company')) return 'company-details';
    if (normalized.includes('personal') || normalized.includes('defendant')) return 'personal-details';
    if (normalized.includes('offence')) return 'fp-offence-details';
    if (normalized.includes('account comments') || normalized.includes('notes')) return 'account-comments-and-notes';
    throw new Error(`Unsupported summary card: ${section}`);
  }
}
