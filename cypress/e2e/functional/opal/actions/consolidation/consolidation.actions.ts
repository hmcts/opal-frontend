/**
 * @file consolidation.actions.ts
 * @description Cypress actions and assertions for the Consolidation journey.
 */

import { SelectBusinessUnitLocators } from '../../../../../shared/selectors/consolidation/SelectBusinessUnit.locators';
import { AccountSearchLocators } from '../../../../../shared/selectors/consolidation/AccountSearch.locators';
import { AccountResultsLocators } from '../../../../../shared/selectors/consolidation/AccountResults.locators';
import { ErrorPageLocators } from '../../../../../shared/selectors/consolidation/ErrorPage.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { applyUniqPlaceholder } from '../../../../../support/utils/stringUtils';

const log = createScopedLogger('ConsolidationActions');
const SINGLE_BUSINESS_UNIT_MESSAGE_PREFIX = 'The consolidation will be processed in';

export type ConsolidationDefendantType = 'Individual' | 'Company';
type SearchDetails = Record<string, string>;
type ConsolidationExpectedResultRow = Record<string, string>;
type CreatedAccountAlias = {
  accountId?: number | string | null;
  accountNumber?: string | null;
};
const SELECTED_BUSINESS_UNIT_ALIAS = 'selectedConsolidationBusinessUnit';

/** Actions and assertions for the Consolidation flow screens. */
export class ConsolidationActions {
  private readonly textFieldSelectorMap: Record<string, string> = {
    'account number': AccountSearchLocators.accountNumberInput,
    'national insurance number': AccountSearchLocators.nationalInsuranceNumberInput,
    'last name': AccountSearchLocators.lastNameInput,
    'first names': AccountSearchLocators.firstNamesInput,
    'date of birth': AccountSearchLocators.dateOfBirthInput,
    'address line 1': AccountSearchLocators.addressLine1Input,
    postcode: AccountSearchLocators.postCodeInput,
  };

  private readonly checkboxSelectorMap: Record<string, string> = {
    'last name exact match': AccountSearchLocators.lastNameExactMatchCheckbox,
    'first names exact match': AccountSearchLocators.firstNamesExactMatchCheckbox,
    'include aliases': AccountSearchLocators.includeAliasesCheckbox,
  };

  private readonly companyTextFieldSelectorMap: Record<string, string> = {
    'account number': AccountSearchLocators.accountNumberInput,
    'company name': AccountSearchLocators.companyNameInput,
    'address line 1': AccountSearchLocators.companyAddressLine1Input,
    postcode: AccountSearchLocators.companyPostCodeInput,
  };

  private readonly companyCheckboxSelectorMap: Record<string, string> = {
    'search exact match': AccountSearchLocators.companyNameExactMatchCheckbox,
    'include aliases': AccountSearchLocators.companyIncludeAliasesCheckbox,
  };

  /**
   * Normalizes supported checkbox text values to booleans.
   * @param value - Raw value from feature table (e.g. true/false, yes/no).
   * @returns Parsed boolean for checkbox assertions/interactions.
   */
  private parseCheckboxValue(value: string): boolean {
    const normalised = String(value).trim().toLowerCase();
    if (['true', 'yes'].includes(normalised)) return true;
    if (['false', 'no'].includes(normalised)) return false;
    throw new Error(`Unsupported checkbox value "${value}". Use true/false (or yes/no).`);
  }

  /**
   * Collapses repeated whitespace before text assertions.
   * @param value - Raw rendered text.
   * @returns Trimmed single-spaced text.
   */
  private normaliseText(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
  }

  /**
   * Maps a supported expected results-table column to the rendered UI value for a row.
   * @param row - Table row element.
   * @param column - Normalised expected column name.
   * @returns Rendered text value for the requested column.
   */
  private getRenderedResultValue(row: JQuery<HTMLElement>, column: string): string {
    switch (column) {
      case 'account':
      case 'account number':
        return this.normaliseText(row.find(AccountResultsLocators.resultAccountLink).text());
      case 'name':
        return this.normaliseText(row.find(AccountResultsLocators.resultNameCell).text());
      case 'date of birth':
        return this.normaliseText(row.find(AccountResultsLocators.resultDateOfBirthCell).text());
      default:
        throw new Error(`Unsupported consolidation results expectation column "${column}".`);
    }
  }

  /**
   * Resolves the last created account id/number stored on the shared @etagUpdate alias.
   * This alias is set by the draft account creation helpers.
   * @returns Chainable yielding the created account id and account number.
   */
  private getCreatedAccountAlias(): Cypress.Chainable<{ accountId: number; accountNumber: string }> {
    return cy.get<CreatedAccountAlias>('@etagUpdate').then((etagUpdate) => {
      const accountId = Number(etagUpdate?.accountId);
      const accountNumber = String(etagUpdate?.accountNumber ?? '').trim();

      if (!Number.isFinite(accountId) || accountId <= 0) {
        throw new Error('Expected @etagUpdate to contain a valid accountId for consolidation result assertions.');
      }

      if (!accountNumber) {
        throw new Error('Expected @etagUpdate to contain a valid accountNumber for consolidation result assertions.');
      }

      return { accountId, accountNumber };
    });
  }

  /**
   * Stores the selected consolidation business unit so later assertions can verify the actual chosen value.
   * @param businessUnitName - Business unit label captured from the UI.
   */
  private setSelectedBusinessUnitAlias(businessUnitName: string): void {
    cy.wrap(String(businessUnitName).trim(), { log: false }).as(SELECTED_BUSINESS_UNIT_ALIAS);
  }

  /**
   * Resolves the selected consolidation business unit captured during the select BU step.
   * @returns Chainable yielding the trimmed business unit name.
   */
  private getSelectedBusinessUnitAlias(): Cypress.Chainable<string> {
    return cy
      .get<string>(`@${SELECTED_BUSINESS_UNIT_ALIAS}`)
      .then((businessUnitName) => String(businessUnitName).trim());
  }

  /**
   * Waits until the select business unit screen has rendered either the autocomplete
   * input or the single-business-unit informational message.
   * @returns Chainable yielding the rendered business unit selection mode.
   */
  private waitForBusinessUnitSelectionMode(): Cypress.Chainable<'single' | 'multiple'> {
    return cy
      .get('body', { timeout: 10_000 })
      .should(($body) => {
        const hasBusinessUnitInput = $body.find(SelectBusinessUnitLocators.businessUnitInput).length > 0;
        const hasSingleBusinessUnitMessage = $body
          .find(SelectBusinessUnitLocators.singleBusinessUnitMessage)
          .toArray()
          .some((element) => Cypress.$(element).text().includes(SINGLE_BUSINESS_UNIT_MESSAGE_PREFIX));

        expect(
          hasBusinessUnitInput || hasSingleBusinessUnitMessage,
          'business unit autocomplete or single business unit message',
        ).to.be.true;
      })
      .then(($body) => {
        const hasBusinessUnitInput = $body.find(SelectBusinessUnitLocators.businessUnitInput).length > 0;
        return hasBusinessUnitInput ? 'multiple' : 'single';
      });
  }

  /**
   * Selects a business unit when the selector is present.
   * If a single business unit is auto-selected, verifies the informational message instead.
   */
  public selectBusinessUnitIfRequired(): void {
    // Wait for the select business unit form and its business unit branch to finish rendering
    // before deciding whether we are in the single-BU or autocomplete path.
    cy.get(SelectBusinessUnitLocators.heading, { timeout: 10_000 }).should('contain.text', 'Consolidate accounts');
    cy.get(SelectBusinessUnitLocators.defendantTypeHeading, { timeout: 10_000 }).should(
      'contain.text',
      'Defendant type',
    );
    cy.get(SelectBusinessUnitLocators.continueButton, { timeout: 10_000 }).should('be.visible');

    this.waitForBusinessUnitSelectionMode().then((mode) => {
      if (mode === 'single') {
        log('info', 'Business unit input not shown; using auto-selected single business unit');
        cy.contains(SelectBusinessUnitLocators.singleBusinessUnitMessage, SINGLE_BUSINESS_UNIT_MESSAGE_PREFIX, {
          timeout: 10_000,
        })
          .should('be.visible')
          .invoke('text')
          .then((text) => {
            const businessUnitName = text.replace(SINGLE_BUSINESS_UNIT_MESSAGE_PREFIX, '').trim();
            this.setSelectedBusinessUnitAlias(businessUnitName);
          });
        return;
      }

      log('select', 'Selecting first available business unit from autocomplete');
      cy.get(SelectBusinessUnitLocators.businessUnitInput, { timeout: 10_000 }).should('be.visible').click();
      cy.get(SelectBusinessUnitLocators.businessUnitAutoComplete, { timeout: 10_000 })
        .should('be.visible')
        .find('li')
        .first()
        .then(($item) => {
          const businessUnitName = $item.text().trim();
          this.setSelectedBusinessUnitAlias(businessUnitName);
          cy.wrap($item).click();
        });
    });
  }

  /**
   * Selects the requested defendant type radio option.
   * @param defendantType - "Individual" or "Company"
   */
  public selectDefendantType(defendantType: ConsolidationDefendantType): void {
    log('select', `Selecting defendant type: ${defendantType}`);

    if (defendantType === 'Individual') {
      cy.get(SelectBusinessUnitLocators.individualInput, { timeout: 10_000 })
        .should('exist')
        .and('not.be.disabled')
        .check({ force: true });
      return;
    }

    cy.get(SelectBusinessUnitLocators.companyInput, { timeout: 10_000 })
      .should('exist')
      .and('not.be.disabled')
      .check({ force: true });
  }

  /** Clicks Continue on the Select Business Unit screen. */
  public continueFromSelectBusinessUnit(): void {
    log('click', 'Clicking Continue on consolidation select business unit page');
    cy.get(SelectBusinessUnitLocators.continueButton, { timeout: 10_000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  /**
   * Waits for the consolidation account search screen to finish rendering after continuing
   * from the select business unit page.
   * @param defendantType - Expected defendant type shown on the search summary.
   */
  public waitForAccountSearchScreen(defendantType: ConsolidationDefendantType): void {
    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/consolidate-accounts');
    cy.get(AccountSearchLocators.heading, { timeout: 10_000 }).should('contain.text', 'Consolidate accounts');
    cy.get(AccountSearchLocators.summaryList, { timeout: 10_000 }).should('be.visible');
    cy.get(AccountSearchLocators.searchTabLink, { timeout: 10_000 }).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.defendantTypeValue, { timeout: 10_000 }).should('contain', defendantType);
    cy.get(AccountSearchLocators.accountNumberInput, { timeout: 10_000 }).should('be.visible');

    if (defendantType === 'Company') {
      cy.get(AccountSearchLocators.companyNameInput, { timeout: 10_000 }).should('be.visible');
    }
  }

  /** Asserts the user is on the consolidation business unit and defendant type selection screen. */
  public assertOnSelectBusinessUnitScreen(): void {
    log('assert', 'Verifying user is on consolidation select business unit screen');

    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/select-business-unit');
    cy.get(SelectBusinessUnitLocators.heading, { timeout: 10_000 }).should('contain.text', 'Consolidate accounts');
    cy.get(SelectBusinessUnitLocators.defendantTypeHeading).should('contain.text', 'Defendant type');
  }

  /** Clicks Search on the consolidation Search tab. */
  public clickSearch(): void {
    log('click', 'Clicking Search on consolidation account search page');
    cy.get(AccountSearchLocators.searchButton, { timeout: 10_000 }).should('be.visible').click();
  }

  /** Clicks the Clear search link on the consolidation Search tab. */
  public clearSearch(): void {
    log('click', 'Clearing consolidation account search form');
    cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search', { timeout: 10_000 })
      .should('be.visible')
      .click();
  }

  /** Asserts the user is on Consolidation account search for Individuals, Search tab active. */
  public assertOnSearchTabForIndividuals(): void {
    log('assert', 'Verifying user is on consolidation Search tab for Individuals');

    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/consolidate-accounts');
    cy.get(AccountSearchLocators.searchTabLink, { timeout: 10_000 }).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Individual');
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
  }

  /** Asserts the user is on Consolidation account search for Companies, Search tab active. */
  public assertOnSearchTabForCompanies(): void {
    log('assert', 'Verifying user is on consolidation Search tab for Companies');

    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/consolidate-accounts');
    cy.get(AccountSearchLocators.searchTabLink, { timeout: 10_000 }).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Company');
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
    cy.get(AccountSearchLocators.companyNameInput).should('be.visible');
  }

  /** Asserts the page-header back link is displayed on the consolidation shell. */
  public assertBackLinkIsDisplayed(): void {
    log('assert', 'Verifying consolidation page-header back link is displayed');
    cy.get(AccountSearchLocators.backLink, { timeout: 10_000 }).should('be.visible').and('contain.text', 'Back');
  }

  /** Clicks the page-header back link on the consolidation shell. */
  public clickBackLink(): void {
    log('click', 'Clicking consolidation page-header back link');
    cy.get(AccountSearchLocators.backLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
  }

  /** Clicks the Results tab from the consolidation flow. */
  public openResultsTab(): void {
    log('navigate', 'Opening consolidation Results tab');
    cy.get(AccountSearchLocators.resultsTab, { timeout: 10_000 }).should('be.visible').click();
  }

  /** Asserts the user is on the consolidation Results tab. */
  public assertOnResultsTab(): void {
    log('assert', 'Verifying user is on consolidation Results tab');

    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/consolidate-accounts');
    cy.get(AccountSearchLocators.resultsTab, { timeout: 10_000 }).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.searchButton).should('not.exist');
    cy.get(AccountResultsLocators.resultsTable, { timeout: 10_000 }).should('be.visible');
  }

  /**
   * Asserts the user is on the consolidation Results tab with the expected summary values.
   * Covers the active tab plus the displayed business unit and defendant type rows.
   * @param defendantType - Expected defendant type shown in the summary.
   */
  public assertOnResultsTabForDefendantType(defendantType: ConsolidationDefendantType): void {
    this.assertOnResultsTab();
    this.getSelectedBusinessUnitAlias().then((businessUnitName) => {
      cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
      cy.get(AccountSearchLocators.businessUnitValue).should('contain', businessUnitName);
      cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
      cy.get(AccountSearchLocators.defendantTypeValue).should('contain', defendantType);
    });
  }

  /** Asserts the no matching results state is shown with the Check your search hyperlink. */
  public assertNoMatchingResultsState(): void {
    log('assert', 'Verifying consolidation no matching results state');

    cy.get(AccountResultsLocators.resultsTable).should('not.exist');
    cy.get(AccountResultsLocators.invalidResultsHeading, { timeout: 10_000 }).should(
      'contain',
      'There are no matching results.',
    );
    cy.get(AccountResultsLocators.invalidResultsBody)
      .invoke('text')
      .then((text) => {
        const normalisedText = text.replace(/\s+/g, ' ').trim();
        expect(normalisedText).to.equal('Check your search and try again.');
      });
    cy.contains(AccountResultsLocators.invalidResultsLink, 'Check your search', { timeout: 10_000 }).should(
      'be.visible',
    );
  }

  /**
   * Asserts no consolidation result row displays the supplied balance.
   * @param balance - Forbidden rendered balance value, e.g. "£0.00"
   */
  public assertResultsExcludeBalance(balance: string): void {
    const forbiddenBalance = balance.trim();

    log('assert', 'Verifying consolidation results exclude balance', { forbiddenBalance });

    cy.get(AccountResultsLocators.resultsRows, { timeout: 10_000 }).its('length').should('be.gte', 1);
    cy.get(AccountResultsLocators.resultBalanceCell, { timeout: 10_000 }).each(($cell) => {
      const renderedBalance = $cell.text().replace(/\s+/g, ' ').trim();
      expect(renderedBalance).to.not.equal(forbiddenBalance);
    });
  }

  /**
   * Asserts consolidation results match the expected displayed order.
   * @param expectedRows - Expected result rows from the feature data table.
   */
  public assertResultsOrder(expectedRows: ConsolidationExpectedResultRow[]): void {
    log('assert', 'Verifying consolidation results against expected order', { expectedRows });

    const expectedColumns = Object.keys(expectedRows[0] ?? {});

    if (expectedColumns.length === 0) {
      throw new Error('Expected at least one consolidation results column in the data table.');
    }

    cy.get(AccountResultsLocators.resultAccountLink, { timeout: 10_000 })
      .its('length')
      .should('eq', expectedRows.length);
    cy.get(AccountResultsLocators.resultAccountLink, { timeout: 10_000 }).then(($accountLinks) => {
      const actualRows = [...$accountLinks].map((accountLink) => {
        const row = Cypress.$(accountLink).closest('tr');

        return Object.fromEntries(
          expectedColumns.map((column) => [column, this.getRenderedResultValue(row, column)]),
        ) as ConsolidationExpectedResultRow;
      });

      expect(actualRows).to.deep.equal(expectedRows);
    });
  }

  /** Clicks the Check your search hyperlink from the no matching results state. */
  public clickCheckYourSearchFromNoMatchingResults(): void {
    log('click', 'Clicking Check your search from consolidation no matching results state');
    cy.contains(AccountResultsLocators.invalidResultsLink, 'Check your search', { timeout: 10_000 })
      .should('be.visible')
      .click();
  }

  /** Asserts the newly created account number is displayed as a hyperlink in the results table. */
  public assertCreatedAccountLinkIsDisplayed(): void {
    this.getCreatedAccountAlias().then(({ accountNumber }) => {
      log('assert', 'Verifying created consolidation result account is displayed as a hyperlink', { accountNumber });

      cy.get(AccountResultsLocators.resultAccountLinkByNumber(accountNumber), { timeout: 10_000 })
        .should('be.visible')
        .and('have.class', 'govuk-link')
        .then(($link) => {
          expect($link.prop('tagName')).to.equal('A');
        });
    });
  }

  /** Opens the created consolidation result account and asserts it is opened in a new tab to the FAE details route. */
  public openCreatedAccountFromResultsInNewTab(): void {
    cy.intercept('GET', '**/defendant-accounts/**/header-summary').as('consolidationHeaderSummary');

    this.getCreatedAccountAlias().then(({ accountNumber }) => {
      log('open', 'Opening created consolidation result account from results', { accountNumber });

      cy.window().then((win) => {
        cy.stub(win, 'open')
          .callsFake((url?: string | URL, target?: string) => {
            expect(target).to.equal('_blank');
            win.location.href = String(url);
          })
          .as('consolidationWindowOpen');
      });

      cy.get(AccountResultsLocators.resultAccountLinkByNumber(accountNumber), { timeout: 10_000 })
        .should('be.visible')
        .click();

      cy.get('@consolidationWindowOpen').then((windowOpenStub) => {
        const stub = windowOpenStub as any;
        expect(stub.calledOnce).to.equal(true);

        const [openedUrl, target] = stub.getCall(0).args as [string, string];
        expect(target).to.equal('_blank');
        expect(String(openedUrl)).to.match(/\/fines\/account\/defendant\/\d+\/details$/);
      });

      cy.wait('@consolidationHeaderSummary', { timeout: 15_000 }).its('response.statusCode').should('eq', 200);
    });
  }

  /**
   * Asserts the consolidation search error page content for the given defendant type.
   * @param defendantType - "Individual" or "Company"
   */
  public assertSearchErrorPage(defendantType: ConsolidationDefendantType): void {
    const expectedBulletItems =
      defendantType === 'Individual'
        ? ['account number, or', 'national insurance number, or', 'advanced search']
        : ['account number, or', 'advanced search'];

    log('assert', 'Verifying consolidation search error page', { defendantType, expectedBulletItems });

    cy.get(ErrorPageLocators.root, { timeout: 10_000 }).should('be.visible');
    cy.get(`${ErrorPageLocators.root} ${ErrorPageLocators.heading}`).should('have.text', 'There is a problem');
    cy.get(`${ErrorPageLocators.root} ${ErrorPageLocators.message}`)
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const normalisedText = text.replace(/\s+/g, ' ').trim();
        expect(normalisedText).to.equal(
          'Reference data and account information cannot be entered together when searching for an account. Search using either:',
        );
      });

    cy.get(`${ErrorPageLocators.root} ${ErrorPageLocators.bulletItems}`).then(($items) => {
      const items = [...$items].map((item) => item.textContent?.replace(/\s+/g, ' ').trim().toLowerCase());
      expect(items).to.deep.equal(expectedBulletItems);
    });
  }

  /** Clicks the Go back link on the consolidation search error page. */
  public goBackFromSearchError(): void {
    log('click', 'Going back from consolidation search error page');
    cy.contains(`${ErrorPageLocators.root} ${ErrorPageLocators.backLink}`, 'Go back', { timeout: 10_000 })
      .should('be.visible')
      .click();
  }

  /**
   * Populates fields on the consolidation Search tab from key/value details.
   * @param details - Search details keyed by user-facing field labels.
   */
  public enterSearchDetails(details: SearchDetails): void {
    log('input', 'Entering consolidation search details', { details });
    const isCompanyDetails = Object.keys(details).some((k) => k.trim().toLowerCase() === 'company name');
    const activeTextMap = isCompanyDetails ? this.companyTextFieldSelectorMap : this.textFieldSelectorMap;
    const activeCheckboxMap = isCompanyDetails ? this.companyCheckboxSelectorMap : this.checkboxSelectorMap;

    Object.entries(details).forEach(([rawKey, value]) => {
      const key = rawKey.trim().toLowerCase();
      const resolvedValue = applyUniqPlaceholder(value);

      if (activeTextMap[key]) {
        const selector = activeTextMap[key];
        cy.get(selector).clear().type(resolvedValue);
        return;
      }

      if (activeCheckboxMap[key]) {
        const selector = activeCheckboxMap[key];
        const shouldCheck = this.parseCheckboxValue(resolvedValue);
        if (shouldCheck) {
          cy.get(selector).check({ force: true });
        } else {
          cy.get(selector).uncheck({ force: true });
        }
        return;
      }

      throw new Error(`Unsupported consolidation search field "${rawKey}".`);
    });
  }

  /** Switches Search -> Results -> For consolidation -> Search. */
  public switchTabsAndReturnToSearch(): void {
    log('navigate', 'Switching from Search to Results');
    cy.get(AccountSearchLocators.resultsTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

    log('navigate', 'Switching from Results to For consolidation');
    cy.get(AccountSearchLocators.forConsolidationTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

    log('navigate', 'Returning to Search tab');
    cy.get(AccountSearchLocators.searchTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
  }

  /** Switches Search -> Results -> For consolidation -> Search. */
  public switchTabsAndReturnToSearchCompany(): void {
    log('navigate', 'Switching from Search to Results');
    cy.get(AccountSearchLocators.resultsTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

    log('navigate', 'Switching from Results to For consolidation');
    cy.get(AccountSearchLocators.forConsolidationTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

    log('navigate', 'Returning to Search tab');
    cy.get(AccountSearchLocators.searchTab).click();
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
  }

  /**
   * Asserts Search tab fields/checkboxes match expected values.
   * @param details - Expected values keyed by user-facing field labels.
   */
  public assertSearchDetails(details: SearchDetails): void {
    log('assert', 'Asserting consolidation search details', { details });
    const isCompanyDetails = Object.keys(details).some((k) => k.trim().toLowerCase() === 'company name');
    const activeTextMap = isCompanyDetails ? this.companyTextFieldSelectorMap : this.textFieldSelectorMap;
    const activeCheckboxMap = isCompanyDetails ? this.companyCheckboxSelectorMap : this.checkboxSelectorMap;

    Object.entries(details).forEach(([rawKey, value]) => {
      const key = rawKey.trim().toLowerCase();
      const resolvedValue = applyUniqPlaceholder(value);

      if (activeTextMap[key]) {
        const selector = activeTextMap[key];
        cy.get(selector).should('have.value', resolvedValue);
        return;
      }

      if (activeCheckboxMap[key]) {
        const selector = activeCheckboxMap[key];
        const shouldCheck = this.parseCheckboxValue(resolvedValue);
        if (shouldCheck) {
          cy.get(selector).should('be.checked');
        } else {
          cy.get(selector).should('not.be.checked');
        }
        return;
      }

      throw new Error(`Unsupported consolidation search field "${rawKey}".`);
    });
  }
}
