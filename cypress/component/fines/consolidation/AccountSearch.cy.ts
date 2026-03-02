import { mount } from 'cypress/angular';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { FinesConConsolidateAccComponent } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-consolidate-acc/fines-con-consolidate-acc.component';
import { FinesConStore } from 'src/app/flows/fines/fines-con/stores/fines-con.store';
import { FINES_CON_SELECT_BU_FORM_DATA_MOCK } from 'src/app/flows/fines/fines-con/select-business-unit/fines-con-select-bu/mocks/fines-con-select-bu-form-data.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { AccountSearchLocators } from '../../../shared/selectors/consolidation/AccountSearch.locators';
import { of } from 'rxjs';
import { FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/mocks/fines-con-search-account-form.mock';
import { IFinesConSearchAccountState } from 'src/app/flows/fines/fines-con/consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';

describe('FinesConConsolidateAccComponent - Account Search', () => {
  let finesConSelectBuFormData = structuredClone(FINES_CON_SELECT_BU_FORM_DATA_MOCK);
  let finesConSearchAccountFormData: IFinesConSearchAccountState = structuredClone(
    FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData,
  );

  const setupComponent = (
    updateSearchSpy?: (formData: IFinesConSearchAccountState) => void,
    setupRouterSpy: boolean = false,
  ) => {
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
    }).then(({ fixture }) => {
      const store = fixture.componentRef.injector.get(FinesConStore);
      cy.wrap(store).as('finesConStore');
      cy.wrap(fixture).as('consolidationFixture');

      if (!setupRouterSpy) {
        return;
      }

      const router = fixture.componentRef.injector.get(Router);
      cy.spy(router, 'navigate').as('routerNavigate');
    });
  };

  beforeEach(() => {
    finesConSelectBuFormData = structuredClone(FINES_CON_SELECT_BU_FORM_DATA_MOCK);
    finesConSearchAccountFormData = structuredClone(FINES_CON_SEARCH_ACCOUNT_FORM_EMPTY_MOCK.formData);
  });

  const assertValidationError = (message: string, inlineSelector: string) => {
    cy.get(AccountSearchLocators.errorSummary).should('be.visible').and('contain', message);
    cy.get(inlineSelector).should('be.visible').and('contain', message);
  };

  const switchToTab = (tab: 'search' | 'results' | 'for-consolidation') => {
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

  it('AC1. Search screen mirrors expected field types, headings and actions', () => {
    setupComponent();

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

  it('AC2. Selecting Search with no populated fields triggers no action and user stays on same screen', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    setupComponent(updateSearchSpy);

    cy.get(AccountSearchLocators.searchButton).click();
    cy.get(AccountSearchLocators.errorSummary).should('not.exist');
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC3. Invalid search criteria display the expected errors and no search update occurs', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData = {
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
    setupComponent(updateSearchSpy);
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
  });

  it('AC4. Max length validation errors display expected messages and no search update occurs', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData = {
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
    setupComponent(updateSearchSpy);
    cy.get(AccountSearchLocators.searchButton).click();

    const expectedValidationErrors = [
      {
        message: 'Account number must be 9 characters or fewer.',
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
        message: 'National Insurance number must be 9 characters or fewer.',
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
  });

  it('AC5a. User enters data into First names without Last name and sees Enter last name', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_first_names =
      'John';

    setupComponent(updateSearchSpy);
    cy.get(AccountSearchLocators.searchButton).click();

    assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC5b. User enters Date of birth without Last name and sees Enter last name', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_date_of_birth =
      '01/01/2000';
    setupComponent(updateSearchSpy);
    cy.get(AccountSearchLocators.searchButton).click();

    assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC5c. User selects Include aliases without Last name and sees Enter last name', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_include_aliases = true;
    setupComponent(updateSearchSpy);
    cy.get(AccountSearchLocators.searchButton).click();

    assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC5d. User selects Search exact match for Last name without Last name and sees Enter last name', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData.fcon_search_account_individuals_search_criteria!.fcon_search_account_individuals_last_name_exact_match = true;

    setupComponent(updateSearchSpy);
    cy.get(AccountSearchLocators.searchButton).click();

    assertValidationError('Enter last name', AccountSearchLocators.lastNameError);
    cy.then(() => {
      expect(updateSearchSpy).to.not.have.been.called;
    });
  });

  it('AC6a. When account number is entered, it is used exclusively for the search payload', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData.fcon_search_account_number = '12345678';

    setupComponent(updateSearchSpy);
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
  });

  it('AC6b. When National Insurance number is entered, it is used exclusively for the search payload', () => {
    const updateSearchSpy = Cypress.sinon.spy();
    finesConSearchAccountFormData.fcon_search_account_national_insurance_number = 'AB123456C';

    setupComponent(updateSearchSpy);
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
  });

  it('AC7. Selecting Clear search clears all entered Search tab data', () => {
    finesConSearchAccountFormData = {
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
    setupComponent();

    cy.contains(AccountSearchLocators.clearSearchLink, 'Clear search').click();

    assertSearchFieldsAreCleared();
  });

  it('AC7a. Clear search does not clear other tabs; note: Results/For consolidation currently have no data model to assert', () => {
    finesConSearchAccountFormData = {
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
    setupComponent();

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
  });
});
