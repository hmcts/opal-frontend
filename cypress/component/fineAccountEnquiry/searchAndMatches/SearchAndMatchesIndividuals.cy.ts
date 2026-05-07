import { AccountSearchCommonLocators as CommonLocators } from '../../../shared/selectors/account-search/account.search.common.locators';
import { AccountSearchIndividualsLocators as IndividualsLocators } from '../../../shared/selectors/account-search/account.search.individuals.locators';
import { AccountSearchNavLocators as NavLocators } from '../../../shared/selectors/account-search/account.search.nav.locators';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from './mocks/search_and_matches_individual_mock';
import { finesSaIndividualDefendantAccountsResolver } from 'src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-defendant-accounts/fines-sa-defendant-accounts.resolver';
import { getCurrentMonth, getFirstDayOfPreviousMonth, getPreviousMonth } from '../../../support/utils/dateUtils';
import { mountSearchAccount } from './support/mountSearchAccount';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];
const getDobDateGridButtonSelector = (dmy: string): string => {
  const [day, month, year] = dmy.split('/');
  const unpaddedDate = `${Number(day)}/${Number(month)}/${year}`;

  return `table.moj-js-datepicker-grid button[data-testid="${dmy}"], table.moj-js-datepicker-grid button[data-testid="${unpaddedDate}"]`;
};

describe('Search Account Component - Individuals', () => {
  type IndividualSearchState = typeof INDIVIDUAL_SEARCH_STATE_MOCK;

  const buildIndividualSearchState = (
    configure?: (searchState: IndividualSearchState) => void,
  ): IndividualSearchState => {
    const searchState = structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK);
    configure?.(searchState);
    return searchState;
  };

  const setupComponent = (configure?: (searchState: IndividualSearchState) => void) =>
    mountSearchAccount({
      activeTab: 'individuals',
      initialState: buildIndividualSearchState(configure),
      resultsResolvers: {
        individualAccounts: finesSaIndividualDefendantAccountsResolver,
      },
    });

  it(
    'AC1a-d. should render the search for an account screen',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();

      cy.get(IndividualsLocators.root).should('exist');
      cy.get(CommonLocators.pageHeader).should('contain', 'Search for an account');
      cy.get(NavLocators.tabsContainer).should('exist');
      cy.get(NavLocators.tabsList).should('exist');
      cy.get(NavLocators.individualsTab).should('exist');
      cy.get(NavLocators.companiesTab).should('exist');
      cy.get(NavLocators.minorCreditorsTab).should('exist');
      cy.get(NavLocators.majorCreditorsTab).should('exist');
      cy.get(IndividualsLocators.individualsPanel).should('exist');
      cy.get(IndividualsLocators.individualsHeader).should('contain', 'Individuals');
      cy.get(CommonLocators.businessUnitSummaryList).should('exist');
      cy.get(CommonLocators.businessUnitFilterChangeLink).should('exist').contains('Change');
      cy.get(CommonLocators.businessUnitFilterChangeLink).click();
      cy.get(CommonLocators.accountNumberLabel).should('exist').and('contain', 'Account number');
      cy.get(CommonLocators.referenceOrCaseNumberLabel).should('exist').and('contain', 'Reference or case number');
      cy.get(CommonLocators.referenceOrCaseNumberInput).should('exist');
      cy.get(IndividualsLocators.lastNameLabel).should('exist').and('contain', 'Last name');
      cy.get(IndividualsLocators.lastNameInput).should('exist');
      cy.get(IndividualsLocators.lastNameExactMatchCheckbox).should('exist').and('not.be.checked');
      cy.get(IndividualsLocators.firstNamesLabel).should('exist').and('contain', 'First names');
      cy.get(IndividualsLocators.firstNameInput).should('exist');
      cy.get(IndividualsLocators.firstNamesExactMatchCheckbox).should('exist').and('not.be.checked');
      cy.get(IndividualsLocators.includeAliasesCheckbox).should('exist').and('not.be.checked');
      cy.get(IndividualsLocators.dobLabel).should('exist').and('contain', 'Date of birth');
      cy.get(IndividualsLocators.dobInput).should('exist');
      cy.get(IndividualsLocators.niNumberLabel).should('exist').and('contain', 'National Insurance number');
      cy.get(IndividualsLocators.niNumberInput).should('exist');
      cy.get(IndividualsLocators.addressLine1Label).should('exist').and('contain', 'Address line 1');
      cy.get(IndividualsLocators.addressLine1Input).should('exist');
      cy.get(IndividualsLocators.postcodeLabel).should('exist').and('contain', 'Postcode');
      cy.get(IndividualsLocators.postcodeInput).should('exist');
      cy.get(CommonLocators.activeAccountsOnlyCheckbox).should('be.checked');
      cy.get(CommonLocators.searchButton).should('exist').and('contain', 'Search');
    },
  );

  it(
    'AC3a. should validate input fields and show errors',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_number = '123$%^78';
      });

      cy.get(CommonLocators.accountNumberInput).should('have.value', '123$%^78');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.pageHeader).should('contain', 'Search for an account');

      cy.get(CommonLocators.errorSummary)
        .should('exist')
        .and('contain', 'Account number must only contain letters or numbers');
      cy.get(CommonLocators.accountNumberError)
        .should('exist')
        .and('contain', 'Account number must only contain letters or numbers');

      cy.get(CommonLocators.accountNumberInput).clear();
    },
  );

  it(
    'AC3b. should show error for incorrectly formatted account number',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_number = '1234567';
      });

      cy.get(CommonLocators.accountNumberInput).should('have.value', '1234567');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary)
        .should('exist')
        .and('contain', 'Enter account number in the correct format such as 12345678 or 12345678A');
      cy.get(CommonLocators.accountNumberError)
        .should('exist')
        .and('contain', 'Enter account number in the correct format such as 12345678 or 12345678A');

      cy.get(CommonLocators.accountNumberInput).clear();
    },
  );
  it(
    'AC3c. should show error for non-alphabetical reference or case number',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_reference_case_number = 'REF@#$456';
      });

      cy.get(CommonLocators.referenceOrCaseNumberInput).should('have.value', 'REF@#$456');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary)
        .should('exist')
        .and('contain', 'Reference or case number must only contain letters or numbers');
      cy.get(CommonLocators.referenceOrCaseNumberError)
        .should('exist')
        .and('contain', 'Reference or case number must only contain letters or numbers');

      cy.get(CommonLocators.referenceOrCaseNumberInput).clear();
    },
  );
  it(
    'AC3d. should show error for non-alphabetical last name',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name =
          'Smith123';
      });

      cy.get(IndividualsLocators.lastNameInput).should('have.value', 'Smith123');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'Last name must only contain letters');
      cy.get(IndividualsLocators.lastNameError).should('exist').and('contain', 'Last name must only contain letters');

      cy.get(IndividualsLocators.lastNameInput).clear();
    },
  );
  it(
    'AC3e. should show error for non-alphabetical first names',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_first_names =
          'John123';
      });

      cy.get(IndividualsLocators.firstNameInput).should('have.value', 'John123');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'First names must only contain letters');
      cy.get(IndividualsLocators.firstNamesError)
        .should('exist')
        .and('contain', 'First names must only contain letters');

      cy.get(IndividualsLocators.firstNameInput).clear();
    },
  );
  it(
    'AC3f. should show error for invalid date of birth format',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
          '15/AB/2020';
      });

      cy.get(IndividualsLocators.dobInput).should('have.value', '15/AB/2020');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
      cy.get(IndividualsLocators.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

      cy.get(IndividualsLocators.dobInput).clear();
    },
  );
  it(
    'AC3g. should show error for future date of birth',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
          '15/05/2030';
      });

      cy.get(IndividualsLocators.dobInput).should('have.value', '15/05/2030');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'Date of birth must be in the past');
      cy.get(IndividualsLocators.dobError).should('exist').and('contain', 'Date of birth must be in the past');

      cy.get(IndividualsLocators.dobInput).clear();
    },
  );
  it(
    'AC3h. should show error for incorrectly formatted date of birth',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
          '5/1/1980';
      });

      cy.get(IndividualsLocators.dobInput).should('have.value', '5/1/1980');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
      cy.get(IndividualsLocators.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

      cy.get(IndividualsLocators.dobInput).clear();
    },
  );

  it(
    'date picker should show the date in correct format DD/MM/YYYY',
    { tags: [...buildTags('@JIRA-STORY:PO-1998'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();
      const expectedDate = getFirstDayOfPreviousMonth();

      cy.get(IndividualsLocators.dobOpenButton).click();
      cy.get(IndividualsLocators.dobCalendarTitle)
        .invoke('text')
        .then((pickerMonth) => {
          if (pickerMonth.includes(getPreviousMonth())) {
            cy.get(IndividualsLocators.dobCalendarDialog).find(getDobDateGridButtonSelector(expectedDate)).click();
            return;
          }

          cy.get(IndividualsLocators.dobCalendarTitle).should('contain', getCurrentMonth());
          cy.get(IndividualsLocators.dobPreviousMonthButton).click();
          cy.get(IndividualsLocators.dobCalendarDialog).find(getDobDateGridButtonSelector(expectedDate)).click();
        });
      cy.get(IndividualsLocators.dobInput).should('have.value', expectedDate);
      cy.get(CommonLocators.searchButton).click();
    },
  );

  it(
    'AC3i. should show error for invalid NI number',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_national_insurance_number =
          'AB123$%^C';
      });

      cy.get(IndividualsLocators.niNumberInput).should('have.value', 'AB123$%^C');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary)
        .should('exist')
        .and('contain', 'National Insurance number must only contain letters or numbers');
      cy.get(IndividualsLocators.niNumberError)
        .should('exist')
        .and('contain', 'National Insurance number must only contain letters or numbers');

      cy.get(IndividualsLocators.niNumberInput).clear();
    },
  );
  it(
    'AC3j. should show error for invalid address line 1',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_address_line_1 =
          '123 Test St. ®©™';
      });

      cy.get(IndividualsLocators.addressLine1Input).should('have.value', '123 Test St. ®©™');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary)
        .should('exist')
        .and('contain', 'Address line 1 must only contain letters or numbers');
      cy.get(IndividualsLocators.addressLine1Error)
        .should('exist')
        .and('contain', 'Address line 1 must only contain letters or numbers');

      cy.get(IndividualsLocators.addressLine1Input).clear();
    },
  );
  it(
    'AC3k. should show error for invalid postcode',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_post_code =
          'SW1A @#!';
      });

      cy.get(IndividualsLocators.postcodeInput).should('have.value', 'SW1A @#!');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary)
        .should('exist')
        .and('contain', 'Postcode must only contain letters or numbers');
      cy.get(IndividualsLocators.postcodeError)
        .should('exist')
        .and('contain', 'Postcode must only contain letters or numbers');

      cy.get(IndividualsLocators.postcodeInput).clear();
    },
  );

  it(
    'AC4a. should validate account number maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_number = '1234567890'; // 10 characters (exceeds 9)
      });

      cy.get(CommonLocators.accountNumberInput).should('have.value', '1234567890');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(CommonLocators.accountNumberError)
        .should('exist')
        .and('contain', 'Account number must be 9 characters or fewer');
    },
  );

  it(
    'AC4b. should validate reference or case number maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_reference_case_number =
          'This reference number is way too long and exceeds thirty characters';
      });

      cy.get(CommonLocators.referenceOrCaseNumberInput).should(
        'have.value',
        'This reference number is way too long and exceeds thirty characters',
      );
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(CommonLocators.referenceOrCaseNumberError)
        .should('exist')
        .and('contain', 'Reference or case number must be 30 characters or fewer');
    },
  );

  it(
    'AC4c. should validate last name maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name =
          'ThisLastNameIsTooLongAndExceedsThirtyCharacters';
      });

      cy.get(IndividualsLocators.lastNameInput).should('have.value', 'ThisLastNameIsTooLongAndExceedsThirtyCharacters');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.lastNameError)
        .should('exist')
        .and('contain', 'Last name must be 30 characters or fewer');
    },
  );

  it(
    'AC4d. should validate first names maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_first_names =
          'ThisFirstNameIsTooLongAndExceedsTwentyChars';
      });

      cy.get(IndividualsLocators.firstNameInput).should('have.value', 'ThisFirstNameIsTooLongAndExceedsTwentyChars');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.firstNamesError)
        .should('exist')
        .and('contain', 'First names must be 20 characters or fewer');
    },
  );

  it(
    'AC4e. should validate National Insurance number maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_national_insurance_number =
          'AB123456CD';
      });

      cy.get(IndividualsLocators.niNumberInput).should('have.value', 'AB123456CD');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.niNumberError)
        .should('exist')
        .and('contain', 'National Insurance number must be 9 characters or fewer');
    },
  );

  it(
    'AC4f. should validate Address Line 1 maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_address_line_1 =
          'This address line is too long and exceeds thirty characters';
      });

      cy.get(IndividualsLocators.addressLine1Input).should(
        'have.value',
        'This address line is too long and exceeds thirty characters',
      );
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.addressLine1Error)
        .should('exist')
        .and('contain', 'Address line 1 must be 30 characters or fewer');
    },
  );

  it(
    'AC4g. should validate Postcode maximum field length',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent((searchState) => {
        searchState.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_post_code =
          'AB12 3CDEF'; // 9 characters (exceeds 8)
      });

      cy.get(IndividualsLocators.postcodeInput).should('have.value', 'AB12 3CDEF');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.postcodeError)
        .should('exist')
        .and('contain', 'Postcode must be 8 characters or fewer');
    },
  );

  it(
    'AC5a should validate first name field dependency',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();

      cy.get(IndividualsLocators.firstNameInput).type('John', { delay: 0 });
      cy.get(IndividualsLocators.lastNameInput).should('have.value', '');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.lastNameError).should('exist').and('contain', 'Enter last name');
    },
  );

  it(
    'AC5b. should validate dob field dependency',
    { tags: [...buildTags('@JIRA-STORY:PO-705'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();
      cy.window().then((win) => {
        cy.stub(win.console, 'info').as('consoleLog');
      });

      cy.get(IndividualsLocators.dobInput).focus().type('15/05/2020', { delay: 0 });
      cy.get(IndividualsLocators.lastNameInput).should('have.value', '');
      cy.get(CommonLocators.searchButton).click();

      cy.get(CommonLocators.errorSummary).should('exist');
      cy.get(IndividualsLocators.lastNameError).should('exist').and('contain', 'Enter last name');

      cy.get('@consoleLog').should('have.not.been.calledOnce');
    },
  );

  it(
    'AC1a. Should validate last name field when alias checkbox selected',
    { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();

      cy.get(IndividualsLocators.includeAliasesCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(IndividualsLocators.lastNameError).should('exist').and('contain', 'Enter last name');
    },
  );

  it(
    'AC1b. Should validate last name field when "Search exact match" for last name is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();

      cy.get(IndividualsLocators.lastNameExactMatchCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(IndividualsLocators.lastNameError).should('exist').and('contain', 'Enter last name');
    },
  );
  it(
    'AC1c. Should validate first name field when "Search exact match" for first name is selected',
    { tags: [...buildTags('@JIRA-STORY:PO-1969'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent();

      cy.get(IndividualsLocators.firstNamesExactMatchCheckbox).check().should('be.checked');
      cy.get(CommonLocators.searchButton).click();

      cy.get(IndividualsLocators.firstNamesError).should('exist').and('contain', 'Enter first name');
    },
  );
});
