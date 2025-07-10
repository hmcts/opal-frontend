import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_company_elements';
import { COMPANY_SEARCH_STATE_MOCK } from './mocks/search_and_matches_company_mock';
import { delay } from 'cypress/types/bluebird';

describe('Search Account Component - Company', () => {
  let companySearchMock = structuredClone(COMPANY_SEARCH_STATE_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            store.setSearchAccount(companySearchMock);

            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('companies'),
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
    companySearchMock = structuredClone(COMPANY_SEARCH_STATE_MOCK);
  });

  it('AC1a-b. should render the search for an account screen and companies tab', { tags: ['PO-712'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.companiesTab).click();
    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search for an account');
    cy.get(DOM_ELEMENTS.tabs).should('exist');
    cy.get(DOM_ELEMENTS.tabsList).should('exist');
    cy.get(DOM_ELEMENTS.individualsTab).should('exist');
    cy.get(DOM_ELEMENTS.companiesTab).should('exist');
    cy.get(DOM_ELEMENTS.minorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.majorCreditorsTab).should('exist');
    cy.get(DOM_ELEMENTS.companiesPanel).should('exist');
    cy.get(DOM_ELEMENTS.companiesHeading).should('contain', 'Companies');
    cy.get(DOM_ELEMENTS.companyNameLabel).should('exist').contains('Company name');
    cy.get(DOM_ELEMENTS.companyNameInput).should('exist');
    cy.get(DOM_ELEMENTS.companyNameExactMatchCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.includeAliasCheckbox).should('exist').and('not.be.checked');
    cy.get(DOM_ELEMENTS.addressLine1Label).should('exist').contains('Address line 1');
    cy.get(DOM_ELEMENTS.addressLine1Input).should('exist');
    cy.get(DOM_ELEMENTS.postcodeLabel).should('exist').and('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.postcodeInput).should('exist');
    cy.get(DOM_ELEMENTS.accountNumberLabel).should('exist').and('contain', 'Account number');
    cy.get(DOM_ELEMENTS.referenceNumberLabel).should('exist').and('contain', 'Reference or case number');
    cy.get(DOM_ELEMENTS.referenceNumberInput).should('exist');
    cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).should('be.checked');
    cy.get(DOM_ELEMENTS.searchButton).should('exist').and('contain', 'Search');
  });

  it('AC3a. should show error for non-alphabetical company name', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name =
      'Company123';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Company name must only include letters a to z');
    cy.get(DOM_ELEMENTS.companyNameError).should('contain', 'Company name must only include letters a to z');
    cy.get(DOM_ELEMENTS.companyNameInput).clear();
  });

  it('AC3b. should show error for non-alphabetical address line 1', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 =
      'Address123?';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should(
      'contain',
      'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
    cy.get(DOM_ELEMENTS.addressLine1Error).should(
      'contain',
      'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
    cy.get(DOM_ELEMENTS.addressLine1Input).clear();
  });

  it('AC3c. should show error for non-alphabetical post code', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code =
      'POSTCODE?';

    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should(
      'contain',
      'Post code must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );
    cy.get(DOM_ELEMENTS.postcodeError).should(
      'contain',
      'Post code must only include letters a to z, numbers, hyphens, spaces and apostrophes',
    );

    cy.get(DOM_ELEMENTS.postcodeInput).clear();
  });

  it('AC4a. should validate company name maximum field length', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name =
      'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijs';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Company name must be 50 characters or fewer');
    cy.get(DOM_ELEMENTS.companyNameError).should('contain', 'Company name must be 50 characters or fewer');
    cy.get(DOM_ELEMENTS.companyNameInput).clear();
  });

  it('AC4b. should validate address line 1 maximum field length', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 =
      'Address1234Address1234Address12345';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Address line 1 must be 30 characters or fewer');
    cy.get(DOM_ELEMENTS.addressLine1Error).should('contain', 'Address line 1 must be 30 characters or fewer');
    cy.get(DOM_ELEMENTS.addressLine1Input).clear();
  });

  it('AC4c. should validate post code maximum field length', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code =
      'POSTCODES';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Post code must be 8 characters or fewer');
    cy.get(DOM_ELEMENTS.postcodeError).should('contain', 'Post code must be 8 characters or fewer');
    cy.get(DOM_ELEMENTS.postcodeInput).clear();
  });

  it('AC5a. should validate post code maximum field length', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code =
      'POSTCODES';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Post code must be 8 characters or fewer');
    cy.get(DOM_ELEMENTS.postcodeError).should('contain', 'Post code must be 8 characters or fewer');
    cy.get(DOM_ELEMENTS.postcodeInput).clear();
  });
});
