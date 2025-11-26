import { ManualAccountCommentsNotesLocators as L } from '../../../../../shared/selectors/manual-account-creation/account-comments-notes.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common.actions';

type CancelChoice = 'Cancel' | 'Ok' | 'Stay' | 'Leave';

export class ManualAccountCommentsNotesActions {
  private readonly common = new CommonActions();

  /**
   * Asserts the page header contains the expected text.
   */
  assertHeader(expected: string = 'Account comments and notes'): void {
    this.common.assertHeaderContains(expected);
  }

  /**
   * Sets the comment textarea value.
   */
  setComment(comment: string): void {
    log('type', 'Setting account comment', { comment });
    cy.get(L.commentInput, this.common.getTimeoutOptions()).should('be.visible').clear({ force: true }).type(comment, {
      delay: 0,
    });
  }

  /**
   * Sets the notes textarea value.
   */
  setNote(note: string): void {
    log('type', 'Setting account note', { note });
    cy.get(L.noteInput, this.common.getTimeoutOptions()).should('be.visible').clear({ force: true }).type(note, {
      delay: 0,
    });
  }

  /**
   * Asserts the comment textarea matches the expected value.
   */
  assertCommentValue(expected: string): void {
    log('assert', 'Asserting account comment value', { expected });
    cy.get(L.commentInput, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Asserts the notes textarea matches the expected value.
   */
  assertNoteValue(expected: string): void {
    log('assert', 'Asserting account note value', { expected });
    cy.get(L.noteInput, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Clicks the Review and submit CTA.
   */
  clickReviewAndSubmit(): void {
    log('navigate', 'Opening review and submit from comments/notes');
    cy.get(L.reviewAndSubmitButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Handles Cancel click and resolves the unsaved changes dialog.
   */
  cancelAndChoose(choice: CancelChoice): void {
    const accept = /ok|leave/i.test(choice);
    log('cancel', 'Handling cancel on comments/notes', { choice, accept });

    this.common.confirmNextUnsavedChanges(accept);
    cy.get(L.cancelLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Asserts the Review and submit CTA is visible.
   */
  assertReviewAndSubmitVisible(): void {
    log('assert', 'Review and submit CTA visible');
    cy.get(L.reviewAndSubmitButton, this.common.getTimeoutOptions()).should('be.visible');
  }
}
