/**
 * @file manual-account-creation.offence-review-and-search.steps.ts
 * @description Offence review, navigation, and search step definitions for Manual Account Creation.
 */
import { When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { ManualOffenceDetailsLocators as L } from '../../../../shared/selectors/manual-account-creation/offence-details.locators';
import {
  calculateWeeksInFuture,
  calculateWeeksInPast,
  formatDateString,
  parseWeeksValue,
} from '../../../utils/dateUtils';
import { normalizeTableRows } from '../../../utils/cucumberHelpers';
import { log } from '../../../utils/log.helper';
import {
  SearchResultColumn,
  resolveMinorCreditorFieldKey,
  resolveOffenceFieldKey,
  resolveSearchFieldKey,
} from '../../../utils/macFieldResolvers';
import {
  flow,
  minorCreditor,
  offenceDetails,
  offenceReview,
  offenceSearch,
  setCurrentOffenceCode,
  setCurrentImpositionIndex,
} from './manual-account-creation.offence.stepshelper';

type MacPageContext = 'search' | 'offence' | 'minorCreditor';

const resolveMacPage = (): Cypress.Chainable<MacPageContext> =>
  cy.get('body').then(($body) => {
    if ($body.find(L.minorCreditorForm.saveButton).length) {
      return 'minorCreditor';
    }

    if ($body.find(L.search.resultsTable).length || $body.find(L.search.offenceCodeInput).length) {
      return 'search';
    }

    return 'offence';
  });

/**
 * @step Amend an offence from the review page.
 * @description Amend an offence from the review page.

 * @param offenceCode - Offence code caption to amend.
 * @example When I choose to amend offence with offence code "TP11003"
 */
When('I choose to amend offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Amending offence from review', { offenceCode });
  flow().amendOffenceFromReview(offenceCode);
  setCurrentOffenceCode(offenceCode);
});

/**
 * @step Submit offence form and assert review page.
 * @description Submit offence form and assert review page.

 */
When('I review the offence and see the review page', () => {
  flow().reviewOffenceAndAssertReviewPage();
});

/**
 * @step Assert offence review header/message/text from a table.
 * @description Assert offence review header/message/text from a table.

 * @param table - DataTable with columns Type (Header/Message/Text) and Value.
 * @example
 *   Then I see the offence review details:
 *     | Type    | Value            |
 *     | Header  | Offences review  |
 *     | Message | Offence TP11003 added |
 */
Then('I see the offence review details:', (table: DataTable) => {
  const rows = table.hashes();
  rows.forEach(({ Type, Value }) => {
    if (/header/i.test(Type)) {
      offenceReview().assertOnReviewPage(Value);
      return;
    }
    cy.contains(Value).should('exist');
  });
});

/**
 * @step Enter a value into an offence/search/minor creditor field.
 * @description Enter a value into an offence/search/minor creditor field.

 * @param value - Value to enter.
 * @param fieldLabel - Field label (offence form, search form, or minor creditor).
 * @example When I enter "TP11003" into the "Offence code" field in the MAC flow
 */
When('I enter {string} into the {string} field in the MAC flow', (value: string, fieldLabel: string) => {
  log('type', 'Entering value into field', { fieldLabel, value });

  resolveMacPage().then((page) => {
    if (page === 'search') {
      const searchField = resolveSearchFieldKey(fieldLabel);
      offenceSearch().setSearchField(searchField, value);
      return;
    }

    if (page === 'offence') {
      try {
        const offenceField = resolveOffenceFieldKey(fieldLabel);
        offenceDetails().setOffenceField(offenceField, value);
        setCurrentImpositionIndex(0);
        return;
      } catch {
        // Fall through
      }
    }

    minorCreditor().setField(resolveMinorCreditorFieldKey(fieldLabel), value);
  });
});

/**
 * @step Assert a value in an offence/imposition/minor creditor field.
 * @description Assert a value in an offence/imposition/minor creditor field.

 * @param expected - Expected value.
 * @param fieldLabel - Field label (offence form, search form, or minor creditor).
 * @example Then I see "TP11003" in the "Offence code" field in the MAC flow
 */
Then('I see {string} in the {string} field in the MAC flow', (expected: string, fieldLabel: string) => {
  log('assert', 'Asserting value in field', { fieldLabel, expected });

  resolveMacPage().then((page) => {
    if (page === 'search') {
      const searchField = resolveSearchFieldKey(fieldLabel);
      offenceSearch().assertSearchFieldValue(searchField, expected);
      return;
    }

    if (page === 'offence') {
      try {
        const offenceField = resolveOffenceFieldKey(fieldLabel);
        offenceDetails().assertOffenceFieldValue(offenceField, expected);
        return;
      } catch {
        // Fall through
      }
    }

    minorCreditor().assertFieldValue(resolveMinorCreditorFieldKey(fieldLabel), expected);
  });
});

/**
 * @step Add another offence from the review page.
 * @description Add another offence from the review page.

 * @example When I add another offence
 */
When('I add another offence', () => {
  log('navigate', 'Adding another offence');
  flow().addAnotherOffenceFromReview();
});

/**
 * @step Submit the current offence for review (no assertion).
 * @description Submit the current offence for review (no assertion).

 * @example When I review the offence
 */
When('I review the offence', () => {
  offenceDetails().clickReviewOffence();
});

/**
 * @step Submit offence and assert review page (multi-offence flows).
 * @description Submit offence and assert review page (multi-offence flows).

 * @example When I review all offences
 */
When('I review all offences', () => {
  flow().reviewOffenceAndAssertReviewPage();
});

/**
 * @step Validates totals in the summary list or table on review.
 * @description Validates totals in the summary list or table on review.

 * @param table - DataTable of label/value pairs (e.g., Amount imposed, Amount paid).
 */
Then(/^the (?:review )?summary (?:list|table) contains:$/, (table: DataTable) => {
  const rows = normalizeTableRows(table);
  offenceReview().assertTotals(rows);
});

/**
 * @step Opens the remove offence confirmation page for the given offence code.
 * @description Opens the remove offence confirmation page for the given offence code.

 * @param offenceCode - Offence code caption to remove.
 * @example When I choose to remove offence with offence code "TP11003"
 */
When('I choose to remove offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Opening remove offence confirmation', { offenceCode });
  offenceReview().assertOnReviewPage();
  offenceReview().clickRemoveOffence(offenceCode);
});

/**
 * @step Asserts the remove offence confirmation page is displayed.
 * @description Asserts the remove offence confirmation page is displayed.

 * @param offenceCode - Offence code expected on the confirmation page.
 * @example Then I am asked to confirm removing offence with offence code "TP11003"
 */
Then('I am asked to confirm removing offence with offence code {string}', (offenceCode: string) => {
  log('assert', 'Asserting remove offence confirmation', { offenceCode });
  offenceReview().assertOnRemoveOffencePage(offenceCode);
});

/**
 * @step Cancels offence removal from the confirmation page.
 * @description Cancels offence removal from the confirmation page.

 * @param offenceCode - Offence code shown on the confirmation page.
 * @example When I cancel removing offence with offence code "TP11003"
 */
When('I cancel removing offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Cancelling offence removal', { offenceCode });
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  offenceReview().cancelRemoveOffence();
  offenceReview().assertOnReviewPage();
});

/**
 * @step Confirms offence removal from the confirmation page.
 * @description Confirms offence removal from the confirmation page.

 * @param offenceCode - Offence code shown on the confirmation page.
 * @example When I confirm removing offence with offence code "TP11003"
 */
When('I confirm removing offence with offence code {string}', (offenceCode: string) => {
  log('navigate', 'Confirming offence removal', { offenceCode });
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  offenceReview().confirmRemoveOffence();
  offenceReview().assertOnReviewPage();
});

/**
 * @step Remove an offence from review and assert it is absent.
 * @description Remove an offence from review and assert it is absent.

 * @param offenceCode - Offence code to remove.
 * @example When I remove offence with offence code "TP11003" and confirm
 */
When('I remove offence with offence code {string} and confirm', (offenceCode: string) => {
  log('flow', 'Removing offence with confirmation', { offenceCode });
  offenceReview().assertOnReviewPage();
  offenceReview().clickRemoveOffence(offenceCode);
  offenceReview().assertOnRemoveOffencePage(offenceCode);
  offenceReview().confirmRemoveOffence();
  offenceReview().assertOnReviewPage();
  offenceReview().assertOffenceAbsent(offenceCode);
});

/**
 * @step Assert offence review table rows for a given offence code.
 * @description Assert offence review table rows for a given offence code.

 * @param offenceCode - Offence code caption.
 * @param table - DataTable of expected rows.
 * @example
 *   Then the table with offence code "TP11003" should contain the following information:
 *     | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
 */
Then(
  'the table with offence code {string} should contain the following information:',
  (offenceCode: string, table: DataTable) => {
    const rows = normalizeTableRows(table);
    setCurrentOffenceCode(offenceCode);
    offenceReview().assertOffenceTable(offenceCode, rows);
  },
);

/**
 * @step Assert summary list values on the review page.
 * @description Validates definition list entries under the Totals section.
 * @param dataTable - Raw table of term/value rows.
 * @example
 *   Then the summary list should contain the following information:
 *     | Amount imposed | £100.00 |
 *     | Amount paid    | £50.00  |
 */
Then('the summary list should contain the following information:', (dataTable: any) => {
  const expectedData: string[][] = dataTable.raw();

  cy.get('h1, h2')
    .contains('Totals')
    .parent()
    .parent()
    .next()
    .children()
    .children()
    .within(() => {
      expectedData.forEach((row: string[], index: number) => {
        const [term, value] = row;

        cy.get('dt').eq(index).should('contain.text', term.trim());
        cy.get('dd').eq(index).should('contain.text', value.trim());
      });
    });
});

/**
 * @step Assert an offence review table matches expected rows.
 * @description Assert an offence review table matches expected rows.

 * @param offenceCode - Offence code caption.
 * @param table - DataTable of expected rows.
 * @example
 *   Then I see the offence review for offence code "TP11003" with the following information:
 *     | Imposition | Creditor | Amount imposed | Amount paid | Balance remaining |
 */
Then(
  'I see the offence review for offence code {string} with the following information:',
  (offenceCode: string, table: DataTable) => {
    const rows = normalizeTableRows(table);
    setCurrentOffenceCode(offenceCode);
    offenceReview().assertOnReviewPage();
    offenceReview().assertOffenceTable(offenceCode, rows);
  },
);

/**
 * @step Assert an offence caption is present on the review page.
 * @description Assert an offence caption is present on the review page.

 * @param offenceCode - Offence code expected in the caption.
 * @example Then I see offence "TP11003" on the offence review page
 */
Then('I see offence {string} on the offence review page', (offenceCode: string) => {
  log('assert', 'Asserting offence is visible on review', { offenceCode });
  offenceReview().assertOnReviewPage();
  cy.contains(L.review.offenceCaption, offenceCode, { timeout: 10_000 }).should('exist');
});

/**
 * @step Assert an offence code is absent from the review page.
 * @description Assert an offence code is absent from the review page.

 * @param offenceCode - Offence code that should not be listed.
 * @example Then I do not see the offence code "TP11003"
 */
Then('I do not see the offence code {string}', (offenceCode: string) => {
  offenceReview().assertOffenceAbsent(offenceCode);
});

/**
 * @step Assert date of sentence ordering for two offences.
 * @description Assert date of sentence ordering for two offences.

 * @param weeksAbove - Weeks offset for the offence expected first.
 * @param weeksBelow - Weeks offset for the offence expected second.
 * @example Then I see the date of sentence 2 weeks ago above the date of sentence 4 weeks ago
 */
Then(
  'I see the date of sentence {int} weeks ago above the date of sentence {int} weeks ago',
  (weeksAbove: number, weeksBelow: number) => {
    const topDate = formatDateString(calculateWeeksInPast(weeksAbove));
    const bottomDate = formatDateString(calculateWeeksInPast(weeksBelow));
    offenceReview().assertDateOfSentenceOrder([topDate, bottomDate]);
  },
);

/**
 * @step Assert offences are ordered by sentence date based on offsets.
 * @description Assert offences are ordered by sentence date based on offsets.

 * @param table - DataTable with Position and Sentence date offset columns.
 * @example
 *   Then I see the offences ordered by sentence date:
 *     | Position | Sentence date offset | Offence code |
 *     | 1        | 9 weeks ago          | TP11003      |
 */
Then('I see the offences ordered by sentence date:', (table: DataTable) => {
  const rows = table.hashes().sort((a, b) => Number(a['Position']) - Number(b['Position']));
  const formattedDates = rows.map(({ ['Sentence date offset']: offset }) => {
    const { weeks, direction } = parseWeeksValue(offset);
    const date = direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
    return formatDateString(date);
  });
  offenceReview().assertDateOfSentenceOrder(formattedDates);
});

/**
 * @step Assert the empty-offence messaging is shown.
 * @description Assert the empty-offence messaging is shown.

 * @example Then I see no offences messaging
 */
Then('I see no offences messaging', () => {
  log('assert', 'Asserting no offences messaging');
  cy.contains('There are no offences').should('exist');
  cy.contains('Add another offence').should('exist');
  cy.contains('Return to account details').should('exist');
});

/**
 * @step Return to Account details from offence details/review depending on current route.
 * @description Return to Account details from offence details/review depending on current route.

 * @example When I return to account details from offence details
 */
When('I return to account details from offence details', () => {
  cy.get('body').then(($body) => {
    const onReview = $body.find(L.review.returnToAccountDetailsButton).length > 0;
    if (onReview) {
      offenceReview().returnToAccountDetails();
      return;
    }
    offenceDetails().clickReturnToAccountDetails();
  });
});

/**
 * @step Navigate from offence review to Payment terms using the CTA.
 * @description Navigate from offence review to Payment terms using the CTA.

 * @example When I continue to payment terms from offence review
 */
When('I continue to payment terms from offence review', () => {
  flow().continueToPaymentTermsFromReview();
});

/**
 * @step Opens the offence search link in the current tab.
 * @description Opens the offence search link in the current tab.

 * @example When I follow the offence search link in the same tab
 */
When('I follow the offence search link in the same tab', () => {
  offenceDetails().openOffenceSearchLink();
});

/**
 * @step Submits the offence search form.
 * @description Submits the offence search form.

 * @example When I submit the offence search
 */
When('I submit the offence search', () => {
  flow().submitOffenceSearch();
});

/**
 * @step Returns from search results to the offence search form.
 * @description Returns from search results to the offence search form.

 * @example When I return to the offence search form
 */
When('I return to the offence search form', () => {
  flow().returnToOffenceSearchForm();
});

Then(
  'I see {string} in the offence search results table under the {string} column',
  (value: string, column: SearchResultColumn) => {
    offenceSearch().assertResultContains(column, value);
  },
);

/**
 * @step Asserts the max-results message is shown on offence search results.
 * @description Asserts the max-results message is shown on offence search results.

 * @param text - Expected banner/message text.
 * @example Then I see the offence search max results message "100 results"
 */
Then('I see the offence search max results message {string}', (text: string) => {
  offenceSearch().assertOnResultsPage();
  cy.contains(text).should('exist');
});

/**
 * @step Asserts every offence search result row contains the provided values.
 * @description Asserts every offence search result row contains the provided values.

 * @param table - DataTable with `Column` and `Value` pairs.
 * @example
 *   Then I see all offence search results have:
 *     | Column      | Value     |
 *     | Short title | Transport |
 */
Then('I see all offence search results have:', (table: DataTable) => {
  const rows = table.hashes().map(({ Column, Value }) => ({
    Column,
    Value,
  }));
  flow().assertAllOffenceResults(rows);
});

/**
 * @step Asserts offence search results include rows with the given values per column.
 * @description Asserts offence search results include rows with the given values per column.

 * @param table - DataTable with `Column` and comma-separated `Values`.
 * @example
 *   Then I see offence search results contain rows with values in column:
 *     | Column | Values           |
 *     | Code   | TP47033, TP47032 |
 */
Then('I see offence search results contain rows with values in column:', (table: DataTable) => {
  const rows = table.hashes().map(({ Column, Values }) => ({
    Column,
    Values: Values.split(',')
      .map((v) => v.trim())
      .filter(Boolean),
  }));
  flow().assertOffenceResultsContain(rows);
});

/**
 * @step Checks the include-inactive checkbox on offence search (without submitting).
 * @description Checks the include-inactive checkbox on offence search (without submitting).

 * @example When I enable the "Include inactive offence codes" checkbox on offence search
 */
When('I enable the "Include inactive offence codes" checkbox on offence search', () => {
  log('click', 'Selecting include inactive offences checkbox');
  offenceSearch().toggleIncludeInactive(true);
});

/**
 * @step Unchecks the include-inactive checkbox on offence search (without submitting).
 * @description Unchecks the include-inactive checkbox on offence search (without submitting).

 * @example When I disable the "Include inactive offence codes" checkbox on offence search
 */
When('I disable the "Include inactive offence codes" checkbox on offence search', () => {
  log('click', 'Unselecting include inactive offences checkbox');
  offenceSearch().toggleIncludeInactive(false);
});

/**
 * @step Enables inactive offences and submits the search.
 * @description Enables inactive offences and submits the search.

 * @example When I enable inactive offence codes and run the offence search
 */
When('I enable inactive offence codes and run the offence search', () => {
  flow().enableInactiveOffencesAndSearch();
});

/**
 * @step Disables inactive offences and re-runs the search.
 * @description Disables inactive offences and re-runs the search.

 * @example When I reset the offence search to exclude inactive offence codes
 */
When('I reset the offence search to exclude inactive offence codes', () => {
  flow().resetInactiveOffencesAndSearch();
});

/**
 * @step Asserts results contain both active and inactive offences.
 * @description Asserts results contain both active and inactive offences.

 * @example Then I am viewing offence results with active and inactive offences
 */
Then('I am viewing offence results with active and inactive offences', () => {
  flow().assertActiveAndInactiveResults();
});

/**
 * @step Asserts results contain only active offences.
 * @description Asserts results contain only active offences.

 * @example Then I am viewing offence results with active offences only
 */
Then('I am viewing offence results with active offences only', () => {
  flow().assertActiveOnlyResults();
});

/**
 * @step Populates offence search criteria and submits.
 * @description Populates offence search criteria and submits.

 *
 * @param table - DataTable of offence search fields and values.
 */
When('I search offences with:', (table: DataTable) => {
  flow().searchOffences(table.rowsHash());
});

/**
 * @step Asserts offence search form fields match expected values.
 * @description Asserts offence search form fields match expected values.

 *
 * @param table - DataTable of offence search fields and values.
 */
Then('I see the offence search form with:', (table: DataTable) => {
  const fields = table.rowsHash();
  Object.entries(fields).forEach(([label, value]) => {
    const searchField = resolveSearchFieldKey(label);
    log('assert', 'Asserting offence search form value', { label, value });
    offenceSearch().assertSearchFieldValue(searchField, value);
  });
});

/**
 * @step Runs a11y checks on the offence removal confirmation flow.
 * @description Runs a11y checks on the offence removal confirmation flow.

 *
 * @param offenceCode - Offence code to remove in the accessibility path.
 */
When('I perform offence removal accessibility check for offence code {string}', (offenceCode: string) => {
  flow().runOffenceRemovalAccessibility(offenceCode);
});

/**
 * @step Asserts offence review tables for a given offence code using raw table data (legacy helper).
 * @param offenceCode - Offence code caption on the review page.
 * @param dataTable - DataTable including the header row and expected values.
 * @example
 *   Then the offence review table for offence code "TP11003" contains:
 *     | Imposition       | Creditor | Amount imposed | Amount paid | Balance remaining |
 *     | Compensation     | Smith    | £200.00        | £100.00     | £100.00           |
 */
Then('the offence review table for offence code {string} contains:', (offenceCode: string, dataTable: DataTable) => {
  offenceReview().assertOffenceTable(offenceCode, dataTable.raw());
});
