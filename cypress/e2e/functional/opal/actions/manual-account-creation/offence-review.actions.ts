/**
 * @fileoverview Actions for the Manual Account Creation **Offence review** page.
 * Provides helpers to assert offence/imposition tables, totals, and action links.
 */
import { ManualOffenceDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/offence-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

export class ManualOffenceReviewActions {
  private readonly common = new CommonActions();

  /**
   * Asserts the review page is displayed.
   * @param expectedHeader - Header text fragment to assert.
   */
  assertOnReviewPage(expectedHeader: string = 'Offences and impositions'): void {
    cy.location('pathname', { timeout: 20_000 }).should((path) => {
      expect(path).to.satisfy((p: string) => p.includes('/offence-details/review'));
    });
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  /**
   * Asserts the remove offence confirmation page is displayed for the offence.
   * @param offenceCode - Offence code caption shown in the confirmation summary.
   * @param expectedHeader - Header text fragment to assert.
   * @remarks Guards pathname and header to avoid stale assertions before interacting.
   */
  assertOnRemoveOffencePage(
    offenceCode: string,
    expectedHeader: string = 'Are you sure you want to remove this offence and all its impositions?',
  ): void {
    cy.location('pathname', { timeout: 20_000 }).should('include', '/offence-details/remove');
    this.common.assertHeaderContains(expectedHeader, 20_000);
    cy.contains(L.review.offenceCaption, offenceCode, this.common.getTimeoutOptions()).should('exist');
  }

  /**
   * Asserts the imposition table for an offence matches the expected data.
   * @param offenceCode - Offence code caption.
   * @param expectedRows - Table rows including header row.
   */
  assertOffenceTable(offenceCode: string, expectedRows: string[][]): void {
    log('assert', 'Validating offence table', { offenceCode, expectedRows });
    const [headers, ...rows] = expectedRows;

    this.getOffenceComponent(offenceCode)
      .find(L.review.impositionTable)
      .within(() => {
        cy.get('thead th').each((header, idx) => {
          cy.wrap(header)
            .invoke('text')
            .should((text) => expect(text.trim()).to.equal(headers[idx]));
        });

        cy.get('tbody tr').each((row, rowIdx) => {
          const expected = [...rows[rowIdx]];
          cy.wrap(row)
            .find('td, th')
            .each((cell, cellIdx) => {
              if (expected.length !== Cypress.$(cell).parent().children().length) {
                // Adjust for merged totals row (colspan=2) by dropping empty creditor placeholder
                if (expected[1] === '' && expected.length - 1 === Cypress.$(cell).parent().children().length) {
                  expected.splice(1, 1);
                }
              }
              cy.wrap(cell)
                .invoke('text')
                .should((text) => {
                  const actual = text.replace(/\s+/g, ' ').trim();
                  const expectedValue = expected[cellIdx];
                  if (!expectedValue) {
                    expect(actual).to.equal('');
                    return;
                  }
                  expect(actual).to.include(expectedValue);
                });
            });
        });
      });
  }

  /**
   * Asserts totals on the review page.
   * @param rows - Array of [label, value] pairs.
   */
  assertTotals(rows: string[][]): void {
    log('assert', 'Validating offence totals summary', { rows });
    cy.get(L.review.totalsSummaryList, this.common.getTimeoutOptions())
      .first()
      .within(() => {
        rows.forEach(([label, value], index) => {
          const expectedLabel = label.trim().toLowerCase() === 'balance' ? 'Balance remaining' : label;
          cy.get('div[summaryListRowId]')
            .eq(index)
            .within(() => {
              cy.get('ng-container[name], dt')
                .invoke('text')
                .should((text) => {
                  const actual = text.replace(/\s+/g, ' ').trim();
                  expect(actual).to.equal(expectedLabel);
                });
              cy.get('ng-container[value], dd')
                .invoke('text')
                .should((text) => expect(text.replace(/\s+/g, ' ').trim()).to.equal(value));
            });
        });
      });
  }

  /**
   * Clicks the Change action for an offence.
   * @param offenceCode - Offence code caption.
   */
  clickChangeOffence(offenceCode: string): void {
    log('navigate', 'Changing offence', { offenceCode });
    const component = this.getOffenceComponent(offenceCode);

    component.find('a#change', this.common.getTimeoutOptions()).then(($link) => {
      if ($link.length) {
        cy.wrap($link).scrollIntoView().click({ force: true });
        return;
      }

      component.contains('a', 'Change', this.common.getTimeoutOptions()).scrollIntoView().click({ force: true });
    });
  }

  /**
   * Clicks the Remove action for an offence.
   * @param offenceCode - Offence code caption.
   */
  clickRemoveOffence(offenceCode: string): void {
    log('navigate', 'Removing offence', { offenceCode });
    this.getOffenceComponent(offenceCode).then(($comp) => {
      const primary = $comp.find('a#remove').get(0);
      if (primary) {
        cy.wrap(primary).scrollIntoView().click({ force: true });
        return;
      }

      const fallback = Array.from($comp.find('a')).find((link) => {
        const text = (link.textContent || '').trim();
        return /remove offence/i.test(text) || /^remove$/i.test(text);
      });

      if (!fallback) {
        throw new Error(`Remove offence link not found for offence ${offenceCode}`);
      }

      cy.wrap(fallback).scrollIntoView().click({ force: true });
    });
  }

  /**
   * Confirms removal on the remove offence confirmation page.
   */
  confirmRemoveOffence(): void {
    log('click', 'Confirming offence removal');
    cy.get(L.removeOffence.confirmButton, this.common.getTimeoutOptions())
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Cancels removal on the remove offence confirmation page.
   */
  cancelRemoveOffence(): void {
    log('click', 'Cancelling offence removal');
    cy.get(L.removeOffence.cancelLink, this.common.getTimeoutOptions()).should('exist').click({ force: true });
  }

  /**
   * Toggles the offence details visibility.
   * @param offenceCode - Offence code caption.
   * @param action - "Show" or "Hide".
   */
  toggleOffence(offenceCode: string, action: 'Show' | 'Hide'): void {
    log('click', 'Toggling offence visibility', { offenceCode, action });
    this.getOffenceComponent(offenceCode)
      .contains('a', action, this.common.getTimeoutOptions())
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Clicks Add another offence on the review page.
   */
  clickAddAnotherOffence(): void {
    log('navigate', 'Adding another offence from review');
    cy.get(L.review.addAnotherOffenceButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Returns to Account details from review.
   */
  returnToAccountDetails(): void {
    log('navigate', 'Returning to account details from review');
    cy.get(L.review.returnToAccountDetailsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Clicks Add payment terms from the review page.
   */
  clickAddPaymentTerms(): void {
    log('navigate', 'Continuing to payment terms from review');
    cy.get(L.review.addPaymentTermsButton, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .click({ force: true });
  }

  /**
   * Asserts an offence is not present on the review page.
   * @param offenceCode - Offence code caption.
   */
  assertOffenceAbsent(offenceCode: string): void {
    log('assert', 'Ensuring offence is absent', { offenceCode });
    cy.contains(L.review.offenceCaption, offenceCode).should('not.exist');
  }

  /**
   * Asserts the order of Date of sentence summary rows.
   * @param formattedDates - Dates in the expected top-to-bottom order (dd MMMM yyyy).
   */
  assertDateOfSentenceOrder(formattedDates: string[]): void {
    log('assert', 'Checking date of sentence order', { formattedDates });
    cy.get('[summaryListId="dateOfSentence"] [summaryListRowId="dateOfSentence"]', this.common.getTimeoutOptions())
      .then((rows) => {
        const texts = this.extractDateRows(rows);
        expect(texts).to.include.members(formattedDates);
      })
      .then(() => {
        cy.get('[summaryListId="dateOfSentence"] [summaryListRowId="dateOfSentence"]')
          .should('have.length.at.least', formattedDates.length)
          .then((rowEls) => {
            const actualOrder = this.extractDateRows(rowEls);
            formattedDates.forEach((date, idx) => {
              expect(actualOrder[idx]).to.contain(date);
            });
          });
      });
  }

  private getOffenceComponent(offenceCode: string) {
    return cy
      .contains(L.review.offenceCaption, offenceCode, this.common.getTimeoutOptions())
      .parents(L.review.offenceComponent)
      .first();
  }

  /**
   * Normalizes summary list rows to just the date string (removes the "Date of sentence" label).
   */
  private extractDateRows(rowEls: JQuery<HTMLElement>): string[] {
    return Cypress.$(rowEls)
      .map((_idx, el) =>
        Cypress.$(el)
          .text()
          .replace(/\s+/g, ' ')
          .replace(/Date of sentence\s*/i, '')
          .trim(),
      )
      .get();
  }
}
