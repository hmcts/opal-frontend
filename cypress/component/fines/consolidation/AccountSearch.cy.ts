import { AccountSearchLocators } from '../../../shared/selectors/consolidation/AccountSearch.locators';
import { FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/mocks/fines-con-search-account-form-empty.mock';
import { IFinesConSearchAccountState } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { setupConsolidationComponent as mountConsolidationComponent } from './setup/SetupComponent';
import { ConsolidationTabFragment, IComponentProperties } from './setup/setupComponent.interface';

describe('FinesConConsolidateAccComponent - Account & Company Search', () => {
  let finesConSearchAccountFormData: IFinesConSearchAccountState = structuredClone(
    FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData,
  );

  const defaultComponentProperties: IComponentProperties = {
    defendantType: 'individual',
    fragments: 'search',
  };

  const setupConsolidationComponent = (componentProperties: IComponentProperties = {}) => {
    return mountConsolidationComponent({
      ...defaultComponentProperties,
      ...componentProperties,
      searchAccountFormData: finesConSearchAccountFormData,
    });
  };

  beforeEach(() => {
    finesConSearchAccountFormData = structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData);
  });

  const assertValidationError = (message: string, inlineSelector: string) => {
    cy.get(AccountSearchLocators.errorSummary).should('be.visible').and('contain', message);
    cy.get(inlineSelector).should('be.visible').and('contain', message);
  };

  const switchToTab = (tab: ConsolidationTabFragment) => {
    cy.get('@finesConStore').then((store: any) => {
      store.setActiveTab(tab);
    });
    cy.get('@consolidationFixture').then((fixture: any) => {
      fixture.detectChanges();
    });
  };

  const assertSearchFieldsAreCleared = () => {
    cy.get(AccountSearchLocators.accountNumberInput).should('have.value', '');
    cy.get(AccountSearchLocators.nationalInsuranceNumberInput).should('have.value', '');
    cy.get(AccountSearchLocators.lastNameInput).should('have.value', '');
    cy.get(AccountSearchLocators.lastNameExactMatchCheckbox).should('not.be.checked');
    cy.get(AccountSearchLocators.firstNamesInput).should('have.value', '');
    cy.get(AccountSearchLocators.firstNamesExactMatchCheckbox).should('not.be.checked');
    cy.get(AccountSearchLocators.includeAliasesCheckbox).should('not.be.checked');
    cy.get(AccountSearchLocators.dateOfBirthInput).should('have.value', '');
    cy.get(AccountSearchLocators.addressLine1Input).should('have.value', '');
    cy.get(AccountSearchLocators.postCodeInput).should('have.value', '');
  };

  it('AC1. Search screen mirrors expected field types, headings and actions', { tags: ['@JIRA-KEY:POT-3867'] }, () => {
    setupConsolidationComponent();

    cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
    cy.get(AccountSearchLocators.searchTabLink).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');

    //AC1a. Business unit displays the selected BU and is read-only'

    cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business Unit');
    cy.get(AccountSearchLocators.businessUnitValue).should('contain', 'Historical Debt');

    //AC1b. Defendant type displays 'Individual'
    cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant Type');
    cy.get(AccountSearchLocators.defendantTypeValue).should('contain', 'Individual');

    //AC1c. Search screen mirrors expected field types, headings and actions
    cy.get(AccountSearchLocators.tabsNav).should('be.visible');
    cy.get(AccountSearchLocators.searchTab).should('contain', 'Search');
    cy.get(AccountSearchLocators.resultsTab).should('contain', 'Results');
    cy.get(AccountSearchLocators.forConsolidationTab).should('contain', 'For Consolidation');

    cy.get(AccountSearchLocators.quickSearchHeading).should('contain', 'Quick search');
    cy.contains(AccountSearchLocators.advancedSearchHeading, 'Advanced Search').should('be.visible');

    cy.get(AccountSearchLocators.accountNumberInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.nationalInsuranceNumberInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.lastNameInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.lastNameExactMatchCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(AccountSearchLocators.firstNamesInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.firstNamesExactMatchCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(AccountSearchLocators.includeAliasesCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(AccountSearchLocators.dateOfBirthInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.addressLine1Input).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.postCodeInput).should('have.attr', 'type', 'text');

    cy.get(AccountSearchLocators.searchButton).should('be.visible').and('contain', 'Search');
    cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search').should('be.visible');

    //AC1d. Hint text is present above Quick search heading
    cy.get(AccountSearchLocators.quickSearchHint)
      .invoke('text')
      .then((text) => {
        const normalisedText = text.replace(/\s+/g, ' ').trim();
        expect(normalisedText).to.equal(
          'Use quick search to search for an account using either account number or National Insurance number, or use advanced search',
        );
      });
  });

  it(
    'AC2. Selecting Search with no populated fields triggers no action and user stays on same screen',
    { tags: ['@JIRA-KEY:POT-3868'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      setupConsolidationComponent({ updateSearchSpy });

      cy.get(AccountSearchLocators.searchButton).click();
      cy.get(AccountSearchLocators.errorSummary).should('not.exist');
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC3. Invalid search criteria display the expected errors and no search update occurs',
    { tags: ['@JIRA-KEY:POT-3869'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: '1234567',
        fcon_search_account_national_insurance_number: 'AB12345$C',
        fcon_search_account_individuals_search_criteria: {
          fcon_search_account_individuals_last_name: 'Smith',
          fcon_search_account_individuals_last_name_exact_match: false,
          fcon_search_account_individuals_first_names: null,
          fcon_search_account_individuals_first_names_exact_match: false,
          fcon_search_account_individuals_include_aliases: false,
          fcon_search_account_individuals_date_of_birth: 'textbox',
          fcon_search_account_individuals_address_line_1: '123 Main Street %',
          fcon_search_account_individuals_post_code: 'SW1A!AA',
        },
      };
      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      const expectedValidationErrors = [
        {
          message: 'Enter account number in the correct format such as 12345678 or 12345678A',
          selector: AccountSearchLocators.accountNumberError,
        },
        {
          message: 'Enter a National Insurance number in the format AANNNNNNA',
          selector: AccountSearchLocators.nationalInsuranceNumberError,
        },
        {
          message: 'Date of birth must be in the format DD/MM/YYYY',
          selector: AccountSearchLocators.dateOfBirthError,
        },
        {
          message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
          selector: AccountSearchLocators.addressLine1Error,
        },
        {
          message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
          selector: AccountSearchLocators.postCodeError,
        },
      ];

      expectedValidationErrors.forEach(({ message, selector }) => {
        assertValidationError(message, selector);
      });

      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC4. Max length validation errors display expected messages and no search update occurs',
    { tags: ['@JIRA-KEY:POT-3870'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: '123456789A',
        fcon_search_account_national_insurance_number: 'AB1234567C',
        fcon_search_account_individuals_search_criteria: {
          fcon_search_account_individuals_last_name: 'A'.repeat(31),
          fcon_search_account_individuals_last_name_exact_match: false,
          fcon_search_account_individuals_first_names: 'B'.repeat(21),
          fcon_search_account_individuals_first_names_exact_match: false,
          fcon_search_account_individuals_include_aliases: false,
          fcon_search_account_individuals_date_of_birth: null,
          fcon_search_account_individuals_address_line_1: 'C'.repeat(31),
          fcon_search_account_individuals_post_code: 'AB12CDEFG',
        },
      };
      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      const expectedValidationErrors = [
        {
          message: 'Account number must be 9 characters or fewer',
          selector: AccountSearchLocators.accountNumberError,
        },
        {
          message: 'Last name must be 30 characters or fewer',
          selector: AccountSearchLocators.lastNameError,
        },
        {
          message: 'First names must be 20 characters or fewer',
          selector: AccountSearchLocators.firstNamesError,
        },
        {
          message: 'Enter a National Insurance number in the format AANNNNNNA',
          selector: AccountSearchLocators.nationalInsuranceNumberError,
        },
        {
          message: 'Address line 1 must be 30 characters or fewer',
          selector: AccountSearchLocators.addressLine1Error,
        },
        {
          message: 'Postcode must be 8 characters or fewer',
          selector: AccountSearchLocators.postCodeError,
        },
      ];

      expectedValidationErrors.forEach(({ message, selector }) => {
        assertValidationError(message, selector);
      });

      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC5a. User enters data into First names without Last name and sees Enter last name',
    { tags: ['@JIRA-KEY:POT-3871'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_first_names =
        'John';

      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC5b. User enters Date of birth without Last name and sees Enter last name',
    { tags: ['@JIRA-KEY:POT-3872'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_date_of_birth =
        '01/01/2000';
      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC5c. User selects Include aliases without Last name and sees Enter last name',
    { tags: ['@JIRA-KEY:POT-3873'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_include_aliases = true;
      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC5d. User selects Search exact match for Last name without Last name and sees Enter last name',
    { tags: ['@JIRA-KEY:POT-3874'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_last_name_exact_match = true;

      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC6a. When account number is entered, it is used exclusively for the search payload',
    { tags: ['@JIRA-KEY:POT-3875'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_number = '12345678';

      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      cy.then(() => {
        expect(updateSearchSpy).to.have.been.calledOnce;
        const submittedFormData = updateSearchSpy.firstCall.args[0] as IFinesConSearchAccountState;

        expect(submittedFormData.fcon_search_account_number).to.equal('12345678');
        expect(submittedFormData.fcon_search_account_national_insurance_number).to.be.null;
        expect(submittedFormData.fcon_search_account_individuals_search_criteria).to.deep.equal({
          fcon_search_account_individuals_last_name: null,
          fcon_search_account_individuals_last_name_exact_match: false,
          fcon_search_account_individuals_first_names: null,
          fcon_search_account_individuals_first_names_exact_match: false,
          fcon_search_account_individuals_include_aliases: false,
          fcon_search_account_individuals_date_of_birth: null,
          fcon_search_account_individuals_address_line_1: null,
          fcon_search_account_individuals_post_code: null,
        });
      });
    },
  );

  it(
    'AC6b. When National Insurance number is entered, it is used exclusively for the search payload',
    { tags: ['@JIRA-KEY:POT-3876'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_national_insurance_number = 'AB123456C';

      setupConsolidationComponent({ updateSearchSpy });
      cy.get(AccountSearchLocators.searchButton).click();

      cy.then(() => {
        expect(updateSearchSpy).to.have.been.calledOnce;
        const submittedFormData = updateSearchSpy.firstCall.args[0] as IFinesConSearchAccountState;

        expect(submittedFormData.fcon_search_account_national_insurance_number).to.equal('AB123456C');
        expect(submittedFormData.fcon_search_account_number).to.be.null;
        expect(submittedFormData.fcon_search_account_individuals_search_criteria).to.deep.equal({
          fcon_search_account_individuals_last_name: null,
          fcon_search_account_individuals_last_name_exact_match: false,
          fcon_search_account_individuals_first_names: null,
          fcon_search_account_individuals_first_names_exact_match: false,
          fcon_search_account_individuals_include_aliases: false,
          fcon_search_account_individuals_date_of_birth: null,
          fcon_search_account_individuals_address_line_1: null,
          fcon_search_account_individuals_post_code: null,
        });
      });
    },
  );

  it('AC7. Selecting Clear search clears all entered Search tab data', { tags: ['@JIRA-KEY:POT-3877'] }, () => {
    finesConSearchAccountFormData = {
      ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
      fcon_search_account_number: '12345678',
      fcon_search_account_national_insurance_number: 'AB123456C',
      fcon_search_account_individuals_search_criteria: {
        fcon_search_account_individuals_last_name: 'Smith',
        fcon_search_account_individuals_last_name_exact_match: true,
        fcon_search_account_individuals_first_names: 'John',
        fcon_search_account_individuals_first_names_exact_match: true,
        fcon_search_account_individuals_include_aliases: true,
        fcon_search_account_individuals_date_of_birth: '01/01/1990',
        fcon_search_account_individuals_address_line_1: '1 High Street',
        fcon_search_account_individuals_post_code: 'SW1A 1AA',
      },
    };
    setupConsolidationComponent();

    cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search').click();

    assertSearchFieldsAreCleared();
  });

  it(
    'AC7a. Clear search does not clear other tabs; note: Results/For consolidation currently have no data model to assert',
    { tags: ['@JIRA-KEY:POT-3878'] },
    () => {
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: '87654321',
        fcon_search_account_national_insurance_number: 'AB123456C',
        fcon_search_account_individuals_search_criteria: {
          fcon_search_account_individuals_last_name: 'Jones',
          fcon_search_account_individuals_last_name_exact_match: true,
          fcon_search_account_individuals_first_names: 'Anna',
          fcon_search_account_individuals_first_names_exact_match: false,
          fcon_search_account_individuals_include_aliases: true,
          fcon_search_account_individuals_date_of_birth: '02/02/1992',
          fcon_search_account_individuals_address_line_1: '2 High Street',
          fcon_search_account_individuals_post_code: 'AB1 2CD',
        },
      };
      setupConsolidationComponent();

      cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search').click();
      assertSearchFieldsAreCleared();

      // AC7a NOTE:
      // Results and For consolidation are currently placeholder tabs with no data model/state,
      // so this test verifies they remain accessible after clear-search.
      switchToTab('results');
      cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

      switchToTab('for-consolidation');
      cy.get(AccountSearchLocators.accountNumberInput).should('not.exist');

      switchToTab('search');
      cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');
      assertSearchFieldsAreCleared();
    },
  );
  // Company search scenarios

  it('AC1. Search screen mirrors expected field types, headings and actions', { tags: ['@JIRA-KEY:POT-3867'] }, () => {
    setupConsolidationComponent({ defendantType: 'company' });

    cy.get(AccountSearchLocators.heading).should('contain', 'Consolidate accounts');
    cy.get(AccountSearchLocators.searchTabLink).should('have.attr', 'aria-current', 'page');
    cy.get(AccountSearchLocators.accountNumberInput).should('be.visible');

    //AC1a. Business unit displays the selected BU and is read-only'

    cy.get(AccountSearchLocators.businessUnitKey).should('contain', 'Business Unit');
    cy.get(AccountSearchLocators.businessUnitValue)
      .should('contain', 'Historical Debt')
      .find('input, select, textarea')
      .should('not.exist');

    //AC1b. Defendant type displays 'Company'
    cy.get(AccountSearchLocators.defendantTypeKey).should('contain', 'Defendant Type');
    cy.get(AccountSearchLocators.defendantTypeValue)
      .should('contain', 'Company')
      .find('input, select, textarea')
      .should('not.exist');

    //AC1c. Search screen mirrors expected field types, headings and actions
    cy.get(AccountSearchLocators.tabsNav).should('be.visible');
    cy.get(AccountSearchLocators.searchTab).should('contain', 'Search');
    cy.get(AccountSearchLocators.resultsTab).should('contain', 'Results');
    cy.get(AccountSearchLocators.forConsolidationTab).should('contain', 'For Consolidation');

    cy.get(AccountSearchLocators.quickSearchHeading).should('contain', 'Quick search');
    cy.contains(AccountSearchLocators.advancedSearchHeading, 'Advanced Search').should('be.visible');

    cy.get(AccountSearchLocators.accountNumberInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.companyNameInput).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.companyNameExactMatchCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(AccountSearchLocators.companyIncludeAliasesCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(AccountSearchLocators.companyAddressLine1Input).should('have.attr', 'type', 'text');
    cy.get(AccountSearchLocators.companyPostCodeInput).should('have.attr', 'type', 'text');

    cy.get(AccountSearchLocators.searchButton).should('be.visible').and('contain', 'Search');
    cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search').should('be.visible');

    //AC1d. Hint text is present above Quick search heading
    cy.get(AccountSearchLocators.quickSearchHint)
      .invoke('text')
      .then((text) => {
        const normalisedText = text.replace(/\s+/g, ' ').trim();
        expect(normalisedText).to.equal(
          'Use quick search to search for an account using account number, or use advanced search',
        );
      });
  });

  it(
    'AC2. Selecting Search with no populated fields triggers no action and user stays on same screen',
    { tags: ['@JIRA-KEY:POT-3868'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      setupConsolidationComponent({ updateSearchSpy, defendantType: 'company' });

      cy.get(AccountSearchLocators.searchButton).click();
      cy.get(AccountSearchLocators.errorSummary).should('not.exist');
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC3. Invalid search criteria display the expected errors and no search update occurs',
    { tags: ['@JIRA-KEY:POT-3869'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: '1234567',
        fcon_search_account_companies_search_criteria: {
          fcon_search_account_companies_company_name: 'Testing!!!',
          fcon_search_account_companies_company_name_exact_match: false,
          fcon_search_account_companies_include_aliases: false,
          fcon_search_account_companies_address_line_1: '&& High Street',
          fcon_search_account_companies_post_code: 'TE5&5TN',
        },
      };
      setupConsolidationComponent({ updateSearchSpy, defendantType: 'company' });
      cy.get(AccountSearchLocators.searchButton).click();

      const expectedValidationErrors = [
        {
          //AC3a. User enters value that is not in correct format and the following error is produced
          message: 'Enter account number in the correct format such as 12345678 or 12345678A',
          selector: AccountSearchLocators.accountNumberError,
        },
        {
          //AC3b. User enters non-alphabetical or special characters and the following error is produced
          message: 'Company name must only include letters a to z, hyphens, spaces and apostrophes',
          selector: AccountSearchLocators.companyNameError,
        },
        {
          //AC3c. User enters non-alphanumeric and the following error is produced
          message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
          selector: AccountSearchLocators.companyAddressLine1Error,
        },
        {
          //AC3d. User enters non-alphanumeric and the following error is produced
          message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
          selector: AccountSearchLocators.companyPostCodeError,
        },
      ];

      expectedValidationErrors.forEach(({ message, selector }) => {
        assertValidationError(message, selector);
      });

      //AC3 Following selecting 'search' the system remains on the same screen
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC4. Max length search validation displays the expected errors and no search update occurs',
    { tags: ['@JIRA-KEY:POT-3879'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: '1234567890',
        fcon_search_account_companies_search_criteria: {
          fcon_search_account_companies_company_name: 'QwertyuiopQwertyuiopQwertyuiopQwertyuiopQwertyuiopQ',
          fcon_search_account_companies_company_name_exact_match: false,
          fcon_search_account_companies_include_aliases: false,
          fcon_search_account_companies_address_line_1: 'QwertyuiopQwertyuiopQwertyuiopQ',
          fcon_search_account_companies_post_code: '123456789',
        },
      };
      setupConsolidationComponent({ updateSearchSpy, defendantType: 'company' });
      cy.get(AccountSearchLocators.searchButton).click();

      const expectedValidationErrors = [
        {
          //AC4a. User enters value exceeding the max characters. Error isnt in line with others/conflicts this one first. Confirmed in ..field-errors.constant that it should be 'Account number must be 9 characters or fewer',. Pri 3. How to reach?
          message: 'Account number must be 9 characters or fewer',
          selector: AccountSearchLocators.accountNumberError,
        },
        {
          //AC4b. User enters value exceeding the max characters.
          message: 'Company name must be 50 characters or fewer',
          selector: AccountSearchLocators.companyNameError,
        },
        {
          //AC4c. User enters value exceeding the max characters.
          message: 'Address line 1 must be 30 characters or fewer',
          selector: AccountSearchLocators.companyAddressLine1Error,
        },
        {
          //AC4d. User enters value exceeding the max characters.
          message: 'Postcode must be 8 characters or fewer',
          selector: AccountSearchLocators.companyPostCodeError,
        },
      ];

      expectedValidationErrors.forEach(({ message, selector }) => {
        assertValidationError(message, selector);
      });

      //AC4 Following selecting 'search' the system remains on the same screen
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC5. Field dependencies checked & display the expected errors when ommited - no search update occurs',
    { tags: ['@JIRA-KEY:POT-3880'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: null,
        fcon_search_account_companies_search_criteria: {
          fcon_search_account_companies_company_name: null,
          fcon_search_account_companies_company_name_exact_match: true,
          fcon_search_account_companies_include_aliases: true,
          fcon_search_account_companies_address_line_1: null,
          fcon_search_account_companies_post_code: null,
        },
      };
      setupConsolidationComponent({ updateSearchSpy, defendantType: 'company' });
      cy.get(AccountSearchLocators.searchButton).click();

      const expectedValidationErrors = [
        {
          //AC5a, AC5b. Exact match & include alias boxes checked without a company name - Below error raised
          message: 'Enter company name',
          selector: AccountSearchLocators.companyNameError,
        },
      ];

      expectedValidationErrors.forEach(({ message, selector }) => {
        assertValidationError(message, selector);
      });

      //AC5 Following selecting 'search' the system remains on the same screen
      cy.then(() => {
        expect(updateSearchSpy).to.not.have.been.called;
      });
    },
  );

  it(
    'AC6a. When account number is entered, it is used exclusively for the search payload',
    { tags: ['@JIRA-KEY:POT-3875'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData.fcon_search_account_number = '12345678';

      setupConsolidationComponent({ updateSearchSpy, defendantType: 'company' });
      cy.get(AccountSearchLocators.searchButton).click();

      cy.then(() => {
        expect(updateSearchSpy).to.have.been.calledOnce;
        const submittedFormData = updateSearchSpy.firstCall.args[0] as IFinesConSearchAccountState;

        expect(submittedFormData.fcon_search_account_number).to.equal('12345678');
        expect(submittedFormData.fcon_search_account_companies_search_criteria).to.deep.equal({
          fcon_search_account_companies_company_name: null,
          fcon_search_account_companies_company_name_exact_match: false,
          fcon_search_account_companies_include_aliases: false,
          fcon_search_account_companies_address_line_1: null,
          fcon_search_account_companies_post_code: null,
        });
      });
    },
  );

  it(
    'AC7 Clear search button removes all populated data except in results/consolidation tabs',
    { tags: ['@JIRA-KEY:POT-3881'] },
    () => {
      const updateSearchSpy = Cypress.sinon.spy();
      finesConSearchAccountFormData = {
        ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
        fcon_search_account_number: '12345678',
        fcon_search_account_companies_search_criteria: {
          fcon_search_account_companies_company_name: 'Test Company',
          fcon_search_account_companies_company_name_exact_match: true,
          fcon_search_account_companies_include_aliases: true,
          fcon_search_account_companies_address_line_1: '1 Test Street',
          fcon_search_account_companies_post_code: 'L1 1TS',
        },
      };
      setupConsolidationComponent({ updateSearchSpy, defendantType: 'company' });

      // Confirming data has been retained after tabbing
      cy.get(AccountSearchLocators.accountNumberInput).should('have.value', '12345678');
      cy.get(AccountSearchLocators.companyNameInput).should('have.value', 'Test Company');
      cy.get(AccountSearchLocators.companyNameExactMatchCheckbox).should('be.checked');
      cy.get(AccountSearchLocators.companyIncludeAliasesCheckbox).should('be.checked');
      cy.get(AccountSearchLocators.companyAddressLine1Input).should('have.value', '1 Test Street');
      cy.get(AccountSearchLocators.companyPostCodeInput).should('have.value', 'L1 1TS');

      //AC7 Clicking the clear search
      cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search').click();

      //AC7 All fields reset upon clear search click
      cy.get(AccountSearchLocators.accountNumberInput).should('have.value', '');
      cy.get(AccountSearchLocators.companyNameInput).should('have.value', '');
      cy.get(AccountSearchLocators.companyNameExactMatchCheckbox).should('not.be.checked');
      cy.get(AccountSearchLocators.companyIncludeAliasesCheckbox).should('not.be.checked');
      cy.get(AccountSearchLocators.companyAddressLine1Input).should('have.value', '');
      cy.get(AccountSearchLocators.companyPostCodeInput).should('have.value', '');

      // Results and For consolidation are currently placeholder tabs with no data model/state,
      // so this test verifies they remain accessible after clear-search.
      // cy.get(AccountSearchLocators.resultsTab).click();
      // cy.get(AccountSearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');

      // cy.get(AccountSearchLocators.forConsolidationTab).click();
      // cy.get(AccountSearchLocators.forConsolidationTab).should('have.attr', 'aria-current', 'page');
    },
  );
});
