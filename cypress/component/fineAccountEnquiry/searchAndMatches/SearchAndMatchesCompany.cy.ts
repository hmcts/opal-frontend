import { AccountSearchCommonLocators as CommonLocators } from '../../../shared/selectors/account-search/account.search.common.locators';
import { AccountSearchCompaniesLocators as CompanyLocators } from '../../../shared/selectors/account-search/account.search.companies.locators';
import { AccountSearchNavLocators as NavLocators } from '../../../shared/selectors/account-search/account.search.nav.locators';
import { COMPANY_SEARCH_STATE_MOCK } from './mocks/search_and_matches_company_mock';
import { finesSaCompanyDefendantAccountsResolver } from 'src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-defendant-accounts/fines-sa-defendant-accounts.resolver';
import { mountSearchAccount } from './support/mountSearchAccount';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Search Account Component - Company', () => {
  type CompanySearchState = typeof COMPANY_SEARCH_STATE_MOCK;

  const buildCompanySearchState = (configure?: (searchState: CompanySearchState) => void): CompanySearchState => {
    const searchState = structuredClone(COMPANY_SEARCH_STATE_MOCK);
    configure?.(searchState);
    return searchState;
  };

  const setupComponent = (configure?: (searchState: CompanySearchState) => void) =>
    mountSearchAccount({
      activeTab: 'companies',
      initialState: buildCompanySearchState(configure),
      resultsResolvers: {
        companyAccounts: finesSaCompanyDefendantAccountsResolver,
      },
    });

  it('AC1a-b. should render the search for an account screen and companies tab', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4467'] }, () => {
      setupComponent();

      cy.get(NavLocators.companiesTab).click();
      cy.get(CompanyLocators.root).should('exist');
      cy.get(CompanyLocators.pageHeader).should('contain', 'Search for an account');
      cy.get(NavLocators.tabsContainer).should('exist');
      cy.get(NavLocators.tabsList).should('exist');
      cy.get(NavLocators.individualsTab).should('exist');
      cy.get(NavLocators.companiesTab).should('exist');
      cy.get(NavLocators.minorCreditorsTab).should('exist');
      cy.get(NavLocators.majorCreditorsTab).should('exist');
      cy.get(CompanyLocators.companiesPanel).should('exist');
      cy.get(CompanyLocators.companiesHeader).should('contain', 'Companies');
      cy.get(CompanyLocators.companyNameLabel).should('exist').contains('Company name');
      cy.get(CompanyLocators.companyNameInput).should('exist');
      cy.get(CompanyLocators.companyNameExactMatchCheckbox).should('exist').and('not.be.checked');
      cy.get(CompanyLocators.includeAliasesCheckbox).should('exist').and('not.be.checked');
      cy.get(CompanyLocators.addressLine1Label).should('exist').contains('Address line 1');
      cy.get(CompanyLocators.addressLine1Input).should('exist');
      cy.get(CompanyLocators.postCodeLabel).should('exist').and('contain', 'Postcode');
      cy.get(CompanyLocators.postCodeInput).should('exist');
      cy.get(CommonLocators.accountNumberLabel).should('exist').and('contain', 'Account number');
      cy.get(CommonLocators.referenceOrCaseNumberLabel).should('exist').and('contain', 'Reference or case number');
      cy.get(CommonLocators.referenceOrCaseNumberInput).should('exist');
      cy.get(CommonLocators.activeAccountsOnlyCheckbox).should('be.checked');
      cy.get(CommonLocators.searchButton).should('exist').and('contain', 'Search');
    });

  it('AC3a. should show error for non-alphabetical company name', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4468'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name =
          'Company123!';
      });

      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should(
        'contain',
        'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
      cy.get(CompanyLocators.companyNameError).should(
        'contain',
        'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
      cy.get(CompanyLocators.companyNameInput).clear();
    });

  it('AC3b. should show error for non-alphabetical address line 1', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4469'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 =
          'Address123?';
      });

      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Address line 1 must only contain letters or numbers');
      cy.get(CompanyLocators.addressLine1Error).should(
        'contain',
        'Address line 1 must only contain letters or numbers',
      );
      cy.get(CompanyLocators.addressLine1Input).clear();
    });

  it('AC3c. should show error for non-alphabetical post code', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4470'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code = 'POSTCODE?';
      });

      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('contain', 'Post code must only contain letters or numbers');
      cy.get(CompanyLocators.postCodeError).should('contain', 'Post code must only contain letters or numbers');

      cy.get(CompanyLocators.postCodeInput).clear();
    });

  it('AC4a. should validate company name maximum field length', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4471'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name =
          'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijs';
      });

      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Company name must be 50 characters or fewer');
      cy.get(CompanyLocators.companyNameError).should('contain', 'Company name must be 50 characters or fewer');
      cy.get(CompanyLocators.companyNameInput).clear();
    });

  it('AC4b. should validate address line 1 maximum field length', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4472'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 =
          'Address1234Address1234Address12345';
      });

      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Address line 1 must be 30 characters or fewer');
      cy.get(CompanyLocators.addressLine1Error).should('contain', 'Address line 1 must be 30 characters or fewer');
      cy.get(CompanyLocators.addressLine1Input).clear();
    });

  it('AC4c. should validate post code maximum field length', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4473'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code = 'POSTCODES';
      });

      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Post code must be 8 characters or fewer');
      cy.get(CompanyLocators.postCodeError).should('contain', 'Post code must be 8 characters or fewer');
      cy.get(CompanyLocators.postCodeInput).clear();
    });

  it('AC5a. should validate post code maximum field length', { tags: [...buildTags('@JIRA-STORY:PO-712'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4474'] }, () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code = 'POSTCODES';
      });

      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Post code must be 8 characters or fewer');
      cy.get(CompanyLocators.postCodeError).should('contain', 'Post code must be 8 characters or fewer');
      cy.get(CompanyLocators.postCodeInput).clear();
    });

  it('AC2a. Should validate company name field when "Alias" checkbox is selected', { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4475'] }, () => {
      setupComponent();

      cy.get(NavLocators.companiesTab).click();
      cy.get(CompanyLocators.includeAliasesCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CompanyLocators.companyNameError).should('exist').and('contain', 'Enter company name');
    });

  it('AC2b. Should validate company name field when "Search exact match" for company name is selected', { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4476'] }, () => {
      setupComponent();

      cy.get(NavLocators.companiesTab).click();
      cy.get(CompanyLocators.companyNameExactMatchCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CompanyLocators.companyNameError).should('exist').and('contain', 'Enter company name');
    });
});
