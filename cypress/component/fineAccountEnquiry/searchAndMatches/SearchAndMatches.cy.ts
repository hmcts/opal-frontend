import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute} from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_elements';
import { IFinesSaSearchAccountState } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';

describe('Search Account Component', () => {
  const setupComponent = (formSubmit: any = null, mockState?: IFinesSaSearchAccountState | null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            if (mockState) {
              store.setSearchAccountTemporary(mockState);
            }
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
        handleSearchAccountSubmit: formSubmit
      },
    });
  };

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

  it('AC2. should not trigger any actions when Search button is clicked with no data', { tags: ['PO-705'] }, () => {
    const searchSubmitSpy = cy.spy().as('searchSubmitSpy');
    setupComponent(searchSubmitSpy);

    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search for an account');
    
    cy.get('@searchSubmitSpy').should('have.been.called');

    cy.get(DOM_ELEMENTS.accountNumberInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.referenceNumberInput).should('exist').and('have.value', '');

    cy.get(DOM_ELEMENTS.lastNameInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.firstNamesInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.niNumberInput).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist').and('have.value', '');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist').and('have.value', '');

    cy.get(DOM_ELEMENTS.dobInput).should('exist').and('have.value', '');
  });

  it('AC3a-k. should validate input fields and show errors', { tags: ['PO-705'] }, () => {
    setupComponent(null);

    // AC3a. should show error for non-alphabetical account number
    cy.get(DOM_ELEMENTS.accountNumberInput).type('123$%^78');
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

    // AC3b. should show error for incorrectly formatted account number
    cy.get(DOM_ELEMENTS.accountNumberInput).type('1234567');
    cy.get(DOM_ELEMENTS.accountNumberInput).should('have.value', '1234567');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Enter account number in the correct format such as 12345678 or 12345678A');
    cy.get(DOM_ELEMENTS.accountNumberError)
      .should('exist')
      .and('contain', 'Enter account number in the correct format such as 12345678 or 12345678A');

    cy.get(DOM_ELEMENTS.accountNumberInput).clear();

    // AC3c. should show error for non-alphabetical reference or case number
    cy.get(DOM_ELEMENTS.referenceNumberInput).type('REF@#$456');
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

    // AC3d. should show error for non-alphabetical last name
    cy.get(DOM_ELEMENTS.lastNameInput).type('Smith123');
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Smith123');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Last name must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.lastNameError)
      .should('exist')
      .and('contain', 'Last name must only include letters a to z, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.lastNameInput).clear();

    // AC3e. should show error for non-alphabetical first names
    cy.get(DOM_ELEMENTS.firstNamesInput).type('John123');
    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'John123');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'First names must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.firstNamesError)
      .should('exist')
      .and('contain', 'First names must only include letters a to z, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.firstNamesInput).clear();

    // AC3f. should show error for invalid date of birth format
    cy.get(DOM_ELEMENTS.dobInput).type('15/AB/2020');
    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/AB/2020');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear();

    // AC3g. should show error for future date of birth
    cy.get(DOM_ELEMENTS.dobInput).type('15/05/2030');
    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '15/05/2030');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date of birth must be in the past');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date of birth must be in the past');

    cy.get(DOM_ELEMENTS.dobInput).clear();

    // AC3h. should show error for incorrectly formatted date of birth
    cy.get(DOM_ELEMENTS.dobInput).type('5/1/1980');
    cy.get(DOM_ELEMENTS.dobInput).should('have.value', '5/1/1980');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');
    cy.get(DOM_ELEMENTS.dobError).should('exist').and('contain', 'Date must be in the format DD/MM/YYYY');

    cy.get(DOM_ELEMENTS.dobInput).clear();

    // AC3i. should show error for invalid NI number
    cy.get(DOM_ELEMENTS.niNumberInput).type('AB123$%^C');
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

    // AC3j. should show error for invalid address line 1
    cy.get(DOM_ELEMENTS.addressLine1Input).type('123 Test St. ®©™');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '123 Test St. ®©™');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary)
      .should('exist')
      .and('contain', 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.addressLine1Error)
      .should('exist')
      .and('contain', 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.addressLine1Input).clear();

    // AC3k. should show error for invalid postcode
    cy.get(DOM_ELEMENTS.postcodeInput).type('SW1A @#!');
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

  it('AC4a-g. should validate maximum field lengths', { tags: ['PO-705'] }, () => {
    setupComponent(null);

    // AC4a. A user enters too many characters into the 'Account Number' field
    cy.get(DOM_ELEMENTS.accountNumberInput).type('1234567890');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.accountNumberError)
      .should('exist')
      .and('contain', 'Account number must be 9 characters or fewer');

    
    cy.get(DOM_ELEMENTS.accountNumberInput).clear();

    // AC4b. A user enters too many characters into the 'Reference or case number' field
    cy.get(DOM_ELEMENTS.referenceNumberInput).type(
      'This reference number is way too long and exceeds thirty characters',
    );
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.referenceNumberError)
      .should('exist')
      .and('contain', 'Reference or case number must be 30 characters or fewer');

    
    cy.get(DOM_ELEMENTS.referenceNumberInput).clear();

    // AC4c. A user enters too many characters into the 'Last names' field
    cy.get(DOM_ELEMENTS.lastNameInput).type('ThisLastNameIsTooLongAndExceedsThirtyCharacters');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Last name must be 30 characters or fewer');

    
    cy.get(DOM_ELEMENTS.lastNameInput).clear();

    // AC4d. A user enters too many characters into the 'First names' field
    cy.get(DOM_ELEMENTS.firstNamesInput).type('ThisFirstNameIsTooLongAndExceedsTwentyChars');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.firstNamesError).should('exist').and('contain', 'First names must be 20 characters or fewer');

    
    cy.get(DOM_ELEMENTS.firstNamesInput).clear();

    // AC4e. A user enters too many characters into the 'National Insurance number' field
    cy.get(DOM_ELEMENTS.niNumberInput).type('AB123456CD');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.niNumberError)
      .should('exist')
      .and('contain', 'National Insurance number must be 9 characters or fewer');

    
    cy.get(DOM_ELEMENTS.niNumberInput).clear();

    // AC4f. A user enters too many characters into the 'Address Line 1' field
    cy.get(DOM_ELEMENTS.addressLine1Input).type('This address line is too long and exceeds thirty characters');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.addressLine1Error)
      .should('exist')
      .and('contain', 'Address line 1 must be 30 characters or fewer');

    
    cy.get(DOM_ELEMENTS.addressLine1Input).clear();

    // AC4g. A user enters too many characters into the 'Postcode' field
    cy.get(DOM_ELEMENTS.postcodeInput).type('AB12 3CDEF'); // 9 characters (exceeds 8)
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.postcodeError).should('exist').and('contain', 'Postcode must be 8 characters or fewer');

    
  });

  it('AC5a-b. should validate field dependencies', { tags: ['PO-705'] }, () => {
    setupComponent(null);

    // AC5a. A user enters data into the first names field, without entering any data in the 'Last name' field
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.firstNamesInput).type('John');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');

    
    cy.get(DOM_ELEMENTS.firstNamesInput).clear();

    // AC5b. A user enters data into the Date of birth field, without entering any data in the 'Last name' field
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', '');
    cy.get(DOM_ELEMENTS.dobInput).type('15/05/2020');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('exist');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Enter last name');

    
  });
});
