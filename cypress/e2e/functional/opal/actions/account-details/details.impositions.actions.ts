/**
 * @file details.impositions.actions.ts
 * @description Actions for asserting the Account Details "Impositions" tab.
 */
import { AccountImpositionsDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.impositions.details.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('AccountDetailsImpositionsActions');

const SHORT_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Normalizes rendered table text for stable whitespace-insensitive comparisons.
 *
 * @param value - Raw text content from the DOM.
 * @returns Text with non-breaking spaces replaced and whitespace collapsed.
 */
const normalizeTableText = (value: string): string =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Resolves placeholders used in expected imposition table values.
 *
 * @param value - Expected table cell value or supported placeholder.
 * @returns Concrete expected text for comparison.
 */
const resolveExpectedTableValue = (value: string): string => {
  const normalizedValue = normalizeTableText(value);
  if (normalizedValue !== '{today}') return normalizedValue;

  const dateParts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/London',
  }).formatToParts(new Date());
  const datePart = (type: Intl.DateTimeFormatPartTypes): string =>
    dateParts.find((part) => part.type === type)?.value ?? '';

  return `${datePart('day')} ${SHORT_MONTH_NAMES[Number(datePart('month')) - 1]} ${datePart('year')}`;
};

type ImpositionTableRow = Record<string, string>;

const CENTRAL_FUND_CREDITOR_ALIASES = [
  'Central Fund',
  'Central Funds',
  'HM Courts & Tribunals Service',
  'HM Courts and Tribunals Service',
  'HM Courts & Tribunals Service (HMCTS)',
  'HM Courts and Tribunals Service (HMCTS)',
];

/**
 * Reads a rendered table cell as normalized text.
 *
 * @param selector - Cell selector to read from the DOM.
 * @returns Normalized rendered cell text.
 */
const getTableCellText = (selector: string): string => normalizeTableText(Cypress.$(selector).text());

/**
 * Normalizes known environment-specific rendered values before row matching.
 *
 * @param column - Table column heading.
 * @param value - Normalized table cell value.
 * @returns Canonical comparable value.
 */
const normalizeComparableTableValue = (column: string, value: string): string => {
  if (column === 'Creditor' && CENTRAL_FUND_CREDITOR_ALIASES.includes(value)) return 'Central Fund';

  return value;
};

/**
 * Serializes comparable row values in column order for order-independent row matching.
 *
 * @param row - Row values keyed by heading.
 * @param columns - Column headings to include in the serialized key.
 * @returns Stable row key.
 */
const serializeTableRow = (row: ImpositionTableRow, columns: string[]): string =>
  columns.map((column) => `${column}: ${normalizeComparableTableValue(column, row[column] ?? '')}`).join(' | ');

/** Actions and assertions for the defendant account Impositions tab. */
export class AccountDetailsImpositionsActions {
  private static readonly DEFAULT_TIMEOUT = 15_000;

  /**
   * Asserts the Impositions tab shell is visible.
   */
  public assertImpositionsTabVisible(): void {
    log('assert', 'Asserting Impositions tab is visible');
    cy.get(L.root, { timeout: AccountDetailsImpositionsActions.DEFAULT_TIMEOUT }).should('be.visible');
    cy.get(L.heading, { timeout: AccountDetailsImpositionsActions.DEFAULT_TIMEOUT }).should(
      'contain.text',
      'Impositions',
    );
  }

  /**
   * Asserts the Impositions tab empty-state text.
   *
   * @param expected - Expected empty-state message.
   */
  public assertEmptyState(expected: string): void {
    this.assertImpositionsTabVisible();
    cy.get(L.emptyState, { timeout: AccountDetailsImpositionsActions.DEFAULT_TIMEOUT }).should(
      'contain.text',
      expected,
    );
  }

  /**
   * Verifies every rendered imposition row against the expected data-table rows.
   * @param expectedRows First row contains headings; remaining rows contain expected values.
   */
  public assertDefendantAccountImpositionsLoaded(expectedRows: string[][]): void {
    log('assert', 'Asserting defendant account impositions loaded');
    const [rawHeadings, ...rows] = expectedRows;
    const headings = rawHeadings.map(normalizeTableText);
    const expected: ImpositionTableRow[] = rows.map((row) =>
      Object.fromEntries(headings.map((heading, index) => [heading, resolveExpectedTableValue(row[index])])),
    );
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
    const comparableColumns = headings.filter((heading) => columnSelectors[heading]);

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
    cy.get(L.tableRows)
      .should('have.length', expected.length)
      .then(($rows) => {
        const actual = [...$rows].map((_, rowIndex) =>
          Object.fromEntries(
            comparableColumns.map((column) => [column, getTableCellText(columnSelectors[column](rowIndex))]),
          ),
        );

        const actualRows = actual.map((row) => serializeTableRow(row, comparableColumns)).sort();
        const expectedRows = expected.map((row) => serializeTableRow(row, comparableColumns)).sort();

        expect(
          actualRows,
          `Expected imposition rows:\n${expectedRows.join('\n')}\n\nActual imposition rows:\n${actualRows.join('\n')}`,
        ).to.deep.eq(expectedRows);
      });
  }
}
