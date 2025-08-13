import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_individuals_elements';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from './mocks/search_and_matches_individual_mock';
import { delay } from 'cypress/types/bluebird';

describe('Search Account Component - Individuals', () => {
  let individualSearchMock = structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
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
        handleSearchAccountSubmit: formSubmit,
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
      .and('contain', 'Account number must only include letters a to z, numbers, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.accountNumberError)
      .should('exist')
      .and('contain', 'Account number must only include letters a to z, numbers, hyphens, spaces and apostrophes');

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
      .and(
        'contain',
        'Reference or case number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );
    cy.get(DOM_ELEMENTS.referenceNumberError)
      .should('exist')
      .and(
        'contain',
        'Reference or case number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );

    cy.get(DOM_ELEMENTS.referenceNumberInput).clear();
  });
  it('AC3d. should show error for non-alphabetical last name', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_last_name =
      'Smith123';

    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Smith123');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Last name must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.lastNameError)
      .should('exist')
      .and('contain', 'Last name must only include letters a to z, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.lastNameInput).clear();
  });
  it('AC3e. should show error for non-alphabetical first names', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_first_names =
      'John123';

    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'John123');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'First names must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.firstNamesError)
      .should('exist')
      .and('contain', 'First names must only include letters a to z, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.firstNamesInput).clear();
  });
  it('AC3f. should show error for invalid date of birth format', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_date_of_birth =
      '15/AB/2020';

    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/AB/2020');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear();
  });
  it('AC3g. should show error for future date of birth', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_date_of_birth =
      '15/05/2030';

    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/05/2030');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date of birth must be in the past');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date of birth must be in the past');

    cy.get(DOM_ELEMENTS.dobInput).clear();
  });
  it('AC3h. should show error for incorrectly formatted date of birth', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_date_of_birth =
      '5/1/1980';

    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '5/1/1980');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear();
  });

  it('AC3i. should show error for invalid NI number', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_national_insurance_number =
      'AB123$%^C';

    cy.get(DOM_ELEMENTS.niNumberInput).should('have.value', 'AB123$%^C');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and(
        'contain',
        'National Insurance number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );
    cy.get(DOM_ELEMENTS.niNumberError)
      .should('exist')
      .and(
        'contain',
        'National Insurance number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      );

    cy.get(DOM_ELEMENTS.niNumberInput).clear();
  });
  it('AC3j. should show error for invalid address line 1', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_address_line_1 =
      '123 Test St. ®©™';

    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '123 Test St. ®©™');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.addressLine1Error)
      .should('exist')
      .and('contain', 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.addressLine1Input).clear();
  });
  it('AC3k. should show error for invalid postcode', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_post_code =
      'SW1A @#!';

    cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'SW1A @#!');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.postcodeError)
      .should('exist')
      .and('contain', 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes');

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
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_last_name =
      'ThisLastNameIsTooLongAndExceedsThirtyCharacters';

    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'ThisLastNameIsTooLongAndExceedsThirtyCharacters');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Last name must be 30 characters or fewer');
  });

  it('AC4d. should validate first names maximum field length', { tags: ['PO-705'] }, () => {
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_first_names =
      'ThisFirstNameIsTooLongAndExceedsTwentyChars';
    setupComponent(null);

    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'ThisFirstNameIsTooLongAndExceedsTwentyChars');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.firstNamesError).should('exist').and('contain', 'First names must be 20 characters or fewer');
  });

  it('AC4e. should validate National Insurance number maximum field length', { tags: ['PO-705'] }, () => {
    setupComponent(null);
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_national_insurance_number =
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
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_address_line_1 =
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
    individualSearchMock.fsa_search_account_individual_search_criteria!.fsa_search_account_individuals_post_code =
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

    cy.get(DOM_ELEMENTS.dobInput).type('15/05/2020', { delay: 0 });
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');
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
