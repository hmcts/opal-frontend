import { AccountSearchLocators } from '../../../shared/selectors/consolidation/AccountSearch.locators';
import { AccountResultsLocators } from '../../../shared/selectors/consolidation/AccountResults.locators';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-company-formatting.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-formatting.mock';
import { IFinesConSearchResultDefendantAccount } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { setupConsolidationComponent as mountConsolidationComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import {
  createCompanyFalseyResult,
  createCompanyMaxResultsMock,
  createCompanyTooManyResultsMock,
  createCompanyMultipleErrorsAndWarningsResult,
  createCompanyMultipleWarningsResult,
  createFalseyResult,
  createMaxResultsMock,
  createTooManyResultsMock,
  createMultipleErrorsAndWarningsResult,
  createMultipleWarningsResult,
} from './mocks/account_results_mock';

const EM_DASH = '—';
const individualResultsTableHeaders = [
  'Account',
  'Name',
  'Aliases',
  'Date of birth',
  'Address line 1',
  'Postcode',
  'CO',
  'ENF',
  'Balance',
  'P/G',
  'NI number',
  'Ref',
];
const companyResultsTableHeaders = [
  'Account',
  'Name',
  'Aliases',
  'Address line 1',
  'Postcode',
  'CO',
  'ENF',
  'Balance',
  'Ref',
];

const normaliseText = (value: string): string => value.replace(/\s+/g, ' ').trim();
type ExpectedResultsOrderRow = {
  account: string;
  name: string;
  dateOfBirth?: string;
};

describe('FinesConConsolidateAccComponent - Account Results', () => {
  let defendantAccountResults: IFinesConSearchResultDefendantAccount[] = structuredClone(
    FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK,
  );

  const defaultComponentProperties: IComponentProperties = {
    defendantType: 'individual',
    fragments: 'results',
  };

  const setupComponent = (componentProperties: IComponentProperties = {}) => {
    return mountConsolidationComponent({
      ...defaultComponentProperties,
      ...componentProperties,
      initialResults: defendantAccountResults,
    });
  };

  const assertResultsTabSummary = (defendantType: 'Individual' | 'Company' = 'Individual') => {
    cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
    cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
    cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
    cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', defendantType);
    cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');
  };

  const assertResultsSummary = (defendantType: 'Individual' | 'Company' = 'Individual') => {
    assertResultsTabSummary(defendantType);
    cy.get(AccountResultsLocators.resultsTable).should('be.visible');
  };

  const assertNoMatchingResultsState = (defendantType: 'Individual' | 'Company' = 'Individual') => {
    assertResultsTabSummary(defendantType);
    cy.get(AccountResultsLocators.resultsTable).should('not.exist');
    cy.get(AccountResultsLocators.messageHeading).should('contain', 'There are no matching results.');
    cy.get(AccountResultsLocators.invalidResultsBody)
      .invoke('text')
      .then((text) => {
        expect(normaliseText(text)).to.equal('Check your search and try again.');
      });
    cy.get(AccountResultsLocators.invalidResultsLink).should('contain', 'Check your search');
  };

  const assertTooManyResultsState = (defendantType: 'Individual' | 'Company' = 'Individual') => {
    assertResultsTabSummary(defendantType);
    cy.get(AccountResultsLocators.resultsTable).should('not.exist');
    cy.get(AccountResultsLocators.messageHeading).should('contain', 'There are more than 100 results.');
    cy.get(AccountResultsLocators.invalidResultsBody)
      .invoke('text')
      .then((text) => {
        expect(normaliseText(text)).to.equal('Try adding more information to your search.');
      });
    cy.get(AccountResultsLocators.invalidResultsLink).should('contain', 'Try adding more information');
  };

  const assertRowCellText = (accountNumber: string, cellSelector: string, expectedText: string) => {
    cy.get(AccountResultsLocators.resultRowWithAccount(accountNumber))
      .find(cellSelector)
      .should(($cell) => {
        expect(normaliseText($cell.text())).to.equal(expectedText);
      });
  };

  const assertDisplayedResultsOrder = (expectedRows: ExpectedResultsOrderRow[]) => {
    cy.get(AccountResultsLocators.resultAccountLink)
      .should('have.length', expectedRows.length)
      .then(($accountLinks) => {
        const actualRows = [...$accountLinks].map((accountLink) => {
          const row = Cypress.$(accountLink).closest('tr');
          const actualRow: ExpectedResultsOrderRow = {
            account: normaliseText(accountLink.textContent ?? ''),
            name: normaliseText(row.find(AccountResultsLocators.resultNameCell).text()),
          };

          if ('dateOfBirth' in expectedRows[0]) {
            actualRow.dateOfBirth = normaliseText(row.find(AccountResultsLocators.resultDateOfBirthCell).text());
          }

          return actualRow;
        });

        expect(actualRows).to.deep.equal(expectedRows);
      });
  };

  const buildIndividualResult = (
    overrides: Partial<IFinesConSearchResultDefendantAccount>,
  ): IFinesConSearchResultDefendantAccount => ({
    ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK[0]),
    aliases: null,
    checks: {
      errors: [],
      warnings: [],
    },
    ...overrides,
  });

  const buildCompanyResult = (
    overrides: Partial<IFinesConSearchResultDefendantAccount>,
  ): IFinesConSearchResultDefendantAccount => ({
    ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK[0]),
    aliases: null,
    checks: {
      errors: [],
      warnings: [],
    },
    ...overrides,
  });

  describe('Individual tests', () => {
    beforeEach(() => {
      defendantAccountResults = structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK);
    });

    it(
      'AC1, AC1a, AC1b. should render the individual account results tab with populated mock data',
      { tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-4943'] },
      () => {
        setupComponent();

        // AC1, AC1a, AC1b. Results tab renders with the selected business unit and defendant type.
        cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
        cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
        cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
        cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
        cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Individual');
        cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');

        // AC1. Results tab content renders with the results table and actions.
        cy.get(AccountResultsLocators.messageHeading).should('contain', 'Select accounts to consolidate');
        cy.get(AccountResultsLocators.addToListButton).should('contain', 'Add to list');
        cy.get(AccountResultsLocators.selectedAccountsHint).should('be.visible');
        cy.get(AccountResultsLocators.resultsTable).should('be.visible');
        cy.get(AccountResultsLocators.resultAccountLinkByNumber('ACC001')).should('be.visible');
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC001'))
          .find(AccountResultsLocators.resultNameCell)
          .should('contain', 'SMITH, John James');
      },
    );

    it(
      'AC2, AC2a, AC5a, AC5b, AC5c, AC5d, AC5e, AC5f, AC5g, AC5h, AC5i. should display the individual results columns in the AC order and format populated data',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5870'],
      },
      () => {
        defendantAccountResults[0].has_paying_parent_guardian = true; // Set to true to confirm Y is displayed in the relevant cell
        defendantAccountResults[0].checks = { errors: [], warnings: [] }; //checks should be empty for check boxes to appear
        setupComponent();

        assertResultsSummary();
        cy.get(AccountResultsLocators.resultSelectAllCheckbox).should('exist');
        // AC2a. Results table displays the named columns in the required order.
        cy.get(AccountResultsLocators.resultsTableNamedHeaders).then(($headers) => {
          const headers = [...$headers].map((header) => normaliseText(header.textContent ?? ''));
          expect(headers).to.deep.equal(individualResultsTableHeaders);
        });

        cy.get(AccountResultsLocators.resultAccountLinkByNumber('ACC001')).should('be.visible');
        // AC5a. Name displays SURNAME, Forename.
        assertRowCellText('ACC001', AccountResultsLocators.resultNameCell, 'SMITH, John James');
        // AC5b. Aliases display in ascending alias order when one or more aliases exist.
        assertRowCellText('ACC001', AccountResultsLocators.resultAliasesCell, 'ADAMS, Amy BAKER, Ben');
        // AC5c. Date of birth displays as DD Mon YYYY.
        assertRowCellText('ACC001', AccountResultsLocators.resultDateOfBirthCell, '03 Jan 1990');
        assertRowCellText('ACC001', AccountResultsLocators.resultAddressLine1Cell, '1 Main Street');
        assertRowCellText('ACC001', AccountResultsLocators.resultPostcodeCell, 'AB1 2CD');
        // AC5d. CO displays Y when collection order is true.
        assertRowCellText('ACC001', AccountResultsLocators.resultCollectionOrderCell, 'Y');
        // AC5e. ENF displays the most recent enforcement action code.
        assertRowCellText('ACC001', AccountResultsLocators.resultEnforcementCell, 'DISTRESS');
        // AC5f. Balance displays with a pound sign and currency formatting.
        assertRowCellText('ACC001', AccountResultsLocators.resultBalanceCell, '£120.50');
        // AC5g. P/G displays Y when a paying parent or guardian exists.
        assertRowCellText('ACC001', AccountResultsLocators.resultPayingParentGuardianCell, 'Y');
        // AC5h. NI number displays in the standard formatted layout.
        assertRowCellText('ACC001', AccountResultsLocators.resultNationalInsuranceNumberCell, 'QQ 12 34 56 C');
        // AC5i. Ref displays the prosecutor case reference when present.
        assertRowCellText('ACC001', AccountResultsLocators.resultRefCell, 'REF-1');
      },
    );

    it(
      'AC2b, AC2c, AC5b, AC5d, AC5fi, AC5g. should display an em dash for optional or unavailable account data',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5871'],
      },
      () => {
        defendantAccountResults.push(createFalseyResult());

        setupComponent();

        assertResultsSummary();
        cy.get(AccountResultsLocators.resultAccountLinkByNumber('ACC002')).should('be.visible');
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC002'))
          .find(AccountResultsLocators.resultNameCell)
          .should('contain', EM_DASH);
        // AC5b. Aliases display only when aliases exist; otherwise the no-data marker is shown.
        assertRowCellText('ACC002', AccountResultsLocators.resultAliasesCell, EM_DASH);
        assertRowCellText('ACC002', AccountResultsLocators.resultDateOfBirthCell, EM_DASH);
        assertRowCellText('ACC002', AccountResultsLocators.resultAddressLine1Cell, EM_DASH);
        assertRowCellText('ACC002', AccountResultsLocators.resultPostcodeCell, EM_DASH);
        // AC5d. CO displays an '-' when collection order is false.
        assertRowCellText('ACC002', AccountResultsLocators.resultCollectionOrderCell, '-');
        assertRowCellText('ACC002', AccountResultsLocators.resultEnforcementCell, EM_DASH);
        assertRowCellText('ACC002', AccountResultsLocators.resultBalanceCell, EM_DASH);
        // AC5g. P/G displays an '-' when there is no paying parent or guardian.
        assertRowCellText('ACC002', AccountResultsLocators.resultPayingParentGuardianCell, '-');
        assertRowCellText('ACC002', AccountResultsLocators.resultNationalInsuranceNumberCell, EM_DASH);
        assertRowCellText('ACC002', AccountResultsLocators.resultRefCell, EM_DASH);
      },
    );

    it(
      'AC2d, AC2e. should display a maximum of 100 accounts on a single scrollable page with no pagination',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5872'],
      },
      () => {
        defendantAccountResults = createMaxResultsMock();

        setupComponent();

        assertResultsSummary();
        // AC2e. Results are displayed on a single scrollable page.
        cy.get(AccountResultsLocators.resultsScrollPane).should('exist');
        // AC2e. No pagination is displayed.
        cy.get(AccountResultsLocators.resultsPagination).should('not.exist');
        // AC2d. A maximum of 100 accounts are displayed per search.
        cy.get(AccountResultsLocators.resultAccountLink).should('have.length', 100);
        cy.get(AccountResultsLocators.resultAccountLinkByNumber('ACC100')).should('be.visible');
      },
    );

    it(
      'AC3. should display individual results in Name, Date of birth, then Account number ascending order',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5873'],
      },
      () => {
        defendantAccountResults = [
          buildIndividualResult({
            defendant_account_id: 14,
            account_number: 'ACC003',
            defendant_surname: 'Resultlink',
            defendant_firstnames: 'Aaron',
            birth_date: '2003-05-15',
          }),
          buildIndividualResult({
            defendant_account_id: 11,
            account_number: 'ACC001',
            defendant_surname: 'Resultlink',
            defendant_firstnames: 'Consolidation',
            birth_date: '2001-05-15',
          }),
          buildIndividualResult({
            defendant_account_id: 12,
            account_number: 'ACC002',
            defendant_surname: 'Resultlink',
            defendant_firstnames: 'Consolidation',
            birth_date: '2001-05-15',
          }),
          buildIndividualResult({
            defendant_account_id: 13,
            account_number: 'ACC004',
            defendant_surname: 'Resultlink',
            defendant_firstnames: 'Consolidation',
            birth_date: '2002-05-15',
          }),
        ];

        setupComponent();

        assertResultsSummary();
        assertDisplayedResultsOrder([
          { account: 'ACC003', name: 'RESULTLINK, Aaron', dateOfBirth: '15 May 2003' },
          { account: 'ACC001', name: 'RESULTLINK, Consolidation', dateOfBirth: '15 May 2001' },
          { account: 'ACC002', name: 'RESULTLINK, Consolidation', dateOfBirth: '15 May 2001' },
          { account: 'ACC004', name: 'RESULTLINK, Consolidation', dateOfBirth: '15 May 2002' },
        ]);
      },
    );

    it(
      'AC1a, AC1b, AC3, AC3a, AC3b, AC3c. should display the individual over-100 results state with the try adding more information link',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2420', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5874'],
      },
      () => {
        defendantAccountResults = createTooManyResultsMock();

        setupComponent();
        // AC1a, AC1b. The Business unit row displays the Business Unit used in the search The Defendant type row displays the defendant type used in the search.
        assertResultsTabSummary();

        assertTooManyResultsState();
      },
    );

    it(
      'AC1a, AC1b, AC2, AC2a, AC2b, AC2c. should display the individual no-results state with the check your search link',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2420', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5875'],
      },
      () => {
        defendantAccountResults = [];

        setupComponent();
        // AC1a, AC1b. The Business unit row displays the Business Unit used in the search The Defendant type row displays the defendant type used in the search.
        assertResultsTabSummary();

        assertNoMatchingResultsState();
      },
    );

    it(
      'AC7. should display warning and error checks beneath the relevant account row',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5876'],
      },
      () => {
        setupComponent();

        assertResultsSummary();
        // AC7. Checks are displayed beneath the relevant account row.
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC001'))
          .next(AccountResultsLocators.resultTableRow)
          .find(AccountResultsLocators.resultChecksCellByAccountId(11))
          .should('be.visible')
          .and('contain', 'Account has days in default');
      },
    );

    it(
      'AC7a, AC7b. should show only errors when both errors and warnings exist, listing multiple errors as bullets',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5877'],
      },
      () => {
        defendantAccountResults = [createMultipleErrorsAndWarningsResult()];

        setupComponent();

        assertResultsSummary();
        // AC7a. Only errors are displayed when both errors and warnings exist.
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC005'))
          .next(AccountResultsLocators.resultTableRow)
          .find(AccountResultsLocators.resultChecksCellByAccountId(15))
          .should('contain', 'Account status is CS')
          .and('contain', 'Account is blocked for consolidation')
          .and('not.contain', 'Account has uncleared cheque payments')
          .and('not.contain', 'Account has linked cases');
        // AC7b. Multiple errors are displayed as bullet points.
        cy.get(AccountResultsLocators.resultChecksCellByAccountId(15))
          .find(AccountResultsLocators.resultChecksBulletItems)
          .should('have.length', 2);
      },
    );

    it(
      'AC7c. should display all warnings when multiple warnings apply and no errors exist',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2415', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5878'],
      },
      () => {
        defendantAccountResults = [createMultipleWarningsResult()];

        setupComponent();

        assertResultsSummary();
        // AC7c. Multiple warnings are displayed when no errors apply.
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC006'))
          .next(AccountResultsLocators.resultTableRow)
          .find(AccountResultsLocators.resultChecksCellByAccountId(16))
          .should('contain', 'Account has uncleared cheque payments')
          .and('contain', 'Account has linked cases');
        cy.get(AccountResultsLocators.resultChecksCellByAccountId(16))
          .find(AccountResultsLocators.resultChecksBulletItems)
          .should('have.length', 2);
      },
    );
  });

  describe('Company tests', () => {
    beforeEach(() => {
      defendantAccountResults = structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK);
    });

    it(
      'AC1, AC1a, AC1b. should render the company account results tab with populated mock data',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5879'],
      },
      () => {
        setupComponent({ defendantType: 'company' });

        cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
        cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
        cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
        cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
        cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Company');
        cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');

        cy.get(AccountResultsLocators.messageHeading).should('contain', 'Select accounts to consolidate');
        cy.get(AccountResultsLocators.addToListButton).should('contain', 'Add to list');
        cy.get(AccountResultsLocators.selectedAccountsHint).should('be.visible');
        cy.get(AccountResultsLocators.resultsTable).should('be.visible');
        cy.get(AccountResultsLocators.resultAccountLinkByNumber('COMP001')).should('be.visible');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP001'))
          .find(AccountResultsLocators.resultNameCell)
          .should('contain', 'Acme Corporation');
      },
    );

    it(
      'AC2, AC2a, AC5a, AC5b, AC5d, AC5e, AC5f, AC5i. should display the company results columns in the AC order and format populated data',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5880'],
      },
      () => {
        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountResultsLocators.resultSelectAllCheckbox).should('exist');
        cy.get(AccountResultsLocators.resultsTableNamedHeaders).then(($headers) => {
          const headers = [...$headers].map((header) => normaliseText(header.textContent ?? ''));
          expect(headers).to.deep.equal(companyResultsTableHeaders);
        });

        cy.get(AccountResultsLocators.resultAccountLinkByNumber('COMP001')).should('be.visible');
        assertRowCellText('COMP001', AccountResultsLocators.resultNameCell, 'Acme Corporation');
        assertRowCellText('COMP001', AccountResultsLocators.resultAliasesCell, 'Alpha Ltd Bravo Ltd');
        assertRowCellText('COMP001', AccountResultsLocators.resultAddressLine1Cell, '21 Company Street');
        assertRowCellText('COMP001', AccountResultsLocators.resultPostcodeCell, 'CO1 2MP');
        assertRowCellText('COMP001', AccountResultsLocators.resultCollectionOrderCell, 'Y');
        assertRowCellText('COMP001', AccountResultsLocators.resultEnforcementCell, 'DISTRESS');
        assertRowCellText('COMP001', AccountResultsLocators.resultBalanceCell, '£520.50');
        assertRowCellText('COMP001', AccountResultsLocators.resultRefCell, 'COMP-REF-1');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP001'))
          .find(AccountResultsLocators.resultDateOfBirthCell)
          .should('not.exist');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP001'))
          .find(AccountResultsLocators.resultPayingParentGuardianCell)
          .should('not.exist');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP001'))
          .find(AccountResultsLocators.resultNationalInsuranceNumberCell)
          .should('not.exist');
      },
    );

    it(
      'AC2b, AC2c, AC5b, AC5d, AC5fi. should display an em dash for unavailable company account data',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5881'],
      },
      () => {
        defendantAccountResults.push(createCompanyFalseyResult());

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountResultsLocators.resultAccountLinkByNumber('COMP002')).should('be.visible');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP002'))
          .find(AccountResultsLocators.resultNameCell)
          .should('contain', EM_DASH);
        assertRowCellText('COMP002', AccountResultsLocators.resultAliasesCell, EM_DASH);
        assertRowCellText('COMP002', AccountResultsLocators.resultAddressLine1Cell, EM_DASH);
        assertRowCellText('COMP002', AccountResultsLocators.resultPostcodeCell, EM_DASH);
        assertRowCellText('COMP002', AccountResultsLocators.resultCollectionOrderCell, '-');
        assertRowCellText('COMP002', AccountResultsLocators.resultEnforcementCell, EM_DASH);
        assertRowCellText('COMP002', AccountResultsLocators.resultBalanceCell, EM_DASH);
        assertRowCellText('COMP002', AccountResultsLocators.resultRefCell, EM_DASH);
      },
    );

    it(
      'AC2d, AC2e. should display a maximum of 100 company accounts on a single scrollable page with no pagination',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5882'],
      },
      () => {
        defendantAccountResults = createCompanyMaxResultsMock();

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountResultsLocators.resultsScrollPane).should('exist');
        cy.get(AccountResultsLocators.resultsPagination).should('not.exist');
        cy.get(AccountResultsLocators.resultAccountLink).should('have.length', 100);
        cy.get(AccountResultsLocators.resultAccountLinkByNumber('COMP100')).should('be.visible');
      },
    );

    it(
      'AC3. should display company results in Name, then Account number ascending order',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5883'],
      },
      () => {
        defendantAccountResults = [
          buildCompanyResult({
            defendant_account_id: 24,
            account_number: 'COMP003',
            organisation_name: 'Alpha Holdings',
          }),
          buildCompanyResult({
            defendant_account_id: 21,
            account_number: 'COMP001',
            organisation_name: 'Beta Holdings',
          }),
          buildCompanyResult({
            defendant_account_id: 22,
            account_number: 'COMP002',
            organisation_name: 'Beta Holdings',
          }),
          buildCompanyResult({
            defendant_account_id: 23,
            account_number: 'COMP004',
            organisation_name: 'Gamma Holdings',
          }),
        ];

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        assertDisplayedResultsOrder([
          { account: 'COMP003', name: 'Alpha Holdings' },
          { account: 'COMP001', name: 'Beta Holdings' },
          { account: 'COMP002', name: 'Beta Holdings' },
          { account: 'COMP004', name: 'Gamma Holdings' },
        ]);
      },
    );

    it(
      'AC1a, AC1b, AC3, AC3a, AC3b, AC3c. should display the company over-100 results state with the try adding more information link',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2420', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5884'],
      },
      () => {
        defendantAccountResults = createCompanyTooManyResultsMock();

        setupComponent({ defendantType: 'company' });

        // AC1a, AC1b. The Business unit row displays the Business Unit used in the search The Defendant type row displays the defendant type used in the search.
        assertResultsTabSummary('Company');
        assertTooManyResultsState('Company');
      },
    );

    it(
      'AC1a, AC1b, AC2, AC2a, AC2b, AC2c. should display the company no-results state with the check your search link',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2420', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5885'],
      },
      () => {
        defendantAccountResults = [];

        setupComponent({ defendantType: 'company' });

        // AC1a, AC1b. The Business unit row displays the Business Unit used in the search The Defendant type row displays the defendant type used in the search.
        assertResultsTabSummary('Company');
        assertNoMatchingResultsState('Company');
      },
    );

    it(
      'AC7. should display warning and error checks beneath the relevant company account row',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5886'],
      },
      () => {
        defendantAccountResults[0].checks = {
          errors: [{ reference: 'CON.ER.4', message: 'Account has days in default' }],
          warnings: [],
        };

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP001'))
          .next(AccountResultsLocators.resultTableRow)
          .find(AccountResultsLocators.resultChecksCellByAccountId(21))
          .should('be.visible')
          .and('contain', 'Account has days in default');
      },
    );

    it(
      'AC7a, AC7b. should show only errors for company results when both errors and warnings exist, listing multiple errors as bullets',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5887'],
      },
      () => {
        defendantAccountResults = [createCompanyMultipleErrorsAndWarningsResult()];

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP005'))
          .next(AccountResultsLocators.resultTableRow)
          .find(AccountResultsLocators.resultChecksCellByAccountId(25))
          .should('contain', 'Account status is CS')
          .and('contain', 'Account is blocked for consolidation')
          .and('not.contain', 'Account has uncleared cheque payments')
          .and('not.contain', 'Account has linked cases');
        cy.get(AccountResultsLocators.resultChecksCellByAccountId(25))
          .find(AccountResultsLocators.resultChecksBulletItems)
          .should('have.length', 2);
      },
    );

    it(
      'AC7c. should display all warnings for company results when multiple warnings apply and no errors exist',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2421', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5888'],
      },
      () => {
        defendantAccountResults = [createCompanyMultipleWarningsResult()];

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountResultsLocators.resultRowWithAccount('COMP006'))
          .next(AccountResultsLocators.resultTableRow)
          .find(AccountResultsLocators.resultChecksCellByAccountId(26))
          .should('contain', 'Account has uncleared cheque payments')
          .and('contain', 'Account has linked cases');
        cy.get(AccountResultsLocators.resultChecksCellByAccountId(26))
          .find(AccountResultsLocators.resultChecksBulletItems)
          .should('have.length', 2);
      },
    );
  });

  describe('Results tab functionality tests', () => {
    beforeEach(() => {
      defendantAccountResults = structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK);
    });

    it(
      'AC3, AC3a, AC3b. should show row checkboxes for selectable accounts, hide them for errors, and keep warning rows enabled',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2416', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5889'],
      },
      () => {
        defendantAccountResults[0].checks = { errors: [], warnings: [] };
        defendantAccountResults.push(createMultipleErrorsAndWarningsResult(), createMultipleWarningsResult());

        setupComponent();

        assertResultsSummary();

        // AC3. Each row includes a checkbox for selecting or unselecting the account.
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(11))
          .should('exist')
          .and('be.enabled')
          .and('not.be.checked')
          .check({ force: true })
          .should('be.checked');
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(11))
          .uncheck({ force: true })
          .should('not.be.checked');

        // AC3a. Accounts that contain one or more errors have their checkbox hidden.
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC005'))
          .find(AccountResultsLocators.resultRowCheckboxByAccountId(15))
          .should('not.exist');

        // AC3b. Accounts that contain warnings keep their checkbox enabled.
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(16)).should('exist').and('be.enabled');
      },
    );

    it(
      'AC4, AC4a, AC4b, AC4c, AC5a, AC5b, AC5c. should bulk select and deselect all enabled accounts while excluding accounts with errors',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2416', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5890'],
      },
      () => {
        defendantAccountResults[0].checks = { errors: [], warnings: [] };
        defendantAccountResults.push(createMultipleErrorsAndWarningsResult(), createMultipleWarningsResult());

        setupComponent();

        assertResultsSummary();

        // AC4. A top-level checkbox is displayed above the table to allow bulk selection.
        // AC5a, AC5b. The dynamic counter shows selected accounts against the total returned results.
        cy.get(AccountResultsLocators.selectedAccountsHint).should('contain', '0 of 3 accounts selected');

        // AC4a. Selecting the top-level checkbox selects all enabled accounts in the results.
        cy.get(AccountResultsLocators.resultSelectAllCheckbox)
          .should('exist')
          .and('not.be.checked')
          .check({ force: true })
          .should('be.checked');

        // AC4b. Accounts with one or more errors are not selected.
        // AC5c. The counter updates automatically as accounts are selected.
        cy.get(AccountResultsLocators.selectedAccountsHint).should('contain', '2 of 3 accounts selected');
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(11)).should('be.checked');
        cy.get(AccountResultsLocators.resultRowWithAccount('ACC005'))
          .find(AccountResultsLocators.resultRowCheckboxByAccountId(15))
          .should('not.exist');
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(16)).should('be.checked');

        // AC4c. Deselecting the top-level checkbox deselects all currently selected accounts.
        // AC5c. The counter updates automatically as accounts are deselected.
        cy.get(AccountResultsLocators.resultSelectAllCheckbox).uncheck({ force: true }).should('not.be.checked');

        cy.get(AccountResultsLocators.selectedAccountsHint).should('contain', '0 of 3 accounts selected');
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(11)).should('not.be.checked');
        cy.get(AccountResultsLocators.resultRowCheckboxByAccountId(16)).should('not.be.checked');
      },
    );

    it(
      'AC6, AC6a, AC6b. should display Add to list above the counter and show a validation error when no accounts are selected',
      {
        tags: ['@JIRA-STORY:PO-2294', '@JIRA-STORY:PO-2416', '@JIRA-LABEL:consolidation', '@JIRA-KEY:POT-5891'],
      },
      () => {
        defendantAccountResults[0].checks = { errors: [], warnings: [] };

        setupComponent();

        assertResultsSummary();

        // AC6. An Add to list button is displayed above the counter.
        cy.get(AccountResultsLocators.addToListButton)
          .should('be.visible')
          .and('contain', 'Add to list')
          .then(($button) => {
            cy.get(AccountResultsLocators.selectedAccountsHint).then(($hint) => {
              expect($button[0].compareDocumentPosition($hint[0]) & Node.DOCUMENT_POSITION_FOLLOWING).to.not.equal(0);
            });
          });

        // AC6a, AC6b. Selecting Add to list validates the selected accounts and shows an error when none are selected.
        cy.get(AccountResultsLocators.addToListButton).click();

        cy.get(AccountSearchLocators.errorSummary)
          .should('be.visible')
          .and('contain', 'Select 1 or more accounts to consolidate.');
        cy.get(AccountResultsLocators.addToListErrorMessage)
          .should('be.visible')
          .and('contain', 'Select 1 or more accounts to consolidate.');
      },
    );
  });
});
