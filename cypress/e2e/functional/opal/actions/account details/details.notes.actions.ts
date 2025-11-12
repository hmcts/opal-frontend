import { AccountDetailsNotesLocators as L } from '../../../../../shared/selectors/accountDetails/account.notes.details.locators';

export class AccountDetailsNotesActions {
  /**
   * Type an account note into the textarea.
   *
   * @param note - Text to enter into the "Add account note" textarea.
   * @param options - Optional configuration (set `{ clear: false }` to append instead of clearing).
   */
  public enterAccountNote(note: string, options?: { clear?: boolean }): void {
    const shouldClear = options?.clear !== false;

    cy.get(L.form).within(() => {
      const $area = cy.get(L.fields.noteTextArea).should('be.visible').and('have.attr', 'maxlength', '1000');

      if (shouldClear) {
        $area.clear();
      }

      $area.type(note);
    });
  }

  /**
   * Click the "Save note" button to submit the form.
   */
  public save(): void {
    cy.get(L.actions.saveNoteButton).should('be.visible').and('not.be.disabled').click();
  }
}
