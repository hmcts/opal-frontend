/**
 * @fileoverview Actions for the Check and Validate draft account review pages.
 * Handles decision submission, delete confirmation, banners, and review history assertions.
 */
import { CheckAndValidateReviewLocators as L } from '../../../../../shared/selectors/check-and-validate-review.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export type Decision = 'approve' | 'reject';

const log = createScopedLogger('CheckAndValidateReviewActions');

/**
 * Encapsulates interactions on the checker review/detail pages for draft accounts.
 */
export class CheckAndValidateReviewActions {
  private readonly common = new CommonActions();

  /**
   * Asserts the status tag on the review page matches the expected text.
   * @param expected - Status label (e.g., "In review", "Rejected").
   */
  assertStatusTag(expected: string): void {
    log('assert', 'Checking review status tag', { expected });
    cy.get(L.statusTag, this.common.getTimeoutOptions())
      .should('be.visible')
      .invoke('text')
      .then((text) => expect(text.trim().toLowerCase()).to.include(expected.trim().toLowerCase()));
  }

  /**
   * Opens the delete account flow from the review page.
   */
  openDeleteAccount(): void {
    log('navigate', 'Opening delete account from review');
    cy.get(L.decision.deleteLink, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Asserts the delete confirmation page is shown.
   */
  assertOnDeleteConfirmation(): void {
    this.common.assertHeaderContains('Are you sure you want to delete this account?', this.common.getPathTimeout());
  }

  /**
   * Completes the delete confirmation form with a reason and submits it.
   * @param reason - Reason text to submit with deletion.
   */
  confirmDeletionWithReason(reason: string): void {
    if (!reason?.trim()) {
      throw new Error('Deletion reason is required');
    }
    log('action', 'Confirming draft deletion with reason', { reason });
    this.enterDeleteReason(reason);
    this.confirmDeletion();
  }

  /**
   * Enters a rejection reason on the review decision form.
   * @param reason - Reason text.
   */
  enterRejectionReason(reason: string): void {
    cy.get(L.decision.reasonInput, this.common.getTimeoutOptions())
      .scrollIntoView()
      .clear()
      .type(reason, { force: true })
      .should('have.value', reason);
  }

  /**
   * Submits the decision form.
   */
  submitDecision(): void {
    cy.get(L.decision.continueButton, this.common.getTimeoutOptions()).should('be.visible').click({ force: true });
  }

  /**
   * Populates the deletion reason field without submitting.
   * @param reason - Reason text.
   */
  enterDeleteReason(reason: string): void {
    cy.get(L.deleteConfirmation.reasonInput, this.common.getTimeoutOptions())
      .scrollIntoView()
      .clear()
      .type(reason, { force: true })
      .should('have.value', reason);
  }

  /**
   * Submits the delete confirmation form.
   */
  confirmDeletion(): void {
    cy.get(L.deleteConfirmation.confirmButton, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Cancels deletion, optionally confirming navigation away when prompted.
   * @param choice - "Ok" to leave or "Cancel" to stay.
   */
  cancelDeletion(choice: 'Ok' | 'Cancel'): void {
    const accept = choice.toLowerCase() === 'ok';
    log('navigate', 'Cancelling deletion', { choice });
    this.common.confirmNextUnsavedChanges(accept, /.*/);
    cy.get(L.deleteConfirmation.cancelLink, this.common.getTimeoutOptions())
      .should('be.visible')
      .click({ force: true });
  }

  /**
   * Asserts a timeline entry by position with expected title/description.
   * @param position - 1-based timeline position.
   * @param expectations - Map of expected fields (title, description).
   */
  assertTimelineEntry(position: number, expectations: Record<string, string>): void {
    if (position < 1) {
      throw new Error(`Timeline position must be >= 1, received ${position}`);
    }

    log('assert', 'Checking review timeline entry', { position, expectations });
    cy.get(L.timeline.items, this.common.getTimeoutOptions())
      .eq(position - 1)
      .scrollIntoView()
      .within(() => {
        const { title, description } = normalizeExpectations(expectations);
        if (title) {
          cy.get(L.timeline.title, this.common.getTimeoutOptions()).should('contain.text', title);
        }
        if (description) {
          cy.get(L.timeline.description, this.common.getTimeoutOptions()).should('contain.text', description);
        }
      });
  }

  /**
   * Asserts a success banner message is visible.
   * @param message - Expected banner text.
   */
  assertSuccessBanner(message: string): void {
    log('assert', 'Checking success banner', { message });
    cy.get(L.banner.success, this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        cy.get(L.banner.content, this.common.getTimeoutOptions()).should('contain.text', message);
      });
  }

  /**
   * Asserts the global error banner is shown.
   * @param expectedMessage - Optional expected text to match.
   */
  assertGlobalErrorBanner(expectedMessage?: string): void {
    log('assert', 'Checking global error banner', { expectedMessage });
    cy.get(L.banner.error, this.common.getTimeoutOptions())
      .should('be.visible')
      .should(($banner) => {
        const text = $banner.text().replace(/\s+/g, ' ').trim();
        if (expectedMessage) {
          expect(text.toLowerCase()).to.include(expectedMessage.toLowerCase());
        } else {
          expect(text.toLowerCase()).to.match(/problem|error/);
        }
      });
  }

  /**
   * Selects the approve or reject decision radio (no submit).
   * @param decision - Decision option.
   */
  selectDecision(decision: Decision): void {
    const selector = decision === 'approve' ? L.decision.approveRadio : L.decision.rejectRadio;
    const other = decision === 'approve' ? L.decision.rejectRadio : L.decision.approveRadio;
    cy.get(L.decision.group, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .within(() => {
        const labelText = decision === 'approve' ? 'Approve' : 'Reject';
        cy.contains('label.govuk-radios__label', labelText, this.common.getTimeoutOptions())
          .scrollIntoView()
          .click({ force: true });

        cy.get(selector).should('have.prop', 'checked', true);
        cy.get(other).should('have.prop', 'checked', false);
      });
  }
}

/**
 * Normalises expectation keys to lower case for matching.
 */
function normalizeExpectations(expectations: Record<string, string>): { title?: string; description?: string } {
  const entries = Object.entries(expectations).map(([key, value]) => [key.trim().toLowerCase(), value.trim()]);
  const map = Object.fromEntries(entries);
  return {
    title: map['title'],
    description: map['description'],
  };
}
