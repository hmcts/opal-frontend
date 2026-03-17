import { AccountConvertLocators as L } from '../../../../../shared/selectors/account-details/account.convert.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

const log = createScopedLogger('AccountConvertActions');

/** Actions and assertions for the convert-account confirmation page. */
export class AccountConvertActions {
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
   * Asserts the convert-to-company confirmation page content.
   *
   * @param expectedCaptionName - Expected defendant name in the page caption.
   */
  public assertOnConvertToCompanyConfirmation(expectedCaptionName: string): void {
    log('assert', 'Convert to company confirmation page is visible', { expectedCaptionName });
    cy.location('pathname', { timeout: this.common.getPathTimeout() }).should('include', '/convert/company');

    cy.get(L.page.caption, { timeout: AccountConvertActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const actual = this.normalize(text);
        expect(actual).to.include(this.normalize(expectedCaptionName));
        expect(actual).to.include('-');
      });

    cy.get(L.page.header, { timeout: AccountConvertActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .should(($el) => {
        const text = this.normalize($el.text());
        expect(text).to.include('are you sure you want to convert this account to a company account?');
      });

    cy.get(L.page.warningText, { timeout: AccountConvertActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .should(($el) => {
        const text = this.normalize($el.text());
        expect(text).to.include(
          this.normalize('Certain data related to individual accounts, such as employment details, will be removed.'),
        );
      });

    cy.get(L.page.confirmButton, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('exist');
    cy.get(L.page.cancelLink, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('exist');
  }

  /**
   * Asserts the convert-to-individual confirmation page content.
   *
   * @param expectedCaptionName - Expected company name in the page caption.
   */
  public assertOnConvertToIndividualConfirmation(expectedCaptionName: string): void {
    log('assert', 'Convert to individual confirmation page is visible', { expectedCaptionName });
    cy.location('pathname', { timeout: this.common.getPathTimeout() }).should('include', '/convert/individual');

    cy.get(L.page.caption, { timeout: AccountConvertActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const actual = this.normalize(text);
        expect(actual).to.include(this.normalize(expectedCaptionName));
        expect(actual).to.include('-');
      });

    cy.get(L.page.header, { timeout: AccountConvertActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .should(($el) => {
        const text = this.normalize($el.text());
        expect(text).to.include('are you sure you want to convert this account to an individual account?');
      });

    cy.get(L.page.warningText, { timeout: AccountConvertActions.DEFAULT_TIMEOUT })
      .should('be.visible')
      .should(($el) => {
        const text = this.normalize($el.text());
        expect(text).to.include(
          this.normalize('Some information specific to company accounts, such as company name, will be removed.'),
        );
      });

    cy.get(L.page.confirmButton, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('exist');
    cy.get(L.page.cancelLink, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('exist');
  }

  /**
   * Clicks the confirmation button to continue to Company details.
   */
  public confirmConvertToCompany(): void {
    log('action', 'Confirming account conversion to company');
    cy.get(L.page.confirmButton, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('be.visible').click();
  }

  /**
   * Clicks the cancel link to return to Defendant details.
   */
  public cancelConvertToCompany(): void {
    log('action', 'Cancelling account conversion to company');
    cy.get(L.page.cancelLink, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('be.visible').click();
  }

  /**
   * Clicks the confirmation button to continue to Defendant details.
   */
  public confirmConvertToIndividual(): void {
    log('action', 'Confirming account conversion to individual');
    cy.get(L.page.confirmButton, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('be.visible').click();
  }

  /**
   * Clicks the cancel link to return to Defendant details.
   */
  public cancelConvertToIndividual(): void {
    log('action', 'Cancelling account conversion to individual');
    cy.get(L.page.cancelLink, { timeout: AccountConvertActions.DEFAULT_TIMEOUT }).should('be.visible').click();
  }
}
