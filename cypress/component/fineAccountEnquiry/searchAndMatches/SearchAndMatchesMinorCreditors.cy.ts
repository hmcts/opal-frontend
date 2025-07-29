import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_minor_creditors_elements';
import { MINOR_CREDITORS_SEARCH_STATE_MOCK } from './mocks/search_and_matches_minor_creditors_mock';
import { delay } from 'cypress/types/bluebird';
import { only } from 'node:test';

describe('Search Account Component - Minor Creditors', () => {
  let minorCreditorsSearchMock = structuredClone(MINOR_CREDITORS_SEARCH_STATE_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            store.setSearchAccount(minorCreditorsSearchMock);

            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('minorCreditors'),
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
    minorCreditorsSearchMock = structuredClone(MINOR_CREDITORS_SEARCH_STATE_MOCK);
  });

  it('AC1-AC3. should render the search for an account screen and minor creditors tab', { tags: ['PO-715'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search for an account');
    cy.get(DOM_ELEMENTS.tabs).should('exist');
    cy.get(DOM_ELEMENTS.tabsList).should('exist');
    cy.get(DOM_ELEMENTS.individualsTab).should('exist');
    cy.get(DOM_ELEMENTS.companiesTab).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.majorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorsPanel).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).click();
    cy.get(DOM_ELEMENTS.companyNameLabel).should('exist').contains('Company name');
    cy.get(DOM_ELEMENTS.companyNameInput).should('exist');
    cy.get(DOM_ELEMENTS.companyNameExactMatchCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('exist').contains('Address line 1');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('exist').and('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).click();
    cy.get(DOM_ELEMENTS.lastNameLabel).should('exist').and('contain', 'Last name');
    cy.get(DOM_ELEMENTS.lastNameInput).should('exist');
    cy.get(DOM_ELEMENTS.lastNameExactMatchCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.firstNamesLabel).should('exist').and('contain', 'First names');
    cy.get(DOM_ELEMENTS.firstNamesInput).should('exist');
    cy.get(DOM_ELEMENTS.firstNamesExactMatchCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.minorIndividualAddressLine1Label).should('exist').and('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.minorIndividualAddressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.minorIndividualPostcodeLabel).should('exist').and('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.minorIndividualPostcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.accountNumberLabel).should('exist').and('contain', 'Account number');
    cy.get(DOM_ELEMENTS.referenceNumberLabel).should('exist').and('contain', 'Reference or case number');
    cy.get(DOM_ELEMENTS.referenceNumberInput).should('exist');
    cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).should('be.checked');
    cy.get(DOM_ELEMENTS.searchButton).should('exist').and('contain', 'Search');
  });

  it('AC6a. should show error for non-alphabetical last name', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_last_name = 'Smith123';
    
    cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).click();
    cy.get(DOM_ELEMENTS.lastNameInput).should('have.value', 'Smith123');
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'Last name must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.lastNameError).should('exist').and('contain', 'Last name must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.lastNameInput).clear();
  });

  it('AC6b. should show error for non-alphabetical first name', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_first_names = 'Name123';
    
    cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).click();
    cy.get(DOM_ELEMENTS.firstNamesInput).should('have.value', 'Name123');
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('exist').and('contain', 'First names must only include letters a to z, hyphens, spaces and apostrophes');
    cy.get(DOM_ELEMENTS.firstNamesError).should('exist').and('contain', 'First names must only include letters a to z, hyphens, spaces and apostrophes');

    cy.get(DOM_ELEMENTS.firstNamesInput).clear();
  });

  it('AC6c. should show error for non-alphabetical company name', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company_name = 'Company123';

    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Company name must only include letters a to z');
    cy.get(DOM_ELEMENTS.companyNameError).should('contain', 'Company name must only include letters a to z');
    cy.get(DOM_ELEMENTS.companyNameInput).clear();
  });

  it('AC6d. should show error for non-alphabetical address line 1', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_individual_address_line_1 =
      'Address123?';
      cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain','Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',);
    cy.get(DOM_ELEMENTS.minorIndividualAddressLine1Error).should('contain','Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',);
    cy.get(DOM_ELEMENTS.minorIndividualAddressLine1Input).clear();
  });

  it('AC6e. should show error for non-alphabetical post code', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company_post_code = 'POSTCODE?';
    
    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain','Post code must only include letters a to z, numbers, hyphens, spaces and apostrophes',);
    cy.get(DOM_ELEMENTS.postcodeError).should('contain','Post code must only include letters a to z, numbers, hyphens, spaces and apostrophes',);
    cy.get(DOM_ELEMENTS.postcodeInput).clear();
  });

  it('AC7a. should validate last name maximum field length', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_last_name =      'Abcdefghijklmnopqrstuvwxyzabcdefg';

    cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Last name must be 30 characters or fewer');
    cy.get(DOM_ELEMENTS.lastNameError).should('contain', 'Last name must be 30 characters or fewer');
    cy.get(DOM_ELEMENTS.lastNameInput).clear();
  });

  it('AC7b. should validate first names maximum field length', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_first_names = 'AbcdefghijklmnopqrstA';

    cy.get(DOM_ELEMENTS.minorCreditorIndividualRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'First names must be 20 characters or fewer');
    cy.get(DOM_ELEMENTS.firstNamesError).should('contain', 'First names must be 20 characters or fewer');
    cy.get(DOM_ELEMENTS.firstNamesInput).clear();
  });

  it('AC7c. should validate company name maximum field length', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company_name = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijs';

    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Company name must be 50 characters or fewer');
    cy.get(DOM_ELEMENTS.companyNameError).should('contain', 'Company name must be 50 characters or fewer');
    cy.get(DOM_ELEMENTS.companyNameInput).clear();
  });

  it('AC7d. should validate address line 1 maximum field length', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company_address_line_1 = 'Address1234Address1234Address12345';

    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Address line 1 must be 30 characters or fewer');
    cy.get(DOM_ELEMENTS.addressLine1Error).should('contain', 'Address line 1 must be 30 characters or fewer');
    cy.get(DOM_ELEMENTS.addressLine1Input).clear();
  });

  it('AC7e. should validate post code maximum field length', { tags: ['PO-715'] }, () => {
    setupComponent(null);
    minorCreditorsSearchMock.fsa_search_account_minor_creditors_search_criteria!.fsa_search_account_minor_creditors_company_post_code =
      'POSTCODES';
    
    cy.get(DOM_ELEMENTS.minorCreditorCompanyRadioButton).click();
    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Post code must be 8 characters or fewer');
    cy.get(DOM_ELEMENTS.postcodeError).should('contain', 'Post code must be 8 characters or fewer');
    cy.get(DOM_ELEMENTS.postcodeInput).clear();
  });
});