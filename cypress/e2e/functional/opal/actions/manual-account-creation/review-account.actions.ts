import { ManualReviewAccountLocators as L } from '../../../../../shared/selectors/manual-account-creation/review-account.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

type SummaryRow = { label: string; value: string };
type OffenceRow = {
  imposition: string;
  creditor: string;
  amountImposed: string;
  amountPaid: string;
  balanceRemaining: string;
};

  /**
   * Actions for the Manual Account Creation **Check account details** screen.
   */
  export class ManualReviewAccountActions {
  private readonly common = new CommonActions();
  private readonly pathTimeout = this.common.getPathTimeout();

  /**
   * @description Clicks the Check account button from Account details.
   * @example
   *   review.clickCheckAccount();
   */
  clickCheckAccount(): void {
    log('navigate', 'Opening Check account details from task list');
    cy.get(L.checkAccountButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * @description Asserts the review page header contains the expected text.
   * @param expectedHeader - Header fragment to assert.
   * @example
   *   review.assertOnReviewPage('Check account details');
   */
  assertOnReviewPage(expectedHeader: string = 'Check account details'): void {
    cy.location('pathname', { timeout: this.pathTimeout }).should((path) => {
      expect(path).to.match(/(check-account|review-account)/i);
    });
    this.common.assertHeaderContains(expectedHeader, this.pathTimeout);
  }

  /**
   * @description Asserts summary list rows by label/value for a given summary list id.
   * @param summaryListId - The summaryListId attribute rendered on the page.
   * @param rows - Label/value expectations.
   * @example
   *   review.assertSummaryList('courtDetails', [{ label: 'Prosecutor Case Reference (PCR)', value: 'ABCD1234A' }]);
   */
  assertSummaryList(summaryListId: string, rows: SummaryRow[]): void {
    log('assert', 'Asserting review summary list', { summaryListId, rows });
    if (!rows.length) {
      return;
    }

    cy.get(L.summaryList(summaryListId), this.common.getTimeoutOptions())
      .should('be.visible')
      .within(() => {
        rows.forEach(({ label, value }) => {
          cy.contains(L.summaryRow, label, this.common.getTimeoutOptions())
            .should('be.visible')
            .within(() => {
              cy.get(L.summaryValue, this.common.getTimeoutOptions()).should('contain.text', value);
            });
        });
      });
  }

  /**
   * @description Asserts offence/imposition rows on the review page.
   * @param rows - Ordered offence rows; the Totals row is handled automatically.
   * @example
   *   review.assertOffenceTable([
   *     {
   *       imposition: 'Compensation',
   *       creditor: 'HMCTS',
   *       amountImposed: '£100.00',
   *       amountPaid: '£50.00',
   *       balanceRemaining: '£50.00',
   *     },
   *   ]);
   */
  assertOffenceTable(rows: OffenceRow[]): void {
    log('assert', 'Asserting offences and impositions table', { rows });
    if (!rows.length) {
      return;
    }

    const detailRows = rows.filter((row) => !/totals/i.test(row.imposition));
    detailRows.forEach((row, index) => {
      cy.get(L.offences.impositionCells, this.common.getTimeoutOptions()).eq(index).should('contain.text', row.imposition);
      cy.get(L.offences.creditorCells, this.common.getTimeoutOptions()).eq(index).should('contain.text', row.creditor);
      cy.get(L.offences.amountImposedCells, this.common.getTimeoutOptions())
        .eq(index)
        .should('contain.text', row.amountImposed);
      cy.get(L.offences.amountPaidCells, this.common.getTimeoutOptions()).eq(index).should('contain.text', row.amountPaid);
      cy.get(L.offences.balanceRemainingCells, this.common.getTimeoutOptions())
        .eq(index)
        .should('contain.text', row.balanceRemaining);
    });

    const totalsRow = rows.find((row) => /totals/i.test(row.imposition));
    if (totalsRow) {
      cy.get(L.offences.totals.heading, this.common.getTimeoutOptions()).should('contain.text', 'Totals');
      cy.get(L.offences.totals.amountImposed, this.common.getTimeoutOptions()).should(
        'contain.text',
        totalsRow.amountImposed,
      );
      cy.get(L.offences.totals.amountPaid, this.common.getTimeoutOptions()).should('contain.text', totalsRow.amountPaid);
      cy.get(L.offences.totals.balanceRemaining, this.common.getTimeoutOptions()).should(
        'contain.text',
        totalsRow.balanceRemaining,
      );
    }
  }

  /**
   * @description Expands minor creditor details if the summary list is hidden.
   */
  private ensureMinorCreditorDetailsVisible(): void {
    cy.get('body').then(($body) => {
      const summaryExists = $body.find(L.summaryList(L.offences.minorCreditorSummaryId)).length > 0;
      if (summaryExists) {
        return;
      }
      const toggle = $body.find(L.offences.minorCreditorToggle);
      if (toggle.length) {
        cy.contains(L.offences.minorCreditorToggle, /show details/i, this.common.getTimeoutOptions())
          .scrollIntoView()
          .click({ force: true });
      }
    });
  }

  /**
   * @description Asserts the minor creditor summary list.
   * @param rows - Label/value expectations.
   * @example
   *   review.assertMinorCreditorDetails([{ label: 'Payment method', value: 'Pay by BACS' }]);
   */
  assertMinorCreditorDetails(rows: SummaryRow[]): void {
    log('assert', 'Asserting minor creditor summary', { rows });
    this.ensureMinorCreditorDetailsVisible();
    this.assertSummaryList(L.offences.minorCreditorSummaryId, rows);
  }

  /**
   * @description Clicks Submit for review on the review page.
   * @example
   *   review.submitForReview();
   */
  submitForReview(): void {
    log('navigate', 'Submitting manual account for review');
    cy.get(L.submitForReviewButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }
}
