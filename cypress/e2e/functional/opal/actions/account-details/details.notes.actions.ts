import { AccountDetailsNotesLocators as L } from '../../../../../shared/selectors/account-details/account.notes.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsNotesActions');

/**
 * Actions for account notes add/view screens.
 */
export class AccountDetailsNotesActions {
  private static readonly DEFAULT_TIMEOUT = 15000;

  private readonly normalize = (s: string): string => s.replaceAll('  ', ' ').trim().toLowerCase();

  /**
   * Waits for the Add Note view and asserts the header (caption excluded).
   * @param expected - Expected text to be contained within the header.
   * @param timeoutMs - Timeout override for locating elements.
   */
  public assertHeaderContains(expected: string, timeoutMs: number = AccountDetailsNotesActions.DEFAULT_TIMEOUT): void {
    log('assert', `Header contains: ${expected}`);

    cy.location('pathname', { timeout: timeoutMs }).should('include', '/note/add');
    cy.get(L.fields.noteTextArea, { timeout: timeoutMs }).should('be.visible');

    cy.get(L.header, { timeout: timeoutMs }).should(($h1) => {
      const headingOnly = $h1.clone().find('.govuk-caption-l').remove().end().text();

      expect(this.normalize(headingOnly)).to.include(this.normalize(expected));
    });
  }

  /**
   * Type an account note into the textarea.
   *
   * @param note - Text to enter into the "Add account note" textarea.
   * @param options - Optional configuration (set `{ clear: false }` to append instead of clearing).
   * @param options.clear - Whether to clear the field before typing (default: true).
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

  /**
   * Asserts the note textarea currently equals the provided text.
   * Keeps DOM access inside Actions (flows remain locator-free).
   * @param text - Expected textarea value.
   */
  public assertNoteValueEquals(text: string): void {
    cy.get(L.fields.noteTextArea, { timeout: 10000 })
      .should('be.visible')
      .invoke('val')
      .then((val) => {
        const actual = (val ?? '').toString();
        expect(actual).to.eq(text);
      });
  }
}
