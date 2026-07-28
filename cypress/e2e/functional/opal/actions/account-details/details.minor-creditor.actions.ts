import { MINOR_CREDITOR_CREDITOR_DETAILS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.minor-creditor-creditor.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsMinorCreditorActions');

/** Actions for the Creditor tab summary on a minor creditor account. */
export class AccountDetailsMinorCreditorActions {
  private static readonly HEADER_SUMMARY_OVERRIDE_ALIAS = 'minorCreditorHeaderSummaryOverride';

  /**
   * Clicks the Creditor tab "Change" link and optionally waits for the amend form to appear.
   *
   * @param opts Optional behaviour overrides.
   * @param opts.timeout Max time to wait for elements (default 10_000ms).
   * @param opts.formSelector Optional selector to wait for after clicking Change.
   */
  public change(opts?: { timeout?: number; formSelector?: string }): void {
    const timeout = opts?.timeout ?? 10_000;

    log('action', 'Opening minor creditor amend form');
    cy.get(L.component, { timeout }).should('be.visible');
    cy.get(L.changeLink, { timeout }).should('be.visible').and('contain.text', 'Change').click({ force: true });

    if (opts?.formSelector) {
      cy.get(opts.formSelector, { timeout }).should('be.visible');
    }
  }

  /**
   * Asserts the minor creditor summary name contains the expected value.
   *
   * @param expected Text expected in the name row.
   */
  public assertNameContains(expected: string): void {
    log('assert', 'Asserting minor creditor name contains expected text', { expected });
    cy.get(L.nameRow, { timeout: 10_000 }).should('contain.text', expected);
  }

  /**
   * Asserts the Creditor tab section header contains expected text.
   *
   * @param expected Expected section header text.
   */
  public assertSectionHeader(expected: string): void {
    log('assert', 'Asserting minor creditor section header', { expected });
    cy.get(L.sectionHeading, { timeout: 10_000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => expect(text.trim().toLowerCase()).to.contain(expected.trim().toLowerCase()));
  }

  /**
   * Intercepts the minor creditor header summary response and overrides the awarded value.
   *
   * @param awardedValue - Numeric awarded value to return from the stubbed response.
   */
  public stubHeaderSummaryAwardedValue(awardedValue: number): void {
    log('intercept', 'Overriding minor creditor header summary awarded value', { awardedValue });

    cy.intercept('GET', '**/minor-creditor-accounts/*/header-summary', (req) => {
      req.continue((res) => {
        const body = res.body as { financials?: { awarded?: number } };

        if (!body?.financials) {
          throw new Error('Expected minor creditor header summary response to include financials');
        }

        body.financials.awarded = awardedValue;
        res.send({ body });
      });
    }).as(AccountDetailsMinorCreditorActions.HEADER_SUMMARY_OVERRIDE_ALIAS);
  }

  /**
   * Asserts the awarded value returned by the intercepted minor creditor header summary call.
   *
   * @param expectedAwardedValue - Expected numeric awarded value.
   */
  public assertHeaderSummaryAwardedValue(expectedAwardedValue: number): void {
    log('assert', 'Asserting minor creditor header summary awarded value', { awardedValue: expectedAwardedValue });

    cy.wait(`@${AccountDetailsMinorCreditorActions.HEADER_SUMMARY_OVERRIDE_ALIAS}`)
      .its('response.body.financials.awarded')
      .should('eq', expectedAwardedValue);
  }
}
