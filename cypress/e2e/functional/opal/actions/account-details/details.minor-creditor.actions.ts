import { MINOR_CREDITOR_CREDITOR_DETAILS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.minor-creditor-creditor.locators';
import { ACCOUNT_ENQUIRY_HEADER_ELEMENTS as H } from '../../../../../shared/selectors/account-enquiry/account.enquiry.header.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsMinorCreditorActions');

/** Actions for the Creditor tab summary on a minor creditor account. */
export class AccountDetailsMinorCreditorActions {
  private static readonly HEADER_SUMMARY_OVERRIDE_ALIAS = 'minorCreditorHeaderSummaryOverride';
  private static readonly REPAYMENT_HEADER_SUMMARY_OVERRIDE_ALIAS = 'minorCreditorRepaymentHeaderSummaryOverride';

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

  /**
   * Stubs the header-summary response as a repayment Minor Creditor account.
   *
   * This keeps the E2E journey focused on the frontend contract while repayment
   * account seeding is unavailable.
   *
   * @param paidOutValue The paid out amount returned by the header-summary API.
   */
  public stubHeaderSummaryRepayment(paidOutValue: number): void {
    log('intercept', 'Overriding minor creditor header summary as a repayment', { paidOutValue });

    cy.intercept('GET', '**/minor-creditor-accounts/*/header-summary', (req) => {
      req.continue((res) => {
        const body = res.body as {
          repayment?: boolean;
          creditor?: { has_associated_defendant?: boolean };
          financials?: { paid_out?: number };
        };

        if (!body?.creditor || !body.financials) {
          throw new Error('Expected minor creditor header summary response to include creditor and financials');
        }

        body.repayment = true;
        body.creditor.has_associated_defendant = false;
        body.financials.paid_out = paidOutValue;
        res.send({ body });
      });
    }).as(AccountDetailsMinorCreditorActions.REPAYMENT_HEADER_SUMMARY_OVERRIDE_ALIAS);
  }

  /**
   * Asserts that the intercepted header-summary response has the repayment contract.
   *
   * @param paidOutValue The expected paid out amount in the header-summary API response.
   */
  public assertHeaderSummaryRepayment(paidOutValue: number): void {
    log('assert', 'Asserting minor creditor repayment header summary response', { paidOutValue });

    cy.wait(`@${AccountDetailsMinorCreditorActions.REPAYMENT_HEADER_SUMMARY_OVERRIDE_ALIAS}`)
      .its('response.body')
      .should((body) => {
        expect(body.repayment, 'repayment flag').to.equal(true);
        expect(body.creditor.has_associated_defendant, 'associated defendant flag').to.equal(false);
        expect(body.financials.paid_out, 'paid out amount').to.equal(paidOutValue);
      });
  }

  /**
   * Asserts the repayment-specific one-tile financial summary.
   *
   * @param paidOutValue The formatted paid out amount displayed in the summary tile.
   */
  public assertRepaymentSummaryMetric(paidOutValue: string): void {
    log('assert', 'Asserting repayment Minor Creditor summary metric', { paidOutValue });

    cy.get(H.summaryMetricBar, { timeout: 15000 }).within(() => {
      cy.get(H.summaryMetricBarItem).should('have.length', 1);
      cy.contains(H.labelPaidOut)
        .should('be.visible')
        .closest(H.summaryMetricBarItem)
        .should('contain.text', paidOutValue);
      cy.contains(H.labelAwarded).should('not.exist');
      cy.contains(H.labelAwaitingPayout).should('not.exist');
      cy.contains(H.labelOutstanding).should('not.exist');
    });
  }
}
