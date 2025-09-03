import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_company_elements';
import { COMPANY_SEARCH_STATE_MOCK } from './mocks/search_and_matches_company_mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { finesSaCompanyAccountsResolver } from 'src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-company-accounts.resolver';

describe('Search Account Component - Company', () => {
  let companySearchMock = structuredClone(COMPANY_SEARCH_STATE_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([
          {
            path: 'fines/search-accounts/results',
            component: FinesSaSearchAccountComponent,
            resolve: {
              companyAccounts: finesSaCompanyAccountsResolver,
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
        //handleSearchAccountSubmit: formSubmit,
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
      'Company123!';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should(
      'contain',
      'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
    );
    cy.get(DOM_ELEMENTS.companyNameError).should(
      'contain',
      'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
    );
    cy.get(DOM_ELEMENTS.companyNameInput).clear();
  });

  it('AC3b. should show error for non-alphabetical address line 1', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 =
      'Address123?';

    cy.get(DOM_ELEMENTS.searchButton).click();
    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Address line 1 must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.addressLine1Error).should('contain', 'Address line 1 must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.addressLine1Input).clear();
  });

  it('AC3c. should show error for non-alphabetical post code', { tags: ['PO-712'] }, () => {
    setupComponent(null);
    companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code =
      'POSTCODE?';

    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.errorSummary).should('contain', 'Post code must only contain letters or numbers');
    cy.get(DOM_ELEMENTS.postcodeError).should('contain', 'Post code must only contain letters or numbers');

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

  it('AC2a. Should validate company name field when "Alias" checkbox is selected', { tags: ['PO-1969'] }, () => {
    setupComponent(null);

    cy.get(DOM_ELEMENTS.companiesTab).click();
    cy.get(DOM_ELEMENTS.includeAliasCheckbox).check().should('be.checked');
    cy.get(DOM_ELEMENTS.searchButton).click();

    cy.get(DOM_ELEMENTS.companyNameError).should('exist').and('contain', 'Enter company name');
  });

  it(
    'AC2b. Should validate company name field when "Search exact match" for company name is selected',
    { tags: ['PO-1969'] },
    () => {
      setupComponent(null);

      cy.get(DOM_ELEMENTS.companiesTab).click();
      cy.get(DOM_ELEMENTS.companyNameExactMatchCheckbox).check().should('be.checked');
      cy.get(DOM_ELEMENTS.searchButton).click();

      cy.get(DOM_ELEMENTS.companyNameError).should('exist').and('contain', 'Enter company name');
    },
  );

  it(
    'AC1, should send correct API parameters when search is triggered from Companies tab',
    { tags: ['PO-707'] },
    () => {
      companySearchMock.fsa_search_account_business_unit_ids = [1, 2, 3];
      companySearchMock.fsa_search_account_active_accounts_only = true;
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name =
        'Tech Solutions';
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name_exact_match = true;
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_include_aliases = true;
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 =
        '456 Business Rd';
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code =
        'EC1A 1BB';

      setupComponent(null);

      cy.window().then((win) => {
        cy.stub(win.console, 'info').as('consoleLog');
      });

      cy.get(DOM_ELEMENTS.companyNameInput).should('have.value', 'Tech Solutions');
      cy.get(DOM_ELEMENTS.companyNameExactMatchCheckbox).should('be.checked');
      cy.get(DOM_ELEMENTS.includeAliasCheckbox).should('be.checked');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '456 Business Rd');
      cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', 'EC1A 1BB');

      cy.get(DOM_ELEMENTS.searchButton).click();

      cy.get('@consoleLog').should('have.been.calledOnce');

      cy.get('@consoleLog').then((stub: any) => {
        const apiParams = stub.getCall(0).args[0];

        // AC1a: Verify all required parameters are present and correctly mapped

        expect(apiParams).to.have.property('organisation_name');
        expect(apiParams.organisation_name).to.equal('Tech Solutions');
        expect(apiParams).to.have.property('exact_match_organisation_name', true);
        expect(apiParams).to.have.property('include_aliases', true);
        expect(apiParams).to.have.property('address_line', '456 Business Rd');
        expect(apiParams).to.have.property('postcode', 'EC1A 1BB');
        expect(apiParams).to.have.property('business_unit_ids');
        expect(apiParams.business_unit_ids).to.deep.equal([1, 2, 3]);
        expect(apiParams).to.have.property('active_accounts_only', true);
        expect(apiParams).to.have.property('search_type', 'company');
        expect(apiParams.surname).to.be.null;
        expect(apiParams.forename).to.be.null;
        expect(apiParams.date_of_birth).to.be.null;
        expect(apiParams.ni_number).to.be.null;
      });
    },
  );

  it(
    'AC1, should send correct API parameters when search is triggered from Companies tab with minimal fields',
    { tags: ['PO-707'] },
    () => {
      companySearchMock.fsa_search_account_business_unit_ids = [1];
      companySearchMock.fsa_search_account_active_accounts_only = false;
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name =
        'Tech';
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_company_name_exact_match = false;
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_include_aliases = false;
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_address_line_1 = '';
      companySearchMock.fsa_search_account_companies_search_criteria!.fsa_search_account_companies_post_code = '';

      setupComponent(null);

      cy.window().then((win) => {
        cy.stub(win.console, 'info').as('consoleLog');
      });

      cy.get(DOM_ELEMENTS.companyNameInput).should('have.value', 'Tech');
      cy.get(DOM_ELEMENTS.companyNameExactMatchCheckbox).should('not.be.checked');
      cy.get(DOM_ELEMENTS.includeAliasCheckbox).should('not.be.checked');
      cy.get(DOM_ELEMENTS.addressLine1Input).should('have.value', '');
      cy.get(DOM_ELEMENTS.postcodeInput).should('have.value', '');

      cy.get(DOM_ELEMENTS.activeAccountsOnlyCheckbox).uncheck().should('not.be.checked');

      cy.get(DOM_ELEMENTS.searchButton).click();

      cy.get('@consoleLog').should('have.been.calledOnce');

      cy.get('@consoleLog').then((stub: any) => {
        const apiParams = stub.getCall(0).args[0];

        // AC1a: Verify all required parameters are present and correctly mapped

        expect(apiParams).to.have.property('organisation_name');
        expect(apiParams.organisation_name).to.equal('Tech');
        expect(apiParams).to.have.property('exact_match_organisation_name', false);
        expect(apiParams).to.have.property('include_aliases', false);
        expect(apiParams).to.have.property('address_line', '');
        expect(apiParams).to.have.property('postcode', '');
        expect(apiParams).to.have.property('business_unit_ids');
        expect(apiParams.business_unit_ids).to.deep.equal([1]);
        expect(apiParams).to.have.property('active_accounts_only', false);
        expect(apiParams).to.have.property('search_type', 'company');
        expect(apiParams.surname).to.be.null;
        expect(apiParams.forename).to.be.null;
        expect(apiParams.date_of_birth).to.be.null;
        expect(apiParams.ni_number).to.be.null;
      });
    },
  );
});
