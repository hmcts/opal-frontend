/**
 * @file ResultsActions
 * Shared Cypress actions for the Account Search **results** page.
 * Centralises: waiting for results to load, opening the first/latest row,
 * and opening by a specific account number.
 */

import { AccountEnquiryResultsLocators as R } from '../../../../../shared/selectors/account-enquiry-results.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('ResultsActions');

/**
 * High-level Actions for the Search Results page.
 * Provides consistent logging, explicit waits, and convenient open helpers.
 */
export class ResultsActions {
  /** Default timeout (ms) used by this actions class. */
  private static readonly WAIT_MS = 15_000;

  /**
   * Maps human-readable column names (as used in Gherkin) to
   * the underlying cell selectors defined in the locators file.
   *
   * Extend this as more columns are asserted in features.
   */
  private static readonly COLUMN_LOCATORS: Record<string, string> = {
    // Column header "Ref" → reference column cell
    Ref: R.cols.ref,
    // Example extensions for future:
    // 'Business unit': R.cols.businessUnit,
    // 'Balance': R.cols.balance,
  };

  /**
   * Assert the problem page root exists and the expected main heading is visible.
   */
  public assertPageDisplayed(): void {
    log('assert', 'Verifying search results heading');
    cy.get(R.page.heading, { timeout: ResultsActions.WAIT_MS }).should('contain.text', 'Search results');
  }

  /**
   * Waits for the Search results table to appear and be visible (no row assertion).
   * Useful when a test just needs the table present before other actions.
   */
  public waitForResultsTable(): void {
    log('wait', 'Waiting for Search results table');
    cy.get(R.page.heading, { timeout: ResultsActions.WAIT_MS })
      .should('be.visible')
      .and('contain.text', 'Search results');
    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');
  }

  /**
   * Asserts we are on the results route and the table contains at least one row.
   *
   * Steps:
   *  - Wait for `/fines/search-accounts/results` in the pathname
   *  - Assert heading contains "Search results"
   *  - Assert results table is visible and has at least 1 row
   */
  public assertOnResults(): void {
    log('assert', 'Asserting on results route and non-empty table');
    cy.location('pathname', { timeout: ResultsActions.WAIT_MS }).should('include', '/fines/search-accounts/results');
    cy.get(R.page.heading, { timeout: ResultsActions.WAIT_MS }).should('contain.text', 'Search results');
    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');
    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS }).should('have.length.greaterThan', 0);
  }

  /**
   * Asserts the "Individuals" tab is selected on the Search results page.
   *
   * @remarks
   * This uses a text-based lookup for the tab label. When/if dedicated
   * tab locators are added to AccountEnquiryResultsLocators, this
   * implementation can be updated to use them instead.
   */
  public assertIndividualsTabSelected(): void {
    log('assert', 'Asserting "Individuals" tab is selected');

    // Relaxed text-based assertion – update to dedicated locators when available.
    cy.contains('button, a', 'Individuals', { matchCase: false })
      .should('be.visible')
      .and(($el) => {
        // Prefer ARIA or selected-state check when present
        const ariaSelected = $el.attr('aria-selected') ?? $el.attr('aria-current');
        if (ariaSelected) {
          expect(ariaSelected.toString().toLowerCase(), 'tab selection state').to.satisfy((val: string) =>
            ['true', 'page'].includes(val),
          );
        }
      });
  }

  /**
   * Selects the "Companies" tab on the Search results page.
   *
   * @remarks
   * Uses a text-based lookup for the tab label. Once tab-specific selectors
   * are available in the locators file, this should be updated to use those.
   */
  public selectCompaniesTab(): void {
    log('click', 'Selecting "Companies" tab');

    cy.contains('button, a', 'Companies', { matchCase: false }).should('be.visible').click({ force: true });
  }

  /**
   * Asserts the "Companies" tab is selected on the Search results page.
   */
  public assertCompaniesTabSelected(): void {
    log('assert', 'Asserting "Companies" tab is selected');

    cy.contains('button, a', 'Companies', { matchCase: false })
      .should('be.visible')
      .and(($el) => {
        const ariaSelected = $el.attr('aria-selected') ?? $el.attr('aria-current');
        if (ariaSelected) {
          expect(ariaSelected.toString().toLowerCase(), 'tab selection state').to.satisfy((val: string) =>
            ['true', 'page'].includes(val),
          );
        }
      });
  }

  /**
   * Opens the **latest** (first row) account in the results table.
   * Captures the account number as `@openedAccountNumber` for downstream steps.
   * Uses `{ force: true }` for robustness when rows are partially obscured.
   */
  public openLatestPublished(): void {
    log('open', 'Opening latest (first row) account');

    // Ensure at least one row exists to reduce flakiness
    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS })
      .should('have.length.greaterThan', 0)
      .first()
      .within(() => {
        cy.get(R.cols.accountLink, { timeout: 10_000 })
          .scrollIntoView()
          .then(($a) => {
            const acctNo = $a.text().trim();

            // Save for later steps without noisy logging
            cy.wrap(acctNo, { log: false }).as('openedAccountNumber');
            log('info', 'Captured opened account number', { openedAccountNumber: acctNo });

            // IMPORTANT: click the element we already grabbed;
            // this avoids switching the subject to the string alias.
            cy.wrap($a).click({ force: true });
          });
      });

    this.assertNavigatedToDetails();
  }

  /********this should be in flow ******** */
  /**
   * Opens a specific account **by account number** from the results table.
   * @param accountNumber Visible account number to open.
   */
  public openByAccountNumber(accountNumber: string): void {
    log('open', 'Opening by specific account number', { accountNumber });

    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');

    // Dynamic locator is defined in the locators file
    cy.get(R.linkByAccountNumber(accountNumber), { timeout: ResultsActions.WAIT_MS })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    this.assertNavigatedToDetails();
  }

  /**
   * Opens a specific account by number, traversing pagination until found.
   * Throws if the link is not found on any page.
   * @param accountNumber - Account number to open across pages.
   */
  public openByAccountNumberAcrossPages(accountNumber: string): void {
    log('open', 'Opening by account number across paginated results', { accountNumber });

    const tryPage = (): void => {
      // Check current page first
      cy.get('body', { timeout: ResultsActions.WAIT_MS }).then(($body) => {
        const selector = R.linkByAccountNumber(accountNumber);
        const onPage = $body.find(selector).length > 0;

        if (onPage) {
          cy.get(selector, { timeout: ResultsActions.WAIT_MS }).scrollIntoView().click({ force: true });
          this.assertNavigatedToDetails();
          return;
        }

        const nextLink = $body.find('nav.moj-pagination .moj-pagination__item--next a.moj-pagination__link');
        if (!nextLink.length) {
          throw new Error(`Account ${accountNumber} not found in paginated results`);
        }

        cy.wrap(nextLink).click({ force: true });
        this.waitForResultsTable();
        tryPage();
      });
    };

    tryPage();
  }

  /**
   * Asserts that at least one row in the results table matches all of the
   * provided column/value expectations.
   *
   * @param expectations - Map of column label → expected cell text.
   *                       Column labels must match keys in COLUMN_LOCATORS
   *                       (e.g. "Ref").
   *
   * @example
   *  // Gherkin:
   *  // Then I see the Individuals search results:
   *  //   | Ref |
   *  //   | PCRAUTO008 |
   *
   *  // Flow resolves this to: { Ref: 'PCRAUTO008' }
   */
  public assertResultsRowMatchesColumns(expectations: Record<string, string>): void {
    log('verify', 'Asserting at least one results row matches expected columns', {
      expectations,
    });

    // Ensure the table is present before we start inspecting rows.
    this.waitForResultsTable();

    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS }).then(($rows) => {
      if ($rows.length === 0) {
        throw new Error('No rows present in results table while asserting column values');
      }

      let matchFound = false;

      // Iterate in plain JS/jQuery space (no nested Cypress commands)
      for (const row of Array.from($rows)) {
        const $row = Cypress.$(row);
        let allMatch = true;

        for (const [columnLabel, expectedValueRaw] of Object.entries(expectations)) {
          const selector = ResultsActions.COLUMN_LOCATORS[columnLabel];

          if (!selector) {
            throw new Error(
              `No column locator mapping defined for header "${columnLabel}". ` +
                'Extend ResultsActions.COLUMN_LOCATORS to support this column.',
            );
          }

          const cellText = $row.find(selector).text().trim();
          const expectedValue = expectedValueRaw.trim();

          if (cellText !== expectedValue) {
            allMatch = false;
            break;
          }
        }

        if (allMatch) {
          matchFound = true;
          break;
        }
      }

      expect(matchFound, `No results row matched all expected column values: ${JSON.stringify(expectations)}`).to.be
        .true;
    });
  }

  /**
   * Asserts that no row in the results table matches all of the provided
   * column/value expectations.
   *
   * @param expectations - Map of column label → expected cell text.
   *                       Column labels must match keys in COLUMN_LOCATORS
   *                       (e.g. "Ref").
   *
   * @example
   *  // Then I see the Companies search results exclude:
   *  //   | Ref | PCRAUTO010A |
   *
   *  // Flow resolves this to: { Ref: 'PCRAUTO010A' }
   */
  public assertNoResultsRowMatchesColumns(expectations: Record<string, string>): void {
    log('verify', 'Asserting no results row matches expected columns', {
      expectations,
    });

    this.waitForResultsTable();

    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS }).then(($rows) => {
      if ($rows.length === 0) {
        // No rows at all -> trivially satisfies "does not contain"
        log('verify', 'No rows present in results table; negative expectation satisfied');
        return;
      }

      let matchFound = false;

      for (const row of Array.from($rows)) {
        const $row = Cypress.$(row);
        let allMatch = true;

        for (const [columnLabel, expectedValueRaw] of Object.entries(expectations)) {
          const selector = ResultsActions.COLUMN_LOCATORS[columnLabel];

          if (!selector) {
            throw new Error(
              `No column locator mapping defined for header "${columnLabel}". ` +
                'Extend ResultsActions.COLUMN_LOCATORS to support this column.',
            );
          }

          const cellText = $row.find(selector).text().trim();
          const expectedValue = expectedValueRaw.trim();

          if (cellText !== expectedValue) {
            allMatch = false;
            break;
          }
        }

        if (allMatch) {
          matchFound = true;
          break;
        }
      }

      expect(
        matchFound,
        `Found a results row that matched all forbidden column values: ${JSON.stringify(expectations)}`,
      ).to.be.false;
    });
  }

  /********** this shouldn't be in this actions ******** */
  /**
   * Confirms navigation to an account details route (accounts or draft-accounts).
   */
  private assertNavigatedToDetails(): void {
    cy.location('pathname', { timeout: ResultsActions.WAIT_MS }).should((p) => {
      expect(p, 'navigated to details').to.match(/^\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details$/);
    });
  }

  /**
   * Clicks the account link for a specific account number on the current page.
   *
   * @param acc - Account number to click.
   * @returns The clicked link element.
   */
  public clickAccountOnCurrentPage(acc: string): Cypress.Chainable<JQuery<HTMLElement>> {
    log('click', 'Click account link on current page', { accountNumber: acc });
    return cy.get(R.linkByAccountNumber(acc), { timeout: 5_000 }).scrollIntoView().click({ force: true });
  }

  /**
   * Uses the results back link to return to the Account Search page.
   *
   * Behaviour:
   *  - Ensures the GOV.UK back link is visible
   *  - Activates the link with a robust click
   *  - Confirms we have left the `/results` route
   */
  public useBackLinkToReturnToSearch(): void {
    log('navigate', 'Using back link to return to Account Search');

    cy.get(R.page.backLink, { timeout: ResultsActions.WAIT_MS })
      .should('be.visible')
      .then(($a) => {
        log('action', 'Activating back link from results page', {
          text: $a.text().trim(),
        });
        cy.wrap($a).click({ force: true });
      });

    // Generic safety check: we should no longer be on the `/results` route
    cy.location('pathname', { timeout: ResultsActions.WAIT_MS }).should(
      'not.include',
      '/fines/search-accounts/results',
    );

    log('done', 'Returned from results via back link');
  }

  /**
   * Asserts the "There are no matching results" heading is displayed.
   *
   * This is used for scenarios where a search produces zero results, and the
   * results page shows the GOV.UK-style empty-results message instead of a table.
   *
   * Page DOM example:
   *   <h2 class="govuk-heading-m">There are no matching results</h2>
   */
  public assertNoMatchingResultsMessage(): void {
    log('assert', 'Asserting "There are no matching results" heading is visible');

    cy.get(R.messages.noResultsHeading, { timeout: ResultsActions.WAIT_MS })
      .should('be.visible')
      .and('contain.text', 'There are no matching results');
  }

  /**
   * Clicks the "Check your search" link displayed when no results are found.
   *
   * Behaviour:
   *  - Asserts link visibility
   *  - Performs a forced click for robustness
   *  - Returns the Cypress chainable for any caller chaining
   * @returns Cypress chainable for further chaining.
   *
   * Page DOM example:
   *   <p class="govuk-body-m">
   *     <a class="govuk-link">Check your search</a> and try again
   *   </p>
   */
  public clickCheckYourSearchLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    log('click', 'Clicking "Check your search" link');

    return cy
      .get(R.messages.checkYourSearchLink, { timeout: ResultsActions.WAIT_MS })
      .should('be.visible')
      .click({ force: true });
  }
}

export default ResultsActions;
