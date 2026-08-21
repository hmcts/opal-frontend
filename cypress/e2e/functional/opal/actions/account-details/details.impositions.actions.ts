import { AccountImpositionsDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.impositions.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsImpositionsActions');

const normalizeTableText = (value: string): string =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const resolveExpectedTableValue = (value: string): string => {
  const normalizedValue = normalizeTableText(value);
  if (normalizedValue !== '{today}') return normalizedValue;

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).format(new Date());
};

const assertTableCellText = (selector: string, expected: string): void => {
  cy.get(selector)
    .invoke('text')
    .then((actual) => {
      expect(normalizeTableText(actual)).to.eq(normalizeTableText(expected));
    });
};

/** Actions and assertions for the defendant account Impositions tab. */
export class AccountDetailsImpositionsActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;

  /**
   * Verifies every rendered imposition row against the expected data-table rows.
   * @param expectedRows First row contains headings; remaining rows contain expected values.
   */
  public assertDefendantAccountImpositionsLoaded(expectedRows: string[][]): void {
    log('assert', 'Asserting defendant account impositions loaded');
    const [rawHeadings, ...rows] = expectedRows;
    const headings = rawHeadings.map(normalizeTableText);
    const expected = rows.map((row) =>
      Object.fromEntries(headings.map((heading, index) => [heading, resolveExpectedTableValue(row[index])])),
    );

    cy.get(L.root, { timeout: AccountDetailsImpositionsActions.DEFAULT_TIMEOUT }).should('be.visible');
    cy.get(L.heading).should('contain.text', 'Impositions');
    cy.get(L.tableHeadings).then(($headings) => {
      const renderedHeadings = [...$headings].map((heading) => normalizeTableText(heading.textContent ?? ''));
      headings.forEach((heading) => {
        expect(renderedHeadings.some((renderedHeading) => renderedHeading.includes(normalizeTableText(heading)))).to.eq(
          true,
        );
      });
    });
    cy.get(L.tableRows).should('have.length', expected.length);
    const columnSelectors: Record<string, (rowIndex: number) => string> = {
      'Date added': L.dateAdded,
      Imposition: L.result,
      Creditor: L.creditor,
      Imposed: L.imposedAmount,
      'Paid/Written off': L.paidAmount,
      Balance: L.balance,
      'Date imposed': L.dateImposed,
      Offence: L.offence,
      'Imposed by': L.imposedBy,
      'Imposition ID': L.impositionId,
    };
    expected.forEach((row, rowIndex) => {
      Object.entries(row).forEach(([column, value]) => {
        const selector = columnSelectors[column];
        if (selector && value !== undefined) {
          assertTableCellText(selector(rowIndex), value);
        }
      });
    });
  }
}
