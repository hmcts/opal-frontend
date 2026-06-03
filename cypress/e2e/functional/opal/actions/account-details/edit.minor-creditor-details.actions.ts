import { MINOR_CREDITOR_AMEND_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.minor-creditor-amend.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('EditMinorCreditorDetailsActions');

/** Actions for the amend minor creditor details form. */
export class EditMinorCreditorDetailsActions {
  /**
   * Clears and sets a text input, supporting empty-string validation scenarios.
   *
   * @param selector Input selector to update.
   * @param value Value to set after clearing.
   * @param timeout Max time to wait for the field visibility.
   */
  private setTextInputValue(selector: string, value: string, timeout: number): void {
    cy.get(selector, { timeout }).should('be.visible').and('be.enabled').scrollIntoView().clear({ force: true });

    if (value) {
      cy.get(selector, { timeout }).type(value, { delay: 0, force: true });
    }

    cy.get(selector, { timeout }).blur().should('have.value', value);
  }

  /**
   * Ensures the amend form is still visible.
   */
  public assertStillOnEditPage(): void {
    log('assert', 'Asserting minor creditor amend form is visible');
    cy.get(L.form, { timeout: 10_000 }).should('be.visible');
  }

  /**
   * Verifies the amend route and page heading.
   *
   * @param opts Optional configuration.
   * @param opts.route Specific route segment to assert, default `amend`.
   * @param opts.timeout Timeout override for assertions.
   */
  public assertHeader(opts?: { route?: 'amend'; timeout?: number }): void {
    const timeout = opts?.timeout ?? 15_000;
    const routePart = opts?.route ?? 'amend';
    const routeRegex = new RegExp(`/fines/account/minor-creditor/\\d+/${routePart}$`, 'i');

    log('assert', 'Verifying minor creditor amend route');
    cy.location('pathname', { timeout }).should('match', routeRegex);

    log('assert', 'Verifying minor creditor page heading');
    cy.get(L.pageHeading, { timeout })
      .should('be.visible')
      .invoke('text')
      .then((text) => expect(String(text).split(/\s+/).join(' ').trim().toLowerCase()).to.contain('minor creditor details'));
  }

  /**
   * Updates the first names field.
   *
   * @param value Value to enter.
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility.
   */
  public editFirstNames(value: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('action', 'Editing minor creditor first names', { value });
    cy.get(L.form, { timeout }).should('be.visible');
    this.setTextInputValue(L.forenamesInput, value, timeout);
  }

  /**
   * Verifies the first names field value.
   *
   * @param expected Expected field value.
   * @param opts Optional configuration.
   * @param opts.timeout Max time to wait for the form/field visibility.
   */
  public verifyFirstName(expected: string, opts?: { timeout?: number }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('assert', 'Verifying minor creditor first names field value', { expected });
    cy.get(L.form, { timeout }).should('be.visible');
    cy.get(L.forenamesInput, { timeout }).should('be.visible').and('have.value', expected);
  }

  /**
   * Clicks Save changes on the amend form.
   */
  public saveChanges(): void {
    log('action', 'Saving minor creditor details');
    cy.get(L.submitButton, { timeout: 10_000 }).should('be.visible').click();
  }

  /**
   * Clicks the Cancel link on the amend form.
   */
  public clickCancelLink(): void {
    log('action', 'Clicking minor creditor cancel link');
    cy.get(L.cancelLink, { timeout: 10_000 }).should('be.visible').contains('Cancel').click();
  }

  /**
   * Asserts the error summary contains the expected message.
   *
   * @param expected Expected text within the error summary.
   */
  public assertErrorSummaryContains(expected: string): void {
    log('assert', 'Asserting minor creditor error summary contains expected text', { expected });
    cy.get(L.errorSummary, { timeout: 10_000 }).should('be.visible').and('contain.text', expected);
  }
}
