/**
 * @file ResultsActions
 * @description Shared Cypress actions for the Account Search **results** page.
 * Shared Cypress actions for the Account Search **results** page.
 * Centralises: waiting for results to load, opening the first/latest row,
 * and opening by a specific account number.
 */

import { AccountEnquiryResultsLocators as R } from '../../../../../shared/selectors/account-enquiry/account.enquiry.results.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('ResultsActions');

/**
 * High-level Actions for the Search Results page.
 * Provides consistent logging, explicit waits, and convenient open helpers.
 */
export class ResultsActions {
  /** Default timeout (ms) used by this actions class. */
  private static readonly WAIT_MS = 30_000;
  private static readonly DETAILS_ROUTE_PATTERN =
    /^\/fines\/account\/(?:defendant|minor-creditor)\/[A-Za-z0-9-]+\/details$/;
  private static readonly INDIVIDUAL_RESULTS_HEADERS = [
    'Account',
    'Name',
    'Aliases',
    'Date of birth',
    'Address line 1',
    'Postcode',
    'NI number',
    'Parent or guardian',
    'Business unit',
    'Ref',
  ];
  private static readonly COMPANY_RESULTS_HEADERS = [
    'Account',
    'Company',
    'Aliases',
    'Address line 1',
    'Postcode',
    'Business unit',
    'Ref',
    'ENF',
    'Balance',
  ];
  private static readonly MINOR_CREDITOR_RESULTS_HEADERS = [
    'Account',
    'Name',
    'Address line 1',
    'Postcode',
    'Business unit',
    'Defendant',
    'Balance',
  ];

  /**
   * Maps human-readable column names (as used in Gherkin) to
   * the underlying cell selectors defined in the locators file.
   *
   * Extend this as more columns are asserted in features.
   */
  private static readonly COLUMN_LOCATORS: Record<string, string> = {
    // Column header "Account" → account number cell
    Account: `${R.cols.accountCell}, ${R.cols.minorCreditorAccountCell}`,
    // Column header "Name" → defendant or minor creditor name cell
    Name: `${R.cols.name}, ${R.cols.minorCreditorName}`,
    // Column header "Company" → company name reuses the shared defendant name cell
    Company: R.cols.name,
    // Column header "Address line 1" → address cell
    'Address line 1': `${R.cols.addr1}, ${R.cols.minorCreditorAddr1}`,
    // Column header "Postcode" → postcode cell
    Postcode: `${R.cols.postcode}, ${R.cols.minorCreditorPostcode}`,
    // Column header "Business unit" → business unit cell
    'Business unit': `${R.cols.businessUnit}, ${R.cols.minorCreditorBusinessUnit}`,
    // Column header "Defendant" → linked defendant on the minor creditor table
    Defendant: R.cols.minorCreditorDefendant,
    // Column header "Balance" → balance cell
    Balance: `${R.cols.balance}, ${R.cols.minorCreditorBalance}`,
    // Column header "Ref" → reference column cell
    Ref: R.cols.ref,
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
   * Normalises visible table header text to make DOM assertions whitespace-safe.
   * @param text Raw visible header text from the DOM.
   * @returns Header text with collapsed whitespace.
   */
  private static normalizeHeader(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Asserts that the current results table headers match the expected visible labels in order.
   *
   * Some single-type search results currently omit trailing columns that are still present in
   * the shared table component, so callers can allow additional trailing headers where needed.
   * @param expectedHeaders Visible header labels in the expected order.
   * @param options Optional assertion behaviour.
   * @param options.allowAdditionalTrailingHeaders When true, only the leading headers must match.
   */
  private assertResultsTableHeaders(
    expectedHeaders: string[],
    options?: { allowAdditionalTrailingHeaders?: boolean },
  ): void {
    const allowAdditionalTrailingHeaders = options?.allowAdditionalTrailingHeaders ?? false;

    log('assert', 'Asserting results table headers', {
      expectedHeaders,
      allowAdditionalTrailingHeaders,
    });

    this.waitForResultsTable();

    cy.get(`${R.table.head} button`, { timeout: ResultsActions.WAIT_MS }).then(($buttons) => {
      const actualHeaders = Array.from($buttons, (button) =>
        ResultsActions.normalizeHeader(button.textContent ?? ''),
      ).filter(Boolean);

      if (allowAdditionalTrailingHeaders) {
        expect(actualHeaders.slice(0, expectedHeaders.length), 'results table header prefix').to.deep.equal(
          expectedHeaders,
        );
        return;
      }

      expect(actualHeaders, 'results table headers').to.deep.equal(expectedHeaders);
    });
  }

  /**
   * Asserts the Individuals results table columns are shown in the expected order.
   */
  public assertIndividualsResultsTableStructure(): void {
    this.assertResultsTableHeaders(ResultsActions.INDIVIDUAL_RESULTS_HEADERS, {
      allowAdditionalTrailingHeaders: true,
    });
  }

  /**
   * Asserts the Companies results table columns are shown in the expected order.
   */
  public assertCompaniesResultsTableStructure(): void {
    this.assertResultsTableHeaders(ResultsActions.COMPANY_RESULTS_HEADERS);
  }

  /**
   * Asserts the Minor creditors results table columns are shown in the expected order.
   */
  public assertMinorCreditorResultsTableStructure(): void {
    this.assertResultsTableHeaders(ResultsActions.MINOR_CREDITOR_RESULTS_HEADERS);
  }

  /**
   * Asserts we are on the results route and the table contains at least one row.
   *
   * Steps:
   *  - Wait for `/fines/dashboard/search/results` in the pathname
   *  - Assert heading contains "Search results"
   *  - Assert results table is visible and has at least 1 row
   */
  public assertOnResults(): void {
    log('assert', 'Asserting on results route and non-empty table');
    cy.location('pathname', { timeout: ResultsActions.WAIT_MS }).should('include', '/fines/dashboard/search/results');
    cy.get(R.page.heading, { timeout: ResultsActions.WAIT_MS }).should('contain.text', 'Search results');
    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');
    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS }).should('have.length.greaterThan', 0);
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
   * Asserts the "Companies" tab is selected on the Search results page when it is rendered.
   */
  public assertCompaniesTabSelected(): void {
    log('assert', 'Asserting "Companies" tab is selected');
    this.assertTabSelectedIfPresent('Companies');
  }

  /**
   * Asserts a results tab is selected when the tab control is present.
   *
   * Mixed-result searches render defendant-type tabs; single-type searches do not.
   * @param tabLabel The visible tab label to validate when present.
   */
  private assertTabSelectedIfPresent(tabLabel: 'Companies'): void {
    cy.get('body', { timeout: ResultsActions.WAIT_MS }).then(($body) => {
      const $tab = $body.find('button, a').filter((_, element) => {
        return ResultsActions.normalizeHeader(element.textContent ?? '').toLowerCase() === tabLabel.toLowerCase();
      });

      if ($tab.length === 0) {
        log('info', `No "${tabLabel}" tab rendered for current results view; skipping tab assertion`);
        return;
      }

      cy.wrap($tab.first())
        .should('be.visible')
        .and(($el) => {
          const ariaSelected = $el.attr('aria-selected') ?? $el.attr('aria-current');
          if (ariaSelected) {
            expect(ariaSelected.toString().toLowerCase(), 'tab selection state').to.satisfy((val: string) =>
              ['true', 'page'].includes(val),
            );
          }
        });
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
      .then(($row) => {
        const linkSelector = $row.find(R.cols.minorCreditorAccountLink).length
          ? R.cols.minorCreditorAccountLink
          : R.cols.accountLink;

        log('info', 'Resolved latest results link selector', { linkSelector });

        cy.wrap($row)
          .find(linkSelector, { timeout: 10_000 })
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

        const nextLink = $body.find(R.pagination.next);
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
      expect(p, 'navigated to details').to.match(ResultsActions.DETAILS_ROUTE_PATTERN);
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
      '/fines/dashboard/search/results',
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

    cy.get(R.messages.heading, { timeout: ResultsActions.WAIT_MS })
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

    return cy.get(R.messages.link, { timeout: ResultsActions.WAIT_MS }).should('be.visible').click({ force: true });
  }
}

export default ResultsActions;
