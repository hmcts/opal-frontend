import { AccountSearchLocators } from '../../../shared/selectors/consolidation/AccountSearch.locators';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-formatting.mock';
import { IFinesConSearchResultDefendantAccount } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { setupConsolidationComponent as mountConsolidationComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import { createFalseyResult, createMaxResultsMock, createZeroBalanceResult } from './mocks/account_results_mock';

const CONSOLIDATION_JIRA_LABEL = '@JIRA-LABEL:consolidation';
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

const buildTags = (...tags: string[]): string[] => [...tags, CONSOLIDATION_JIRA_LABEL];
const normaliseText = (value: string): string => value.replace(/\s+/g, ' ').trim();

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

  beforeEach(() => {
    defendantAccountResults = structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK);
  });

  const assertResultsSummary = () => {
    cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
    cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
    cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
    cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Individual');
    cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.resultsTable).should('be.visible');
  };

  const assertRowCellText = (accountNumber: string, cellSelector: string, expectedText: string) => {
    cy.get(AccountSearchLocators.resultRowWithAccount(accountNumber))
      .find(cellSelector)
      .should(($cell) => {
        expect(normaliseText($cell.text())).to.equal(expectedText);
      });
  };

  it(
    'AC1, AC1a, AC1b. should render the individual account results tab with populated mock data',
    { tags: buildTags() },
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
      cy.get(AccountSearchLocators.resultsHeading).should('contain', 'Select accounts to consolidate');
      cy.get(AccountSearchLocators.addToListButton).should('contain', 'Add to list');
      cy.get(AccountSearchLocators.selectedAccountsHint).should('be.visible');
      cy.get(AccountSearchLocators.resultsTable).should('be.visible');
      cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC001')).should('be.visible');
      cy.get(AccountSearchLocators.resultRowWithAccount('ACC001'))
        .find(AccountSearchLocators.resultNameCell)
        .should('contain', 'SMITH, John James');
    },
  );

  it(
    'AC2, AC2a, AC5a, AC5b, AC5c, AC5d, AC5e, AC5f, AC5g, AC5h, AC5i. should display the individual results columns in the AC order and format populated data',
    { tags: buildTags() },
    () => {
      defendantAccountResults[0].has_paying_parent_guardian = true; // Set to true to confirm Y is displayed in the relevant cell
      defendantAccountResults[0].checks = { errors: [], warnings: [] }; //checks should be empty for check boxes to appear
      setupComponent();

      assertResultsSummary();
      cy.get(AccountSearchLocators.resultSelectAllCheckbox).should('exist');
      // AC2a. Results table displays the named columns in the required order.
      cy.get(AccountSearchLocators.resultsTableNamedHeaders).then(($headers) => {
        const headers = [...$headers].map((header) => normaliseText(header.textContent ?? ''));
        expect(headers).to.deep.equal(individualResultsTableHeaders);
      });

      cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC001')).should('be.visible');
      // AC5a. Name displays SURNAME, Forename.
      assertRowCellText('ACC001', AccountSearchLocators.resultNameCell, 'SMITH, John James');
      // AC5b. Aliases display in ascending alias order when one or more aliases exist.
      assertRowCellText('ACC001', AccountSearchLocators.resultAliasesCell, 'ADAMS, Amy BAKER, Ben');
      // AC5c. Date of birth displays as DD Mon YYYY.
      assertRowCellText('ACC001', AccountSearchLocators.resultDateOfBirthCell, '03 Jan 1990');
      assertRowCellText('ACC001', AccountSearchLocators.resultAddressLine1Cell, '1 Main Street');
      assertRowCellText('ACC001', AccountSearchLocators.resultPostcodeCell, 'AB1 2CD');
      // AC5d. CO displays Y when collection order is true.
      assertRowCellText('ACC001', AccountSearchLocators.resultCollectionOrderCell, 'Y');
      // AC5e. ENF displays the most recent enforcement action code.
      assertRowCellText('ACC001', AccountSearchLocators.resultEnforcementCell, 'DISTRESS');
      // AC5f. Balance displays with a pound sign and currency formatting.
      assertRowCellText('ACC001', AccountSearchLocators.resultBalanceCell, '£120.50');
      // AC5g. P/G displays Y when a paying parent or guardian exists.
      assertRowCellText('ACC001', AccountSearchLocators.resultPayingParentGuardianCell, 'Y');
      // AC5h. NI number displays in the standard formatted layout.
      assertRowCellText('ACC001', AccountSearchLocators.resultNationalInsuranceNumberCell, 'QQ 12 34 56 C');
      // AC5i. Ref displays the prosecutor case reference when present.
      assertRowCellText('ACC001', AccountSearchLocators.resultRefCell, 'REF-1');
    },
  );

  it(
    'AC2b, AC2c, AC5b, AC5d, AC5fi, AC5g. should display an em dash for optional or unavailable account data',
    { tags: buildTags() },
    () => {
      defendantAccountResults.push(createFalseyResult(), createZeroBalanceResult());

      setupComponent();

      assertResultsSummary();
      cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC002')).should('be.visible');
      cy.get(AccountSearchLocators.resultRowWithAccount('ACC002'))
        .find(AccountSearchLocators.resultNameCell)
        .should('contain', EM_DASH);
      // AC5b. Aliases display only when aliases exist; otherwise the no-data marker is shown.
      assertRowCellText('ACC002', AccountSearchLocators.resultAliasesCell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultDateOfBirthCell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultAddressLine1Cell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultPostcodeCell, EM_DASH);
      // AC5d. CO displays an em dash when collection order is false.
      assertRowCellText('ACC002', AccountSearchLocators.resultCollectionOrderCell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultEnforcementCell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultBalanceCell, EM_DASH);
      // AC5g. P/G displays an em dash when there is no paying parent or guardian.
      assertRowCellText('ACC002', AccountSearchLocators.resultPayingParentGuardianCell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultNationalInsuranceNumberCell, EM_DASH);
      assertRowCellText('ACC002', AccountSearchLocators.resultRefCell, EM_DASH);

      // AC5fi. Zero balance accounts are filtered out of the displayed results.
      cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC003')).should('not.exist');
      cy.get(AccountSearchLocators.resultsRows).should('have.length', 2);
    },
  );

  it(
    'AC2d, AC2e. should display a maximum of 100 accounts on a single scrollable page with no pagination',
    { tags: buildTags() },
    () => {
      defendantAccountResults = createMaxResultsMock();

      setupComponent();

      assertResultsSummary();
      // AC2e. Results are displayed on a single scrollable page.
      cy.get(AccountSearchLocators.resultsScrollPane).should('exist');
      // AC2e. No pagination is displayed.
      cy.get(AccountSearchLocators.resultsPagination).should('not.exist');
      // AC2d. A maximum of 100 accounts are displayed per search.
      cy.get(AccountSearchLocators.resultAccountLink).should('have.length', 100);
      cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC100')).should('be.visible');
    },
  );
});
