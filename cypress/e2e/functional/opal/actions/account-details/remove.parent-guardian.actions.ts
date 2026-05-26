import { DOM_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.remove-parent-guardian.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('RemoveParentGuardianActions');

/**
 * Actions and assertions for the remove parent or guardian confirmation page.
 */
export class RemoveParentGuardianActions {
  private static readonly DEFAULT_TIMEOUT = 10_000;
  private readonly common = new CommonActions();

  /**
   * Normalizes visible text for resilient assertions.
   *
   * @param value - Raw text content.
   * @returns Lower-cased single-spaced text.
   */
  private normalize(value: string): string {
    return value.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  /**
   * Asserts the remove confirmation page is visible.
   *
   * @param expectedIdentifierText - Expected text fragment within the account identifier caption.
   */
  public assertOnRemoveParentGuardianConfirmation(expectedIdentifierText: string): void {
    log('assert', 'Remove parent or guardian confirmation page is visible', { expectedIdentifierText });
    cy.location('pathname', { timeout: this.common.getPathTimeout() }).should(
      'include',
      '/remove/non-paying/parent-guardian',
    );

    cy.get(L.headingWithCaption, { timeout: RemoveParentGuardianActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const actual = this.normalize(text);
        expect(actual).to.include(this.normalize(expectedIdentifierText));
        expect(text, 'caption should include an account/name separator').to.match(/[-–]/);
      });

    cy.get(L.title, { timeout: RemoveParentGuardianActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .should(($el) => {
        const text = this.normalize($el.text());
        expect(text).to.include('are you sure you want to remove the parent or guardian details?');
      });

    cy.get(L.removeButton, { timeout: RemoveParentGuardianActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .and('contain.text', 'Yes - remove');
    cy.contains(L.cancelLink, /^No - cancel$/i, { timeout: RemoveParentGuardianActions.DEFAULT_TIMEOUT }).should(
      'be.visible',
    );
  }

  /**
   * Confirms removal of the parent or guardian.
   */
  public confirmRemoval(): void {
    log('action', 'Confirming remove parent or guardian details');
    cy.get(L.removeButton, { timeout: RemoveParentGuardianActions.DEFAULT_TIMEOUT }).should('be.visible').click();
  }

  /**
   * Cancels removal of the parent or guardian.
   */
  public cancelRemoval(): void {
    log('action', 'Cancelling remove parent or guardian details');
    cy.contains(L.cancelLink, /^No - cancel$/i, { timeout: RemoveParentGuardianActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .click();
  }
}
