import { mount } from 'cypress/angular';
import { FinesSaResultsComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-results/fines-sa-results.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_results_individuals_elements';
import {
  EMPTY_SEARCH_RESULTS_MOCK,
  SEARCH_RESULTS_WITH_DATA_MOCK,
  LARGE_SEARCH_RESULTS_MOCK,
  PAGINATION_SEARCH_RESULTS_MOCK,
} from './mocks/search_results_companies_mock';
import { SORTING_SEARCH_RESULTS_MOCK_COMPANIES } from './mocks/search_results_sorting_companies_mock';
import { COMPANY_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_company_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';

describe('FinesSaResultsComponent - Companies', () => {
  let searchResultState = {
    searchAccount: COMPANY_SEARCH_STATE_MOCK,
    unsavedChanges: false,
    stateChanges: false,
  };

  afterEach(() => {
    searchResultState = {
      searchAccount: COMPANY_SEARCH_STATE_MOCK,
      unsavedChanges: false,
      stateChanges: false,
    };
  });

  const setupComponent = (mockSearchResults = EMPTY_SEARCH_RESULTS_MOCK) => {
    mount(FinesSaResultsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesSaStore,
          useFactory: () => {
            const store = new FinesSaStore();
            store.setSearchAccount(searchResultState.searchAccount);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('companies'),
            snapshot: {
              url: [{ path: 'search-results' }],
              data: {
                companyAccounts: mockSearchResults,
              },
            },
            parent: {
              snapshot: {
                url: [{ path: 'search' }],
              },
            },
          },
        },
      ],
    });
  };

  it('Search company results component is created correctly', { tags: ['PO-707'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
  });

  it('(AC2) Displays error message when no search matches are found', { tags: ['PO-707'] }, () => {
    setupComponent(EMPTY_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.noResultsHeading).should('contain', 'There are no matching results');

    //(AC2b) Check your search link is clickable and functional
    // Test that the link is clickable (Full Test to be implemented when API complete)
    cy.get(DOM_ELEMENTS.checkSearchLink).should('have.class', 'govuk-link');
    cy.get(DOM_ELEMENTS.checkSearchLink).should('be.visible').click();
    cy.get(DOM_ELEMENTS.checkSearchLink).should('contain', 'Check your search');
  });

  it('(AC3) Handles more than 100 search matches correctly', { tags: ['PO-717'] }, () => {
    setupComponent(LARGE_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.tooManyResultsHeading).should('contain', 'There are more than 100 results');
    cy.get(DOM_ELEMENTS.tableWrapper).should('not.exist');
    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('contain', 'Try adding more information');
    cy.get(DOM_ELEMENTS.tableWrapper).should('not.exist');

    //(AC3b) Try adding more information link is clickable and functional
    // Test that the link is clickable (Full Test to be implemented when API complete)
    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('have.class', 'govuk-link');
    cy.get(DOM_ELEMENTS.addMoreInfoLink).click();
  });

  it('(AC4a-c) Displays results correctly for 100 or fewer matches', { tags: ['PO-707'] }, () => {
    setupComponent(SEARCH_RESULTS_WITH_DATA_MOCK);

    // Check table exists and headers match design
    cy.get(DOM_ELEMENTS.tableWrapper).should('exist');
    cy.get(DOM_ELEMENTS.accountHeader).should('contain', 'Account');
    cy.get(DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.refHeader).should('contain', 'Ref');
    cy.get(DOM_ELEMENTS.enfHeader).should('contain', 'ENF');
    cy.get(DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');

    // Check first row matches mock data
    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'ACME LTD');
    cy.get(DOM_ELEMENTS.addressCell).first().should('contain', '10 Downing Street');
    cy.get(DOM_ELEMENTS.balanceCell).first().should('contain', '£1,000.00');
  });

  it('(AC4d) Displays pagination correctly for companies', { tags: ['PO-707'] }, () => {
    setupComponent(PAGINATION_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.paginationElement).should('exist');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', '100 results');
    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.paginationPageNumber(2)).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '2');
  });

  it('(AC4e) Default sorting of results is correct', { tags: ['PO-707'] }, () => {
    setupComponent(SORTING_SEARCH_RESULTS_MOCK_COMPANIES);

    // Default sort = order in the mock
    cy.get(DOM_ELEMENTS.nameCell).eq(0).should('contain', 'ACME LTD');
    cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'ZENITH CORP');
    cy.get(DOM_ELEMENTS.nameCell).eq(2).should('contain', 'BETA LTD');
    cy.get(DOM_ELEMENTS.nameCell).eq(3).should('contain', 'OMEGA INC');
    cy.get(DOM_ELEMENTS.nameCell).eq(4).should('contain', 'DELTA PLC');

    cy.get(DOM_ELEMENTS.accountCell).eq(0).should('contain', '13006BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '13007BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(2).should('contain', '13008BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(3).should('contain', '13009BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(4).should('contain', '13010BU');

    cy.get(DOM_ELEMENTS.postcodeCell).eq(0).should('contain', 'SW1A 2AA');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'EC4Y 1AA');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(2).should('contain', 'NW1 6XE');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(3).should('contain', 'NE1 2DF');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(4).should('contain', 'L3 8GH');

    cy.get(DOM_ELEMENTS.balanceCell).eq(0).should('contain', '£1,000.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£1,200.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(2).should('contain', '£850.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(3).should('contain', '£675.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(4).should('contain', '£524.00');

    // Account column sorting
    cy.get(DOM_ELEMENTS.accountHeader).find('button').click(); // Ascending
    cy.get(DOM_ELEMENTS.accountCell).eq(0).should('contain', '13006BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(4).should('contain', '13010BU');

    cy.get(DOM_ELEMENTS.accountHeader).find('button').click(); // Descending
    cy.get(DOM_ELEMENTS.accountCell).eq(0).should('contain', '13010BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(4).should('contain', '13006BU');

    // Name column sorting
    cy.get(DOM_ELEMENTS.nameHeader).find('button').click(); // Ascending
    cy.get(DOM_ELEMENTS.nameCell).eq(0).should('contain', 'ACME LTD');
    cy.get(DOM_ELEMENTS.nameCell).eq(4).should('contain', 'ZENITH CORP');

    cy.get(DOM_ELEMENTS.nameHeader).find('button').click(); // Descending
    cy.get(DOM_ELEMENTS.nameCell).eq(0).should('contain', 'ZENITH CORP');
    cy.get(DOM_ELEMENTS.nameCell).eq(4).should('contain', 'ACME LTD');

    // Postcode column sorting
    cy.get(DOM_ELEMENTS.postcodeHeader).find('button').click(); // Ascending
    cy.get(DOM_ELEMENTS.postcodeCell).eq(0).should('contain', 'EC4Y 1AA');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(4).should('contain', 'SW1A 2AA');

    cy.get(DOM_ELEMENTS.postcodeHeader).find('button').click(); // Descending
    cy.get(DOM_ELEMENTS.postcodeCell).eq(0).should('contain', 'SW1A 2AA');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(4).should('contain', 'EC4Y 1AA');

    // Balance column sorting
    cy.get(DOM_ELEMENTS.balanceHeader).find('button').click(); // Ascending
    cy.get(DOM_ELEMENTS.balanceCell).eq(0).should('contain', '£524.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(4).should('contain', '£1,200.00');

    cy.get(DOM_ELEMENTS.balanceHeader).find('button').click(); // Descending
    cy.get(DOM_ELEMENTS.balanceCell).eq(0).should('contain', '£1,200.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(4).should('contain', '£524.00');
  });
});
