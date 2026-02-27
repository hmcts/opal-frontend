import { mount } from 'cypress/angular';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesConConsolidateAccComponent } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-consolidate-acc/fines-con-consolidate-acc.component';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { FINES_CON_SELECT_BU_FORM_COMPANY_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-company.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { CompanySearchLocators } from '../../../shared/selectors/consolidation/CompanySearch.locators';
import { of } from 'rxjs';
import { FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/mocks/fines-con-search-account-form-empty.mock';
import { IFinesConSearchAccountState } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';

describe('FinesConConsolidateCompComponent - Company Search', () => {
  let finesConSelectBuFormData = structuredClone(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);
  let finesConSearchAccountFormData: IFinesConSearchAccountState = structuredClone(
    FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData,
  );

  const setupComponent = (updateSearchSpy?: (formData: IFinesConSearchAccountState) => void) => {
    return mount(FinesConConsolidateAccComponent, {
      providers: [
        provideRouter([]),
        {
          provide: FinesConStore,
          useFactory: () => {
            const store = new FinesConStore();
            store.updateSelectBuForm(finesConSelectBuFormData);
            store.updateSearchAccountFormTemporary(finesConSearchAccountFormData);
            if (updateSearchSpy) {
              const originalUpdate = store.updateSearchAccountFormTemporary.bind(store);
              store.updateSearchAccountFormTemporary = (formData: IFinesConSearchAccountState) => {
                updateSearchSpy(formData);
                originalUpdate(formData);
              };
            }
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {},
            fragment: of('search'),
            snapshot: {
              data: {
                businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    });
  };

  beforeEach(() => {
    finesConSelectBuFormData = structuredClone(FINES_CON_SELECT_BU_FORM_COMPANY_MOCK.formData);
    finesConSearchAccountFormData = structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData);
  });

  const assertValidationError = (message: string, inlineSelector: string) => {
    cy.get(CompanySearchLocators.errorSummary).should('be.visible').and('contain', message);
    cy.get(inlineSelector).should('be.visible').and('contain', message);
  };

  it('AC1. Search screen mirrors expected field types, headings and actions', () => {
    setupComponent();

    cy.get(CompanySearchLocators.heading).should('contain', 'Consolidate accounts');
    cy.get(CompanySearchLocators.searchTabLink).should('have.attr', 'aria-current', 'page');
    cy.get(CompanySearchLocators.accountNumberInput).should('be.visible');

    //AC1 to be covered by doing something TBC by JD. Undecided.

    //AC1a. Business unit displays the selected BU and is read-only'

    cy.get(CompanySearchLocators.businessUnitKey).should('contain', 'Business Unit');
    cy.get(CompanySearchLocators.businessUnitValue)
      .should('contain', 'Historical Debt')
      .find('input, select, textarea')
      .should('not.exist');

    //AC1b. Defendant type displays 'Company'
    cy.get(CompanySearchLocators.defendantTypeKey).should('contain', 'Defendant Type');
    cy.get(CompanySearchLocators.defendantTypeValue)
      .should('contain', 'Company')
      .find('input, select, textarea')
      .should('not.exist');

    //AC1c. Search screen mirrors expected field types, headings and actions
    cy.get(CompanySearchLocators.tabsNav).should('be.visible');
    cy.get(CompanySearchLocators.searchTab).should('contain', 'Search');
    cy.get(CompanySearchLocators.resultsTab).should('contain', 'Results');
    cy.get(CompanySearchLocators.forConsolidationTab).should('contain', 'For Consolidation');

    cy.get(CompanySearchLocators.quickSearchHeading).should('contain', 'Quick search');
    cy.contains(CompanySearchLocators.advancedSearchHeading, 'Advanced Search').should('be.visible');

    cy.get(CompanySearchLocators.accountNumberInput).should('have.attr', 'type', 'text');
    cy.get(CompanySearchLocators.companyNameInput).should('have.attr', 'type', 'text');
    cy.get(CompanySearchLocators.companyNameExactMatchCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(CompanySearchLocators.includeAliasesCheckbox).should('have.attr', 'type', 'checkbox');
    cy.get(CompanySearchLocators.addressLine1Input).should('have.attr', 'type', 'text');
    cy.get(CompanySearchLocators.postCodeInput).should('have.attr', 'type', 'text');

    cy.get(CompanySearchLocators.searchButton).should('be.visible').and('contain', 'Search');
    cy.contains(CompanySearchLocators.clearSearchLink, 'Clear search').should('be.visible');

    //AC1d. Hint text is present above Quick search heading
    cy.get(CompanySearchLocators.quickSearchHint)
      .invoke('text')
      .then((text) => {
        const normalisedText = text.replace(/\s+/g, ' ').trim();
        expect(normalisedText).to.equal(
          'Use quick search to search for an account using account number, or use advanced search',
        );
      });
  });

  it('AC2. Selecting Search with no populated fields triggers no action and user stays on same screen', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    setupComponent(updateSearchSpy);

    cy.get(CompanySearchLocators.searchButton).click();
    cy.get(CompanySearchLocators.errorSummary).should('not.exist');
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC3. Invalid search criteria display the expected errors and no search update occurs', () => {
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
    setupComponent(updateSearchSpy);
    cy.get(CompanySearchLocators.searchButton).click();

    const expectedValidationErrors = [
      {
        //AC3a. User enters value that is not in correct format and the following error is produced
        message: 'Enter account number in the correct format such as 12345678 or 12345678A',
        selector: CompanySearchLocators.accountNumberError,
      },
      {
        //AC3b. User enters non-alphabetical or special characters and the following error is produced
        message: 'Company name must only include letters a to z, hyphens, spaces and apostrophes',
        selector: CompanySearchLocators.companyNameError,
      },
      {
        //AC3c. User enters non-alphanumeric and the following error is produced
        message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
        selector: CompanySearchLocators.addressLine1Error,
      },
      {
        //AC3d. User enters non-alphanumeric and the following error is produced
        message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
        selector: CompanySearchLocators.postCodeError,
      },
    ];

    expectedValidationErrors.forEach(({ message, selector }) => {
      assertValidationError(message, selector);
    });

    //AC3 Following selecting 'search' the system remains on the same screen
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC4. Max length search validation displays the expected errors and no search update occurs', () => {
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
    setupComponent(updateSearchSpy);
    cy.get(CompanySearchLocators.searchButton).click();

    const expectedValidationErrors = [
      {
        //AC4a. User enters value exceeding the max characters. Error isnt in line with others/conflicts this one first. Confirmed in ..field-errors.constant that it should be 'Account number must be 9 characters or fewer',. Pri 3. How to reach?
        message: 'Account number must be 9 characters or fewer',
        selector: CompanySearchLocators.accountNumberError,
      },
      {
        //AC4b. User enters value exceeding the max characters.
        message: 'Company name must be 50 characters or fewer',
        selector: CompanySearchLocators.companyNameError,
      },
      {
        //AC4c. User enters value exceeding the max characters.
        message: 'Address line 1 must be 30 characters or fewer',
        selector: CompanySearchLocators.addressLine1Error,
      },
      {
        //AC4d. User enters value exceeding the max characters.
        message: 'Postcode must be 8 characters or fewer',
        selector: CompanySearchLocators.postCodeError,
      },
    ];

    expectedValidationErrors.forEach(({ message, selector }) => {
      assertValidationError(message, selector);
    });

    //AC4 Following selecting 'search' the system remains on the same screen
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC5. Field dependencies checked & display the expected errors when ommited - no search update occurs', () => {
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
    setupComponent(updateSearchSpy);
    cy.get(CompanySearchLocators.searchButton).click();

    const expectedValidationErrors = [
      {
        //AC5a, AC5b. Exact match & include alias boxes checked without a company name - Below error raised
        message: 'Enter company name',
        selector: CompanySearchLocators.companyNameError,
      },
    ];

    expectedValidationErrors.forEach(({ message, selector }) => {
      assertValidationError(message, selector);
    });

    //AC5 Following selecting 'search' the system remains on the same screen
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it.skip('AC6. When an account number and any other field is completed - search returns error screen', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData = {
      ...structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData),
      fcon_search_account_number: '12345678',
      fcon_search_account_companies_search_criteria: {
        fcon_search_account_companies_company_name: 'Test Company',
        fcon_search_account_companies_company_name_exact_match: false,
        fcon_search_account_companies_include_aliases: false,
        fcon_search_account_companies_address_line_1: null,
        fcon_search_account_companies_post_code: null,
      },
    };
    setupComponent(updateSearchSpy);
    cy.get(CompanySearchLocators.searchButton).click();

    //AC6a here. Should confirm page attempts to move to a Search error screen. Cant be covered. Probably remove from this test.
    // cy.location('pathname').should('include', '/search-error');
    // cy.get('h1').should('contain', 'Search error screen');

    //AC6 Following selecting 'search' the system moves to 'Search error screen'.
    cy.then(() => {
      expect(updateSearchSpy).to.have.been.called;
    });
  });

  it('AC7. AC8 Clear search button removes all populated data except in results/consolidation tabs, tabbing from one to another should retain data', () => {
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
    setupComponent(updateSearchSpy);

    // Confirming data has been retained after tabbing
    cy.get(CompanySearchLocators.accountNumberInput).should('have.value', '12345678');
    cy.get(CompanySearchLocators.companyNameInput).should('have.value', 'Test Company');
    cy.get(CompanySearchLocators.companyNameExactMatchCheckbox).should('be.checked');
    cy.get(CompanySearchLocators.includeAliasesCheckbox).should('be.checked');
    cy.get(CompanySearchLocators.addressLine1Input).should('have.value', '1 Test Street');
    cy.get(CompanySearchLocators.postCodeInput).should('have.value', 'L1 1TS');

    //AC7 Clicking the clear search
    cy.contains(CompanySearchLocators.clearSearchLink, 'Clear search').click();

    //AC7 All fields reset upon clear search click
    cy.get(CompanySearchLocators.accountNumberInput).should('have.value', '');
    cy.get(CompanySearchLocators.companyNameInput).should('have.value', '');
    cy.get(CompanySearchLocators.companyNameExactMatchCheckbox).should('not.be.checked');
    cy.get(CompanySearchLocators.includeAliasesCheckbox).should('not.be.checked');
    cy.get(CompanySearchLocators.addressLine1Input).should('have.value', '');
    cy.get(CompanySearchLocators.postCodeInput).should('have.value', '');

    //AC7a here. Should confirm other tabs have existing data remianing. TODO when implemented
    // cy.get(CompanySearchLocators.resultsTab).click();
    // cy.get(CompanySearchLocators.resultsTab).should('have.attr', 'aria-current', 'page');

    // cy.get(CompanySearchLocators.forConsolidationTab).click();
    // cy.get(CompanySearchLocators.forConsolidationTab).should('have.attr', 'aria-current', 'page');
  });
});
