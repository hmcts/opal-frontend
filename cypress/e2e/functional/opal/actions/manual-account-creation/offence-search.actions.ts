/**
 * @fileoverview Actions for the Manual Account Creation **Offence search** pages.
 * Covers entering search criteria, submitting, navigating back, and validating results.
 */
import { ManualOffenceDetailsLocators as L } from '../../../../../shared/selectors/manual-account-creation/offence-details.locators';
import { log } from '../../../../../support/utils/log.helper';
import { CommonActions } from '../common/common.actions';

type SearchField = 'Offence code' | 'Short title' | 'Act and section';
type ResultsColumn = 'Code' | 'Short title' | 'Act and section' | 'Used from' | 'Used to';

export class ManualOffenceSearchActions {
  private readonly common = new CommonActions();

  /**
   * Asserts the search form page is displayed.
   * @param expectedHeader - Expected header text fragment.
   */
  assertOnSearchPage(expectedHeader: string = 'Search offences'): void {
    cy.location('pathname', { timeout: 20_000 }).should('include', 'search-offences');
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  /**
   * Asserts the search results page is displayed.
   * @param expectedHeader - Expected header text fragment.
   */
  assertOnResultsPage(expectedHeader: string = 'Search results'): void {
    cy.location('pathname', { timeout: 20_000 }).should('include', 'search-offences-results');
    this.common.assertHeaderContains(expectedHeader, 20_000);
  }

  /**
   * Sets a search field value.
   * @param field - Logical field label.
   * @param value - Value to type.
   */
  setSearchField(field: SearchField, value: string): void {
    const selector = this.resolveFieldSelector(field);
    log('type', 'Setting offence search field', { field, value });
    cy.get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .type(value, { force: true, delay: 0 })
      .should('have.value', value);
  }

  /**
   * Clears a search field.
   * @param field - Logical field label.
   */
  clearSearchField(field: SearchField): void {
    const selector = this.resolveFieldSelector(field);
    log('clear', 'Clearing offence search field', { field });
    cy.get(selector, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .should('have.value', '');
  }

  /**
   * Asserts a search field value.
   * @param field - Logical field label.
   * @param expected - Expected value.
   */
  assertSearchFieldValue(field: SearchField, expected: string): void {
    const selector = this.resolveFieldSelector(field);
    log('assert', 'Asserting offence search field value', { field, expected });
    cy.get(selector, this.common.getTimeoutOptions()).should('have.value', expected);
  }

  /**
   * Toggles the Include inactive offence codes checkbox.
   * @param checked - Desired state.
   */
  toggleIncludeInactive(checked: boolean): void {
    log('click', 'Toggling include inactive offences', { checked });
    const action = checked ? 'check' : 'uncheck';
    cy.get(L.search.includeInactiveCheckbox, this.common.getTimeoutOptions())
      .should('exist')
      .scrollIntoView()
      [action]({ force: true });
  }

  /**
   * Submits the search form.
   */
  submitSearch(): void {
    log('action', 'Submitting offence search');
    cy.get(L.search.searchButton, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Clicks the back link on the results page.
   */
  clickBackLink(): void {
    log('navigate', 'Navigating back from search results');
    cy.get(L.search.backLink, this.common.getTimeoutOptions()).should('exist').click({ force: true });
  }

  /**
   * Asserts a value exists within a search results column.
   * @param column - Column heading.
   * @param expected - Expected text.
   */
  assertResultContains(column: ResultsColumn, expected: string): void {
    const cellId = this.resolveResultColumnId(column);
    log('assert', 'Validating search results column value', { column, expected });
    cy.get(L.search.resultsTable, this.common.getTimeoutOptions())
      .find(`td#${cellId}`)
      .should('contain.text', expected);
  }

  /**
   * Asserts every result row in a column contains the expected text.
   * @param column - Column heading.
   * @param expected - Text each row should include.
   */
  assertAllResultsContain(column: ResultsColumn, expected: string): void {
    const cellId = this.resolveResultColumnId(column);
    log('assert', 'Validating all search results contain value', { column, expected });
    cy.get(L.search.resultsTable, this.common.getTimeoutOptions())
      .find(`td#${cellId}`)
      .should('have.length.greaterThan', 0)
      .each(($cell) => cy.wrap($cell).should('contain.text', expected));
  }

  /**
   * Asserts that the results contain at least one row for each expected value in a column.
   * @param column - Column heading.
   * @param expectedValues - Values that must appear in at least one row.
   */
  assertResultsIncludeValues(column: ResultsColumn, expectedValues: string[]): void {
    const cellId = this.resolveResultColumnId(column);
    log('assert', 'Validating search results include values', { column, expectedValues });
    cy.get(L.search.resultsTable, this.common.getTimeoutOptions())
      .find(`td#${cellId}`)
      .then(($cells) => {
        const values = Array.from($cells, (cell) => cell.textContent?.trim() ?? '');
        expectedValues.forEach((expected) => {
          expect(
            values.some((val) => val.includes(expected)),
            `Expected at least one "${column}" value to include "${expected}"`,
          ).to.be.true;
        });
      });
  }

  /**
   * Returns all values from a column in the current results table.
   * @param column - Column heading.
   */
  getResultColumnValues(column: ResultsColumn): Cypress.Chainable<string[]> {
    const cellId = this.resolveResultColumnId(column);
    return cy
      .get(L.search.resultsTable, this.common.getTimeoutOptions())
      .find(`td#${cellId}`)
      .then(($cells) => Array.from($cells, (cell) => cell.textContent?.trim() ?? ''));
  }

  /**
   * Resolves a logical search field label to its input selector.
   * @param field - Offence search field name.
   * @throws Error when an unknown field is provided.
   */
  private resolveFieldSelector(field: SearchField): string {
    switch (field) {
      case 'Offence code':
        return L.search.offenceCodeInput;
      case 'Short title':
        return L.search.shortTitleInput;
      case 'Act and section':
        return L.search.actAndSectionInput;
      default:
        throw new Error(`Unknown search field: ${field}`);
    }
  }

  /**
   * Resolves a results column heading to its table cell id.
   * @param column - Column name as displayed in the results table.
   * @throws Error when an unknown column is provided.
   */
  private resolveResultColumnId(column: ResultsColumn): string {
    const normalized = column.toLowerCase();
    if (normalized.includes('code')) return 'code';
    if (normalized.includes('short title')) return 'shortTitle';
    if (normalized.includes('act')) return 'actAndSection';
    if (normalized.includes('used from')) return 'usedFrom';
    if (normalized.includes('used to')) return 'usedTo';
    throw new Error(`Unknown results column: ${column}`);
  }
}
