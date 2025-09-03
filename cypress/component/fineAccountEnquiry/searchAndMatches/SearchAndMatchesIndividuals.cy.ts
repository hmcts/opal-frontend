import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_individuals_elements';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from './mocks/search_and_matches_individual_mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { finesSaIndividualAccountsResolver } from 'src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-individual-accounts.resolver';
import { getFirstDayOfCurrentMonth, getFirstDayOfPreviousMonth } from '../../../support/utils/dateUtils';

describe('Search Account Component - Individuals', () => {
  let individualSearchMock = structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([
          {
            path: 'fines/search-accounts/results',
            component: FinesSaSearchAccountComponent,
            resolve: {
              individualAccounts: finesSaIndividualAccountsResolver,
            },
            runGuardsAndResolvers: 'always',
          },
          {
            path: 'fines/search-accounts',
            component: FinesSaSearchAccountComponent,
          },
        ]),
        OpalFines,
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            store.setSearchAccount(individualSearchMock);

            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('individuals'),
            parent: {
              snapshot: {
                url: [{ path: 'search' }],
              },
            },
          },
        },
      ],
      componentProperties: {
        //handleSearchAccountSubmit: formSubmit,
      },
    });
  };
  beforeEach(() => {
    individualSearchMock = structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK);
  });

  it('AC1a-d. should render the search for an account screen', { tags: ['PO-705'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search for an account');
    cy.get(DOM_ELEMENTS.tabs).should('exist');
    cy.get(DOM_ELEMENTS.tabsList).should('exist');
    cy.get(DOM_ELEMENTS.individualsTab).should('exist');
    cy.get(DOM_ELEMENTS.companiesTab).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.majorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.individualsPanel).should('exist');
    cy.get(DOM_ELEMENTS.individualsHeading).should('contain', 'Individuals');
    cy.get(DOM_ELEMENTS.businessUnitSummaryList).should('exist');
    cy.get(DOM_ELEMENTS.businessUnitLink).should('exist').contains('Change');
    cy.get(DOM_ELEMENTS.businessUnitLink).click();
    cy.get(DOM_ELEMENTS.accountNumberLabel).should('exist').and('contain', 'Account number');
    cy.get(DOM_ELEMENTS.referenceNumberLabel).should('exist').and('contain', 'Reference or case number');
    cy.get(DOM_ELEMENTS.referenceNumberInput).should('exist');
    cy.get(DOM_ELEMENTS.lastNameLabel).should('exist').and('contain', 'Last name');
    cy.get(DOM_ELEMENTS.lastNameInput).should('exist');
    cy.get(DOM_ELEMENTS.lastNameExactMatchCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.firstNamesLabel).should('exist').and('contain', 'First names');
    cy.get(DOM_ELEMENTS.firstNamesInput).should('exist');
    cy.get(DOM_ELEMENTS.firstNamesExactMatchCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.includeAliasesCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.dobLabel).should('exist').and('contain', 'Date of birth');
    cy.get(DOM_ELEMENTS.dobInput).should('exist');
    cy.get(DOM_ELEMENTS.niNumberLabel).should('exist').and('contain', 'National Insurance number');
    cy.get(DOM_ELEMENTS.niNumberInput).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('exist').and('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('exist').and('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).should('be.checked');
    cy.get(DOM_ELEMENTS.searchButton).should('exist').and('contain', 'Search');
  });

  it('AC3a. should validate input fields and show errors', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_number = '123$%^78';

    cy.get(DOM_ELEMENTS.accountNumberInput).should('have.value', '123$%^78');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search for an account');

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Account number must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.accountNumberError)
      .should('exist')
      .and('contain', 'Account number must only contain letters or numbers');

    cy.get(DOM_ELEMENTS.accountNumberInput).clear();
  });

  it('AC3b. should show error for incorrectly formatted account number', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_number = '1234567';

    cy.get(DOM_ELEMENTS.accountNumberInput).should('have.value', '1234567');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Enter account number in the correct format such as 12345678 or 12345678A');
    cy.get(DOM_ELEMENTS.accountNumberError)
      .should('exist')
      .and('contain', 'Enter account number in the correct format such as 12345678 or 12345678A');

    cy.get(DOM_ELEMENTS.accountNumberInput).clear();
  });
  it('AC3c. should show error for non-alphabetical reference or case number', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_reference_case_number = 'REF@#$456';

    cy.get(DOM_ELEMENTS.referenceNumberInput).should('have.value', 'REF@#$456');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Reference or case number must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.referenceNumberError)
      .should('exist')
      .and('contain', 'Reference or case number must only contain letters or numbers');

    cy.get(DOM_ELEMENTS.referenceNumberInput).clear();
  });
  it('AC3d. should show error for non-alphabetical last name', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name =
      'Smith123';

    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Smith123');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Last name must only contain letters');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Last name must only contain letters');

    cy.get(DOM_ELEMENTS.lastNameInput).clear();
  });
  it('AC3e. should show error for non-alphabetical first names', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_first_names =
      'John123';

    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'John123');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'First names must only contain letters');
    cy.get(DOM_ELEMENTS.firstNamesError).should('exist').and('contain', 'First names must only contain letters');

    cy.get(DOM_ELEMENTS.firstNamesInput).clear();
  });
  it('AC3f. should show error for invalid date of birth format', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
      '15/AB/2020';

    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/AB/2020');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear();
  });
  it('AC3g. should show error for future date of birth', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
      '15/05/2030';

    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/05/2030');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date of birth must be in the past');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date of birth must be in the past');

    cy.get(DOM_ELEMENTS.dobInput).clear();
  });
  it('AC3h. should show error for incorrectly formatted date of birth', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
      '5/1/1980';

    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '5/1/1980');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear();
  });

  it('date picker should show the date in correct format DD/MM/YYYY', { tags: ['PO-1998'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.dobDatePickerToggle).click();
    cy.get(DOM_ELEMENTS.dobDatePickerPrevMonth).click();
    cy.get(DOM_ELEMENTS.dobDatePicker).contains(/^1$/).click();
    const expectedDate = getFirstDayOfPreviousMonth();
    cy.get(DOM_ELEMENTS.dobInput).should('have.value', expectedDate);
    cy.get(DOM_ELEMENTS.searchButton).click();
  });

  it('AC3i. should show error for invalid NI number', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_national_insurance_number =
      'AB123$%^C';

    cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123$%^C');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'National Insurance number must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.niNumberError)
      .should('exist')
      .and('contain', 'National Insurance number must only contain letters or numbers');

    cy.get(DOM_ELEMENTS.niNumberInput).clear();
  });
  it('AC3j. should show error for invalid address line 1', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_address_line_1 =
      '123 Test St. ®©™';

    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '123 Test St. ®©™');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Address line 1 must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.addressLine1Error)
      .should('exist')
      .and('contain', 'Address line 1 must only contain letters or numbers');

    cy.get(DOM_ELEMENTS.addressLine1Input).clear();
  });
  it('AC3k. should show error for invalid postcode', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_post_code =
      'SW1A @#!';

    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'SW1A @#!');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Postcode must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.postcodeError).should('exist').and('contain', 'Postcode must only contain letters or numbers');

    cy.get(DOM_ELEMENTS.postcodeInput).clear();
  });

  it('AC4a. should validate account number maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_number = '1234567890'; // 10 characters (exceeds 9)

    cy.get(DOM_ELEMENTS.accountNumberInput).should('have.value', '1234567890');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.accountNumberError)
      .should('exist')
      .and('contain', 'Account number must be 9 characters or fewer');
  });

  it('AC4b. should validate reference or case number maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_reference_case_number =
      'This reference number is way too long and exceeds thirty characters';

    cy.get(DOM_ELEMENTS.referenceNumberInput).should(
      'have.value',
      'This reference number is way too long and exceeds thirty characters',
    );
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.referenceNumberError)
      .should('exist')
      .and('contain', 'Reference or case number must be 30 characters or fewer');
  });

  it('AC4c. should validate last name maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name =
      'ThisLastNameIsTooLongAndExceedsThirtyCharacters';

    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'ThisLastNameIsTooLongAndExceedsThirtyCharacters');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Last name must be 30 characters or fewer');
  });

  it('AC4d. should validate first names maximum field length', { tags: ['PO-705'] }, () => {
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_first_names =
      'ThisFirstNameIsTooLongAndExceedsTwentyChars';
    setupComponent(null);

    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'ThisFirstNameIsTooLongAndExceedsTwentyChars');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.firstNamesError).should('exist').and('contain', 'First names must be 20 characters or fewer');
  });

  it('AC4e. should validate National Insurance number maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_national_insurance_number =
      'AB123456CD';

    cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123456CD');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.niNumberError)
      .should('exist')
      .and('contain', 'National Insurance number must be 9 characters or fewer');
  });

  it('AC4f. should validate Address Line 1 maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_address_line_1 =
      'This address line is too long and exceeds thirty characters';

    cy.get(DOM_ELEMENTS.addressLine1Input).should(
      'have.value',
      'This address line is too long and exceeds thirty characters',
    );
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Error)
      .should('exist')
      .and('contain', 'Address line 1 must be 30 characters or fewer');
  });

  it('AC4g. should validate Postcode maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_post_code =
      'AB12 3CDEF'; // 9 characters (exceeds 8)

    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'AB12 3CDEF');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.postcodeError).should('exist').and('contain', 'Postcode must be 8 characters or fewer');
  });

  it('AC5a should validate first name field dependency', { tags: ['PO-705'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.firstNamesInput).type('John', { delay: 0 });
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');
  });

  it('AC5b. should validate dob field dependency', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    cy.window().then((win) => {
      cy.stub(win.console, 'info').as('consoleLog');
    });

    cy.get(DOM_ELEMENTS.dobInput).focus().type('15/05/2020', { delay: 0 });
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');

    cy.get('@consoleLog').should('have.not.been.calledOnce');
  });

  it(
    'AC1. should send correct API parameters when search is triggered from Individuals tab',
    { tags: ['PO-717'] },
    () => {
      individualSearchMock.fsa_search_account_business_unit_ids = [1, 2, 3];
      individualSearchMock.fsa_search_account_active_accounts_only = true;
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name =
        'Smith';
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name_exact_match = true;
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_first_names =
        'John';
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_first_names_exact_match = false;
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_date_of_birth =
        '15/05/1990';
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_national_insurance_number =
        'AB123456C';
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_include_aliases = true;
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_address_line_1 =
        '123 High Street';
      individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_post_code =
        'SW1A 1AA';

      setupComponent(null);

      cy.window().then((win) => {
        cy.stub(win.console, 'info').as('consoleLog');
      });

      cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Smith');
      cy.get(DOM_ELEMENTS.lastNameExactMatchCheckbox).should('be.checked');
      cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'John');
      cy.get(DOM_ELEMENTS.firstNamesExactMatchCheckbox).should('not.be.checked');
      cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/05/1990');
      cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123456C');
      cy.get(DOM_ELEMENTS.includeAliasesCheckbox).should('be.checked');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '123 High Street');
      cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'SW1A 1AA');
      cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).should('be.checked');

      cy.get(DOM_ELEMENTS.searchButton).click();

      cy.get('@consoleLog').should('have.been.calledOnce');

      cy.get('@consoleLog').then((stub: any) => {
        const apiParams = stub.getCall(0).args[0];

        // AC1a: Verify all required parameters are present and correctly mapped

        expect(apiParams).to.have.property('business_unit_ids');
        expect(apiParams.business_unit_ids).to.deep.equal([1, 2, 3]);

        expect(apiParams).to.have.property('active_accounts_only', true);

        expect(apiParams).to.have.property('surname', 'Smith');
        expect(apiParams).to.have.property('exact_match_surname', true);

        expect(apiParams).to.have.property('forename', 'John');
        expect(apiParams).to.have.property('exact_match_forenames', false);

        expect(apiParams).to.have.property('date_of_birth', '15/05/1990');

        expect(apiParams).to.have.property('ni_number', 'AB123456C');

        expect(apiParams).to.have.property('include_aliases', true);

        expect(apiParams).to.have.property('address_line', '123 High Street');

        expect(apiParams).to.have.property('postcode', 'SW1A 1AA');

        expect(apiParams).to.have.property('search_type', 'individual');

        expect(apiParams.organisation_name).to.be.null;
      });
    },
  );

  it('AC1. should send correct API parameters when active accounts checkbox is unchecked', { tags: ['PO-717'] }, () => {
    individualSearchMock.fsa_search_account_business_unit_ids = [5];
    individualSearchMock.fsa_search_account_active_accounts_only = false;
    individualSearchMock.fsa_search_account_individuals_search_criteria!.fsa_search_account_individuals_last_name =
      'Doe';

    setupComponent(null);

    cy.window().then((win) => {
      cy.stub(win.console, 'info').as('consoleLog');
    });

    // Verify active accounts checkbox is unchecked
    cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).should('not.be.checked');
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Doe');

    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get('@consoleLog').should('have.been.calledOnce');

    cy.get('@consoleLog').then((stub: any) => {
      const apiParams = stub.getCall(0).args[0];

      expect(apiParams).to.have.property('active_accounts_only', false);
      expect(apiParams).to.have.property('business_unit_ids').that.deep.equals([5]);
      expect(apiParams).to.have.property('surname', 'Doe');
    });
  });

  it('AC1. should send correct API parameters with minimal required data', { tags: ['PO-717'] }, () => {
    individualSearchMock.fsa_search_account_business_unit_ids = [10];
    individualSearchMock.fsa_search_account_active_accounts_only = true;
    individualSearchMock.fsa_search_account_individuals_search_criteria = {
      fsa_search_account_individuals_last_name: 'Johnson',
      fsa_search_account_individuals_last_name_exact_match: false,
      fsa_search_account_individuals_first_names: '',
      fsa_search_account_individuals_first_names_exact_match: false,
      fsa_search_account_individuals_include_aliases: false,
      fsa_search_account_individuals_date_of_birth: '',
      fsa_search_account_individuals_national_insurance_number: '',
      fsa_search_account_individuals_address_line_1: '',
      fsa_search_account_individuals_post_code: '',
    };

    setupComponent(null);

    cy.window().then((win) => {
      cy.stub(win.console, 'info').as('consoleLog');
    });

    // Verify only surname is populated
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Johnson');
    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '');

    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get('@consoleLog').should('have.been.calledOnce');

    cy.get('@consoleLog').then((stub: any) => {
      const apiParams = stub.getCall(0).args[0];

      // Verify minimal required parameters
      expect(apiParams).to.have.property('surname', 'Johnson');
      expect(apiParams).to.have.property('exact_match_surname', false);
      expect(apiParams).to.have.property('business_unit_ids').that.deep.equals([10]);
      expect(apiParams).to.have.property('active_accounts_only', true);
      expect(apiParams).to.have.property('search_type', 'individual');

      // Verify empty/null fields are handled correctly
      expect(apiParams.forename).to.be.oneOf([null, '']);
      expect(apiParams.date_of_birth).to.be.oneOf([null, '']);
      expect(apiParams.ni_number).to.be.oneOf([null, '']);
      expect(apiParams.address_line).to.be.oneOf([null, '']);
      expect(apiParams.postcode).to.be.oneOf([null, '']);
      expect(apiParams).to.have.property('include_aliases', false);
    });
  });

  it('AC1a. Should validate last name field when alias checkbox selected', { tags: ['PO-1969'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.includeAliasesCheckbox).check().should('be.checked');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');
  });

  it(
    'AC1b. Should validate last name field when "Search exact match" for last name is selected',
    { tags: ['PO-1969'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.lastNameExactMatchCheckbox).check().should('be.checked');
      cy.get(DOM_ELEMENTS.searchButton).click();

      cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');
    },
  );
  it(
    'AC1c. Should validate first name field when "Search exact match" for first name is selected',
    { tags: ['PO-1969'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.firstNamesExactMatchCheckbox).check().should('be.checked');
      cy.get(DOM_ELEMENTS.searchButton).click();

      cy.get(DOM_ELEMENTS.firstNamesError).should('exist').and('contain', 'Enter first name');
    },
  );
});
