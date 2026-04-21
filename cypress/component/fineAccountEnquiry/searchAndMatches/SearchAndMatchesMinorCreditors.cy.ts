import { AccountSearchCommonLocators as CommonLocators } from '../../../shared/selectors/account-search/account.search.common.locators';
import { AccountSearchMinorCreditorsLocators as MinorCreditorsLocators } from '../../../shared/selectors/account-search/account.search.minor-creditors.locators';
import { AccountSearchNavLocators as NavLocators } from '../../../shared/selectors/account-search/account.search.nav.locators';
import { MINOR_CREDITORS_SEARCH_STATE_MOCK } from './mocks/search_and_matches_minor_creditors_mock';
import { finesSaMinorCreditorAccountsResolver } from '../../../../src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-minor-creditor-accounts/fines-sa-minor-creditor-accounts.resolver';
import { mountSearchAccount } from './support/mountSearchAccount';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MinorTypeLocators = MinorCreditorsLocators.type;
const MinorIndividualLocators = MinorCreditorsLocators.individual;
const MinorCompanyLocators = MinorCreditorsLocators.company;

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('Search Account Component - Minor Creditors', () => {
  type MinorCreditorsSearchState = typeof MINOR_CREDITORS_SEARCH_STATE_MOCK;

  const buildMinorCreditorsSearchState = (
    configure?: (searchState: MinorCreditorsSearchState) => void,
  ): MinorCreditorsSearchState => {
    const searchState = structuredClone(MINOR_CREDITORS_SEARCH_STATE_MOCK);
    configure?.(searchState);
    return searchState;
  };

  const setupComponent = (configure?: (searchState: MinorCreditorsSearchState) => void) =>
    mountSearchAccount({
      activeTab: 'minorCreditors',
      initialState: buildMinorCreditorsSearchState(configure),
      resultsResolvers: {
        minorCreditorAccounts: finesSaMinorCreditorAccountsResolver,
      },
    });

  it(
    'AC1-AC3. should render the search for an account screen and minor creditors tab',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7013'] },
    () => {
      setupComponent();

      cy.get(CommonLocators.root).should('exist');
      cy.get(CommonLocators.pageHeader).should('contain', 'Search for an account');
      cy.get(NavLocators.tabsContainer).should('exist');
      cy.get(NavLocators.tabsList).should('exist');
      cy.get(NavLocators.individualsTab).should('exist');
      cy.get(NavLocators.companiesTab).should('exist');
      cy.get(NavLocators.minorCreditorsTab).should('exist');
      cy.get(NavLocators.majorCreditorsTab).should('exist');
      cy.get(MinorCreditorsLocators.panel.root).should('exist');
      cy.get(MinorTypeLocators.companyRadio).should('exist');
      cy.get(MinorTypeLocators.individualRadio).should('exist');
      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(MinorCompanyLocators.companyNameLabel).should('exist').contains('Company name');
      cy.get(MinorCompanyLocators.companyNameInput).should('exist');
      cy.get(MinorCompanyLocators.companyNameExactMatchCheckbox).should('exist').and('not.be.checked');
      cy.get(MinorCompanyLocators.companyAddressLine1Label).should('exist').contains('Address line 1');
      cy.get(MinorCompanyLocators.companyAddressLine1Input).should('exist');
      cy.get(MinorCompanyLocators.companyPostcodeLabel).should('exist').and('contain', 'Postcode');
      cy.get(MinorCompanyLocators.companyPostcodeInput).should('exist');
      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(MinorIndividualLocators.lastNameLabel).should('exist').and('contain', 'Last name');
      cy.get(MinorIndividualLocators.lastNameInput).should('exist');
      cy.get(MinorIndividualLocators.lastNameExactMatchCheckbox).should('exist').and('not.be.checked');
      cy.get(MinorIndividualLocators.firstNamesLabel).should('exist').and('contain', 'First names');
      cy.get(MinorIndividualLocators.firstNamesInput).should('exist');
      cy.get(MinorIndividualLocators.firstNamesExactMatchCheckbox).should('exist').and('not.be.checked');
      cy.get(MinorIndividualLocators.addressLine1Label).should('exist').and('contain', 'Address line 1');
      cy.get(MinorIndividualLocators.addressLine1Input).should('exist');
      cy.get(MinorIndividualLocators.postcodeLabel).should('exist').and('contain', 'Postcode');
      cy.get(MinorIndividualLocators.postcodeInput).should('exist');
      cy.get(CommonLocators.accountNumberLabel).should('exist').and('contain', 'Account number');
      cy.get(CommonLocators.referenceOrCaseNumberLabel).should('exist').and('contain', 'Reference or case number');
      cy.get(CommonLocators.referenceOrCaseNumberInput).should('exist');
      cy.get(CommonLocators.activeAccountsOnlyCheckbox).should('be.checked');
      cy.get(CommonLocators.searchButton).should('exist').and('contain', 'Search');
    },
  );

  it(
    'AC6a. should show error for non-alphabetical last name',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7014'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_individual.fsa_search_account_minor_creditors_last_name =
          'Smith123';
      });

      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(MinorIndividualLocators.lastNameInput).should('have.value', 'Smith123');
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'Last name must only contain letters');
      cy.get(MinorIndividualLocators.lastNameError)
        .should('exist')
        .and('contain', 'Last name must only contain letters');
      cy.get(MinorIndividualLocators.lastNameInput).clear();
    },
  );

  it(
    'AC6b. should show error for non-alphabetical first name',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7015'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_individual.fsa_search_account_minor_creditors_first_names =
          'Name123';
      });

      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(MinorIndividualLocators.firstNamesInput).should('have.value', 'Name123');
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'First names must only contain letters');
      cy.get(MinorIndividualLocators.firstNamesError)
        .should('exist')
        .and('contain', 'First names must only contain letters');

      cy.get(MinorIndividualLocators.firstNamesInput).clear();
    },
  );

  it(
    'AC6c. should show error for non-alphabetical company name',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7016'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company.fsa_search_account_minor_creditors_company_name =
          'Company123?';
      });

      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should(
        'contain',
        'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
      cy.get(MinorCompanyLocators.companyNameError).should(
        'contain',
        'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      );
      cy.get(MinorCompanyLocators.companyNameInput).clear();
    },
  );

  it(
    'AC6d. should show error for non-alphabetical address line 1',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7017'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_individual.fsa_search_account_minor_creditors_individual_address_line_1 =
          'Address123?';
      });
      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Address line 1 must only contain letters or numbers');
      cy.get(MinorIndividualLocators.addressLine1Error).should(
        'contain',
        'Address line 1 must only contain letters or numbers',
      );
      cy.get(MinorIndividualLocators.addressLine1Input).clear();
    },
  );

  it(
    'AC6e. should show error for non-alphabetical post code',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7018'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company.fsa_search_account_minor_creditors_company_post_code =
          'POSTCODE?';
      });

      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Post code must only contain letters or numbers');
      cy.get(MinorCompanyLocators.companyPostcodeError).should(
        'contain',
        'Post code must only contain letters or numbers',
      );
      cy.get(MinorCompanyLocators.companyPostcodeInput).clear();
    },
  );

  it(
    'AC7a. should validate last name maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7019'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_individual.fsa_search_account_minor_creditors_last_name =
          'Abcdefghijklmnopqrstuvwxyzabcdefg';
      });

      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Last name must be 30 characters or fewer');
      cy.get(MinorIndividualLocators.lastNameError).should('contain', 'Last name must be 30 characters or fewer');
      cy.get(MinorIndividualLocators.lastNameInput).clear();
    },
  );

  it(
    'AC7b. should validate first names maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7020'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_individual.fsa_search_account_minor_creditors_first_names =
          'AbcdefghijklmnopqrstA';
      });

      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'First names must be 20 characters or fewer');
      cy.get(MinorIndividualLocators.firstNamesError).should('contain', 'First names must be 20 characters or fewer');
      cy.get(MinorIndividualLocators.firstNamesInput).clear();
    },
  );

  it(
    'AC7c. should validate company name maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7021'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company.fsa_search_account_minor_creditors_company_name =
          'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijs';
      });

      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Company name must be 50 characters or fewer');
      cy.get(MinorCompanyLocators.companyNameError).should('contain', 'Company name must be 50 characters or fewer');
      cy.get(MinorCompanyLocators.companyNameInput).clear();
    },
  );

  it(
    'AC7d. should validate address line 1 maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7022'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company.fsa_search_account_minor_creditors_company_address_line_1 =
          'Address1234Address1234Address12345';
      });

      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Address line 1 must be 30 characters or fewer');
      cy.get(MinorCompanyLocators.companyAddressLine1Error).should(
        'contain',
        'Address line 1 must be 30 characters or fewer',
      );
      cy.get(MinorCompanyLocators.companyAddressLine1Input).clear();
    },
  );

  it(
    'AC7e. should validate post code maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-715'), '@JIRA-KEY:POT-7023'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company.fsa_search_account_minor_creditors_company_post_code =
          'POSTCODES';
      });

      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(CommonLocators.searchButton).click();
      cy.get(CommonLocators.errorSummary).should('contain', 'Post code must be 8 characters or fewer');
      cy.get(MinorCompanyLocators.companyPostcodeError).should('contain', 'Post code must be 8 characters or fewer');
      cy.get(MinorCompanyLocators.companyPostcodeInput).clear();
    },
  );

  it(
    'AC3a. Should validate last name field when "Search exact match" for last name is selected on Minor Creditor Individual',
    { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-KEY:POT-7024'] },
    () => {
      setupComponent();

      cy.get(NavLocators.minorCreditorsTab).click();
      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(MinorIndividualLocators.lastNameExactMatchCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(MinorIndividualLocators.lastNameError).should('exist').and('contain', 'Enter last name');
    },
  );

  it(
    'AC3b. Should validate first name field when "Search exact match" for first name is selected on Minor Creditor Individual',
    { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-KEY:POT-7025'] },
    () => {
      setupComponent();

      cy.get(NavLocators.minorCreditorsTab).click();
      cy.get(MinorTypeLocators.individualRadio).click();
      cy.get(MinorIndividualLocators.firstNamesExactMatchCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(MinorIndividualLocators.firstNamesError).should('exist').and('contain', 'Enter first name');
    },
  );

  it(
    'AC4a. Should validate company name field when "Search exact match" for company name is selected on Minor Creditor Company',
    { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-KEY:POT-7026'] },
    () => {
      setupComponent();

      cy.get(NavLocators.minorCreditorsTab).click();
      cy.get(MinorTypeLocators.companyRadio).click();
      cy.get(MinorCompanyLocators.companyNameExactMatchCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(MinorCompanyLocators.companyNameError).should('exist').and('contain', 'Enter company name');
    },
  );
});
