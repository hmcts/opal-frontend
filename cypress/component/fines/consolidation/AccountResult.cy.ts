import { AccountSearchLocators } from '../../../shared/selectors/consolidation/AccountSearch.locators';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-company-formatting.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-formatting.mock';
import { IFinesConSearchResultDefendantAccount } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { setupConsolidationComponent as mountConsolidationComponent } from './setup/SetupComponent';
import { IComponentProperties } from './setup/setupComponent.interface';
import {
  createCompanyFalseyResult,
  createCompanyMaxResultsMock,
  createCompanyMultipleErrorsAndWarningsResult,
  createCompanyMultipleWarningsResult,
  createCompanyZeroBalanceResult,
  createFalseyResult,
  createMaxResultsMock,
  createMultipleErrorsAndWarningsResult,
  createMultipleWarningsResult,
  createZeroBalanceResult,
} from './mocks/account_results_mock';

const CONSOLIDATION_JIRA_LABEL = '@JIRA-LABEL:consolidation';
const CONSOLIDATION_EPIC_TAG = '@JIRA-STORY:PO-2294';
const INDIVIDUAL_STORY_TAG = '@JIRA-STORY:PO-2415';
const COMPANY_STORY_TAG = '@JIRA-STORY:PO-2421';
const RESULTS_TAB_FUNCTIONALITY_STORY_TAG = '@JIRA-STORY:PO-2416';
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

const buildTags = (...tags: string[]): string[] => [...tags, CONSOLIDATION_JIRA_LABEL];
const buildIndividualTags = (...tags: string[]): string[] =>
  buildTags(CONSOLIDATION_EPIC_TAG, INDIVIDUAL_STORY_TAG, ...tags);
const buildCompanyTags = (...tags: string[]): string[] => buildTags(CONSOLIDATION_EPIC_TAG, COMPANY_STORY_TAG, ...tags);
const buildResultsTabFunctionalityTags = (...tags: string[]): string[] =>
  buildTags(CONSOLIDATION_EPIC_TAG, RESULTS_TAB_FUNCTIONALITY_STORY_TAG, ...tags);
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

  const assertResultsSummary = (defendantType: 'Individual' | 'Company' = 'Individual') => {
    cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
    cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
    cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
    cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', defendantType);
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

  describe('Individual tests', () => {
    beforeEach(() => {
      defendantAccountResults = structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK);
    });

    it(
      'AC1, AC1a, AC1b. should render the individual account results tab with populated mock data',
      { tags: buildIndividualTags() },
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
      { tags: buildIndividualTags() },
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
      { tags: buildIndividualTags() },
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
        // AC5d. CO displays an '-' when collection order is false.
        assertRowCellText('ACC002', AccountSearchLocators.resultCollectionOrderCell, '-');
        assertRowCellText('ACC002', AccountSearchLocators.resultEnforcementCell, EM_DASH);
        assertRowCellText('ACC002', AccountSearchLocators.resultBalanceCell, EM_DASH);
        // AC5g. P/G displays an '-' when there is no paying parent or guardian.
        assertRowCellText('ACC002', AccountSearchLocators.resultPayingParentGuardianCell, '-');
        assertRowCellText('ACC002', AccountSearchLocators.resultNationalInsuranceNumberCell, EM_DASH);
        assertRowCellText('ACC002', AccountSearchLocators.resultRefCell, EM_DASH);

        // AC5fi. Zero balance accounts are filtered out of the displayed results.
        cy.get(AccountSearchLocators.resultAccountLinkByNumber('ACC003')).should('not.exist');
        cy.get(AccountSearchLocators.resultsRows).should('have.length', 2);
      },
    );

    it(
      'AC2d, AC2e. should display a maximum of 100 accounts on a single scrollable page with no pagination',
      { tags: buildIndividualTags() },
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

    it(
      'AC7. should display warning and error checks beneath the relevant account row',
      { tags: buildIndividualTags() },
      () => {
        setupComponent();

        assertResultsSummary();
        // AC7. Checks are displayed beneath the relevant account row.
        cy.get(AccountSearchLocators.resultRowWithAccount('ACC001'))
          .next(AccountSearchLocators.resultTableRow)
          .find(AccountSearchLocators.resultChecksCellByAccountId(11))
          .should('be.visible')
          .and('contain', 'Account has days in default');
      },
    );

    it(
      'AC7a, AC7b. should show only errors when both errors and warnings exist, listing multiple errors as bullets',
      { tags: buildIndividualTags() },
      () => {
        defendantAccountResults = [createMultipleErrorsAndWarningsResult()];

        setupComponent();

        assertResultsSummary();
        // AC7a. Only errors are displayed when both errors and warnings exist.
        cy.get(AccountSearchLocators.resultRowWithAccount('ACC005'))
          .next(AccountSearchLocators.resultTableRow)
          .find(AccountSearchLocators.resultChecksCellByAccountId(15))
          .should('contain', 'Account status is CS')
          .and('contain', 'Account is blocked for consolidation')
          .and('not.contain', 'Account has uncleared cheque payments')
          .and('not.contain', 'Account has linked cases');
        // AC7b. Multiple errors are displayed as bullet points.
        cy.get(AccountSearchLocators.resultChecksCellByAccountId(15))
          .find(AccountSearchLocators.resultChecksBulletItems)
          .should('have.length', 2);
      },
    );

    it(
      'AC7c. should display all warnings when multiple warnings apply and no errors exist',
      { tags: buildIndividualTags() },
      () => {
        defendantAccountResults = [createMultipleWarningsResult()];

        setupComponent();

        assertResultsSummary();
        // AC7c. Multiple warnings are displayed when no errors apply.
        cy.get(AccountSearchLocators.resultRowWithAccount('ACC006'))
          .next(AccountSearchLocators.resultTableRow)
          .find(AccountSearchLocators.resultChecksCellByAccountId(16))
          .should('contain', 'Account has uncleared cheque payments')
          .and('contain', 'Account has linked cases');
        cy.get(AccountSearchLocators.resultChecksCellByAccountId(16))
          .find(AccountSearchLocators.resultChecksBulletItems)
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
      { tags: buildCompanyTags() },
      () => {
        setupComponent({ defendantType: 'company' });

        cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
        cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business unit');
        cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');
        cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant type');
        cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Company');
        cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');

        cy.get(AccountSearchLocators.resultsHeading).should('contain', 'Select accounts to consolidate');
        cy.get(AccountSearchLocators.addToListButton).should('contain', 'Add to list');
        cy.get(AccountSearchLocators.selectedAccountsHint).should('be.visible');
        cy.get(AccountSearchLocators.resultsTable).should('be.visible');
        cy.get(AccountSearchLocators.resultAccountLinkByNumber('COMP001')).should('be.visible');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP001'))
          .find(AccountSearchLocators.resultNameCell)
          .should('contain', 'Acme Corporation');
      },
    );

    it(
      'AC2, AC2a, AC5a, AC5b, AC5d, AC5e, AC5f, AC5i. should display the company results columns in the AC order and format populated data',
      { tags: buildCompanyTags() },
      () => {
        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountSearchLocators.resultSelectAllCheckbox).should('exist');
        cy.get(AccountSearchLocators.resultsTableNamedHeaders).then(($headers) => {
          const headers = [...$headers].map((header) => normaliseText(header.textContent ?? ''));
          expect(headers).to.deep.equal(companyResultsTableHeaders);
        });

        cy.get(AccountSearchLocators.resultAccountLinkByNumber('COMP001')).should('be.visible');
        assertRowCellText('COMP001', AccountSearchLocators.resultNameCell, 'Acme Corporation');
        assertRowCellText('COMP001', AccountSearchLocators.resultAliasesCell, 'Alpha Ltd Bravo Ltd');
        assertRowCellText('COMP001', AccountSearchLocators.resultAddressLine1Cell, '21 Company Street');
        assertRowCellText('COMP001', AccountSearchLocators.resultPostcodeCell, 'CO1 2MP');
        assertRowCellText('COMP001', AccountSearchLocators.resultCollectionOrderCell, 'Y');
        assertRowCellText('COMP001', AccountSearchLocators.resultEnforcementCell, 'DISTRESS');
        assertRowCellText('COMP001', AccountSearchLocators.resultBalanceCell, '£520.50');
        assertRowCellText('COMP001', AccountSearchLocators.resultRefCell, 'COMP-REF-1');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP001'))
          .find(AccountSearchLocators.resultDateOfBirthCell)
          .should('not.exist');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP001'))
          .find(AccountSearchLocators.resultPayingParentGuardianCell)
          .should('not.exist');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP001'))
          .find(AccountSearchLocators.resultNationalInsuranceNumberCell)
          .should('not.exist');
      },
    );

    it(
      'AC2b, AC2c, AC5b, AC5d, AC5fi. should display an em dash for unavailable company account data',
      { tags: buildCompanyTags() },
      () => {
        defendantAccountResults.push(createCompanyFalseyResult(), createCompanyZeroBalanceResult());

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountSearchLocators.resultAccountLinkByNumber('COMP002')).should('be.visible');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP002'))
          .find(AccountSearchLocators.resultNameCell)
          .should('contain', EM_DASH);
        assertRowCellText('COMP002', AccountSearchLocators.resultAliasesCell, EM_DASH);
        assertRowCellText('COMP002', AccountSearchLocators.resultAddressLine1Cell, EM_DASH);
        assertRowCellText('COMP002', AccountSearchLocators.resultPostcodeCell, EM_DASH);
        assertRowCellText('COMP002', AccountSearchLocators.resultCollectionOrderCell, '-');
        assertRowCellText('COMP002', AccountSearchLocators.resultEnforcementCell, EM_DASH);
        assertRowCellText('COMP002', AccountSearchLocators.resultBalanceCell, EM_DASH);
        assertRowCellText('COMP002', AccountSearchLocators.resultRefCell, EM_DASH);

        cy.get(AccountSearchLocators.resultAccountLinkByNumber('COMP003')).should('not.exist');
        cy.get(AccountSearchLocators.resultsRows).should('have.length', 2);
      },
    );

    it(
      'AC2d, AC2e. should display a maximum of 100 company accounts on a single scrollable page with no pagination',
      { tags: buildCompanyTags() },
      () => {
        defendantAccountResults = createCompanyMaxResultsMock();

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountSearchLocators.resultsScrollPane).should('exist');
        cy.get(AccountSearchLocators.resultsPagination).should('not.exist');
        cy.get(AccountSearchLocators.resultAccountLink).should('have.length', 100);
        cy.get(AccountSearchLocators.resultAccountLinkByNumber('COMP100')).should('be.visible');
      },
    );

    it(
      'AC7. should display warning and error checks beneath the relevant company account row',
      { tags: buildCompanyTags() },
      () => {
        defendantAccountResults[0].checks = {
          errors: [{ reference: 'CON.ER.4', message: 'Account has days in default' }],
          warnings: [],
        };

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP001'))
          .next(AccountSearchLocators.resultTableRow)
          .find(AccountSearchLocators.resultChecksCellByAccountId(21))
          .should('be.visible')
          .and('contain', 'Account has days in default');
      },
    );

    it(
      'AC7a, AC7b. should show only errors for company results when both errors and warnings exist, listing multiple errors as bullets',
      { tags: buildCompanyTags() },
      () => {
        defendantAccountResults = [createCompanyMultipleErrorsAndWarningsResult()];

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP005'))
          .next(AccountSearchLocators.resultTableRow)
          .find(AccountSearchLocators.resultChecksCellByAccountId(25))
          .should('contain', 'Account status is CS')
          .and('contain', 'Account is blocked for consolidation')
          .and('not.contain', 'Account has uncleared cheque payments')
          .and('not.contain', 'Account has linked cases');
        cy.get(AccountSearchLocators.resultChecksCellByAccountId(25))
          .find(AccountSearchLocators.resultChecksBulletItems)
          .should('have.length', 2);
      },
    );

    it(
      'AC7c. should display all warnings for company results when multiple warnings apply and no errors exist',
      { tags: buildCompanyTags() },
      () => {
        defendantAccountResults = [createCompanyMultipleWarningsResult()];

        setupComponent({ defendantType: 'company' });

        assertResultsSummary('Company');
        cy.get(AccountSearchLocators.resultRowWithAccount('COMP006'))
          .next(AccountSearchLocators.resultTableRow)
          .find(AccountSearchLocators.resultChecksCellByAccountId(26))
          .should('contain', 'Account has uncleared cheque payments')
          .and('contain', 'Account has linked cases');
        cy.get(AccountSearchLocators.resultChecksCellByAccountId(26))
          .find(AccountSearchLocators.resultChecksBulletItems)
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
      { tags: buildResultsTabFunctionalityTags() },
      () => {
        defendantAccountResults[0].checks = { errors: [], warnings: [] };
        defendantAccountResults.push(createMultipleErrorsAndWarningsResult(), createMultipleWarningsResult());

        setupComponent();

        assertResultsSummary();

        // AC3. Each row includes a checkbox for selecting or unselecting the account.
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(11))
          .should('exist')
          .and('be.enabled')
          .and('not.be.checked')
          .check({ force: true })
          .should('be.checked');
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(11))
          .uncheck({ force: true })
          .should('not.be.checked');

        // AC3a. Accounts that contain one or more errors have their checkbox hidden.
        cy.get(AccountSearchLocators.resultRowWithAccount('ACC005'))
          .find(AccountSearchLocators.resultRowCheckboxByAccountId(15))
          .should('not.exist');

        // AC3b. Accounts that contain warnings keep their checkbox enabled.
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(16)).should('exist').and('be.enabled');
      },
    );

    it(
      'AC4, AC4a, AC4b, AC4c, AC5a, AC5b, AC5c. should bulk select and deselect all enabled accounts while excluding accounts with errors',
      { tags: buildResultsTabFunctionalityTags() },
      () => {
        defendantAccountResults[0].checks = { errors: [], warnings: [] };
        defendantAccountResults.push(createMultipleErrorsAndWarningsResult(), createMultipleWarningsResult());

        setupComponent();

        assertResultsSummary();

        // AC4. A top-level checkbox is displayed above the table to allow bulk selection.
        // AC5a, AC5b. The dynamic counter shows selected accounts against the total returned results.
        cy.get(AccountSearchLocators.selectedAccountsHint).should('contain', '0 of 3 accounts selected');

        // AC4a. Selecting the top-level checkbox selects all enabled accounts in the results.
        cy.get(AccountSearchLocators.resultSelectAllCheckbox)
          .should('exist')
          .and('not.be.checked')
          .check({ force: true })
          .should('be.checked');

        // AC4b. Accounts with one or more errors are not selected.
        // AC5c. The counter updates automatically as accounts are selected.
        cy.get(AccountSearchLocators.selectedAccountsHint).should('contain', '2 of 3 accounts selected');
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(11)).should('be.checked');
        cy.get(AccountSearchLocators.resultRowWithAccount('ACC005'))
          .find(AccountSearchLocators.resultRowCheckboxByAccountId(15))
          .should('not.exist');
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(16)).should('be.checked');

        // AC4c. Deselecting the top-level checkbox deselects all currently selected accounts.
        // AC5c. The counter updates automatically as accounts are deselected.
        cy.get(AccountSearchLocators.resultSelectAllCheckbox).uncheck({ force: true }).should('not.be.checked');

        cy.get(AccountSearchLocators.selectedAccountsHint).should('contain', '0 of 3 accounts selected');
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(11)).should('not.be.checked');
        cy.get(AccountSearchLocators.resultRowCheckboxByAccountId(16)).should('not.be.checked');
      },
    );

    it(
      'AC6, AC6a, AC6b. should display Add to list above the counter and show a validation error when no accounts are selected',
      { tags: buildResultsTabFunctionalityTags() },
      () => {
        defendantAccountResults[0].checks = { errors: [], warnings: [] };

        setupComponent();

        assertResultsSummary();

        // AC6. An Add to list button is displayed above the counter.
        cy.get(AccountSearchLocators.addToListButton)
          .should('be.visible')
          .and('contain', 'Add to list')
          .then(($button) => {
            cy.get(AccountSearchLocators.selectedAccountsHint).then(($hint) => {
              expect($button[0].compareDocumentPosition($hint[0]) & Node.DOCUMENT_POSITION_FOLLOWING).to.not.equal(0);
            });
          });

        // AC6a, AC6b. Selecting Add to list validates the selected accounts and shows an error when none are selected.
        cy.get(AccountSearchLocators.addToListButton).click();

        cy.get(AccountSearchLocators.errorSummary)
          .should('be.visible')
          .and('contain', 'Select 1 or more accounts to consolidate.');
        cy.get(AccountSearchLocators.addToListErrorMessage)
          .should('be.visible')
          .and('contain', 'Select 1 or more accounts to consolidate.');
      },
    );
  });
});
