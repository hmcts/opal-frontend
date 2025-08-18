import { mount } from 'cypress/angular';
import { FinesSaResultsComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-results/fines-sa-results.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_results_minor_creditors_elements';
import {
  EMPTY_SEARCH_RESULTS_MOCK,
  INDIVIDUAL_SEARCH_RESULTS_MOCK,
  COMPANY_SEARCH_RESULTS_MOCK,
  LARGE_SEARCH_RESULTS_MOCK,
  ORDERING_TEST_MOCK,
} from './mocks/search_results_minor_creditors_mock';
import { MINOR_CREDITORS_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_minor_creditors_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';

describe('FinesSaResultsComponent - Minor Creditors', () => {
  let searchResultState = {
    searchAccount: MINOR_CREDITORS_SEARCH_STATE_MOCK,
    unsavedChanges: false,
    stateChanges: false,
  };

  afterEach(() => {
    searchResultState = {
      searchAccount: MINOR_CREDITORS_SEARCH_STATE_MOCK,
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
            fragment: of('minor-creditors'),
            snapshot: {
              url: [{ path: 'search-results' }],
              data: {
                minorCreditorAccounts: mockSearchResults,
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

  it('Search results component is created correctly for minor creditors', { tags: ['PO-708'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
  });

  it('(AC2) Displays error message when no minor creditor search matches are found', { tags: ['PO-708'] }, () => {
    setupComponent(EMPTY_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.noResultsHeading).should('be.visible');
    cy.get(DOM_ELEMENTS.noResultsHeading).should('contain', 'There are no matching results');

    cy.get(DOM_ELEMENTS.checkSearchLink).should('be.visible');
    cy.get(DOM_ELEMENTS.checkSearchLink).should('contain', 'Check your search');

    //(AC2b) Check your search link is clickable and functional
    // Test that the link is clickable (Full Test to be implemented when API complete)
    cy.get(DOM_ELEMENTS.checkSearchLink).should('have.class', 'govuk-link');
    cy.get(DOM_ELEMENTS.checkSearchLink).click();
  });

  it('(AC3) Handles more than 100 minor creditor search matches correctly', { tags: ['PO-708'] }, () => {
    setupComponent(LARGE_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    // Should show too many results message when more than 100 results
    cy.get(DOM_ELEMENTS.tooManyResultsHeading).should('be.visible');
    cy.get(DOM_ELEMENTS.tooManyResultsHeading).should('contain', 'There are more than 100 results');

    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('be.visible');
    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('contain', 'Try adding more information');

    cy.get(DOM_ELEMENTS.tableWrapper).should('not.exist');

    //(AC3b) Try adding more information link is clickable and functional
    // Test that the link is clickable (Full Test to be implemented when API complete)
    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('have.class', 'govuk-link');
    cy.get(DOM_ELEMENTS.addMoreInfoLink).click();
  });

  it('(AC4) Displays Search Results - Individual Minor Creditors with correct table structure and data formatting', { tags: ['PO-708'] }, () => {
    setupComponent(INDIVIDUAL_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    cy.get(DOM_ELEMENTS.tableWrapper).should('exist');

    cy.get(DOM_ELEMENTS.accountHeader).should('contain', 'Account');
    cy.get(DOM_ELEMENTS.accountHeader).find('button').click();
    cy.get(DOM_ELEMENTS.nameHeader).should('contain', 'Name');
    cy.get(DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.defendantHeader).should('contain', 'Defendant');
    cy.get(DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '14001MC');

    cy.get(DOM_ELEMENTS.accountCell).first().find('a').should('exist');

    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'THOMPSON, Emma Claire');

    cy.get(DOM_ELEMENTS.addressCell).first().should('contain', '5 Minor Court');

    cy.get(DOM_ELEMENTS.postcodeCell).first().should('contain', 'MC1 2RT');

    cy.get(DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Minor Creditors Unit');

    cy.get(DOM_ELEMENTS.defendantCell).first().should('contain', 'THOMPSON, Emma Claire');

    cy.get(DOM_ELEMENTS.defendantCell).first().find('a').should('exist');

    cy.get(DOM_ELEMENTS.balanceCell).first().should('contain', '£345.00');

    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '14002MC');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).find('a').should('exist');
    cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'WILSON, James Robert');
    cy.get(DOM_ELEMENTS.addressCell).eq(1).should('contain', '8 Elm Street');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'MC3 5RT');
    cy.get(DOM_ELEMENTS.defendantCell).eq(1).should('contain', 'WILSON, James Robert');
    cy.get(DOM_ELEMENTS.defendantCell).eq(1).find('a').should('exist');
    cy.get(DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£567.00');
  });

  it('(AC4) Displays Search Results - Company Minor Creditors with correct table structure and data formatting', { tags: ['PO-708'] }, () => {
    setupComponent(COMPANY_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    cy.get(DOM_ELEMENTS.tableWrapper).should('exist');

    cy.get(DOM_ELEMENTS.accountHeader).should('contain', 'Account');
    cy.get(DOM_ELEMENTS.accountHeader).find('button').click();
    cy.get(DOM_ELEMENTS.nameHeader).should('contain', 'Name');
    cy.get(DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
    cy.get(DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
    cy.get(DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
    cy.get(DOM_ELEMENTS.defendantHeader).should('contain', 'Defendant');
    cy.get(DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '14003MC');
    cy.get(DOM_ELEMENTS.accountCell).first().find('a').should('exist');

    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'Young Entrepreneurs Ltd');

    cy.get(DOM_ELEMENTS.addressCell).first().should('contain', '12 Business Park');

    cy.get(DOM_ELEMENTS.postcodeCell).first().should('contain', 'MC2 4RT');

    cy.get(DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Minor Creditors Unit');


    cy.get(DOM_ELEMENTS.defendantCell).first().should('contain', 'Young Entrepreneurs Ltd');
    cy.get(DOM_ELEMENTS.defendantCell).first().find('a').should('exist');

    cy.get(DOM_ELEMENTS.balanceCell).first().should('contain', '£890.00');

    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '14004MC');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).find('a').should('exist');
    cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'Tech Solutions Inc');
    cy.get(DOM_ELEMENTS.addressCell).eq(1).should('contain', '45 Industrial Estate');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'MC4 7RT');
    cy.get(DOM_ELEMENTS.defendantCell).eq(1).should('contain', 'Tech Solutions Inc');
    cy.get(DOM_ELEMENTS.defendantCell).eq(1).find('a').should('exist');
    cy.get(DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£1,250.00');
  });

  it('(AC4d) Displays pagination with 25 results per page for maximum of 100 results', { tags: ['PO-708'] }, () => {
    // Using LARGE_SEARCH_RESULTS_MOCK but limiting to 100 results for pagination testing
    const paginationMock = {
      count: 100,
      creditor_accounts: LARGE_SEARCH_RESULTS_MOCK.creditor_accounts.slice(0, 100),
    };
    
    setupComponent(paginationMock);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.paginationElement).should('exist');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', '100 results');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '1');

    // Verify pagination shows 4 pages total 
    cy.get(DOM_ELEMENTS.paginationList).within(() => {
      cy.get(DOM_ELEMENTS.paginationListItem).should('have.length.at.least', 4);
      cy.contains('1').should('exist');
      cy.contains('2').should('exist');
      cy.contains('…').should('exist');
      cy.contains('4').should('exist');
    });

    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.paginationPageNumber(2)).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '2');
    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.paginationPageNumber(4)).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '4');
    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.previousPageButton).should('exist');
    cy.get(DOM_ELEMENTS.nextPageButton).should('not.exist');

    cy.get(DOM_ELEMENTS.previousPageButton).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '3');
    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.nextPageButton).should('exist');
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '4');
  });

  it.only('(AC4e) Results are ordered by name (ascending), then postcode (ascending), then account number (ascending)', { tags: ['PO-708'] }, () => {
    setupComponent(ORDERING_TEST_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
    cy.get(DOM_ELEMENTS.tableWrapper).should('exist');

    // Verify the ordering is correct as per AC4e requirements:
    // 1. Name (ascending) - ADAMS entries should come before BROWN, which should come before CARTER
    // 2. Within same name, postcode (ascending) - AB1 1AA before AB2 2BB
    // 3. Within same name and postcode, account number (ascending) - 14001MC before 14002MC

    cy.get(DOM_ELEMENTS.nameCell).eq(0).should('contain', 'ADAMS, Mary');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(0).should('contain', 'AB1 1AA');
    cy.get(DOM_ELEMENTS.accountCell).eq(0).should('contain', '14001MC');

    cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'ADAMS, John');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'AB1 1AA');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '14002MC');

    cy.get(DOM_ELEMENTS.nameCell).eq(2).should('contain', 'ADAMS, Sarah');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(2).should('contain', 'AB2 2BB');
    cy.get(DOM_ELEMENTS.accountCell).eq(2).should('contain', '14003MC');

    cy.get(DOM_ELEMENTS.nameCell).eq(3).should('contain', 'BROWN, Emma');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(3).should('contain', 'BR1 1CC');
    cy.get(DOM_ELEMENTS.accountCell).eq(3).should('contain', '14004MC');

    cy.get(DOM_ELEMENTS.nameCell).eq(4).should('contain', 'BROWN, David');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(4).should('contain', 'BR1 1CC');
    cy.get(DOM_ELEMENTS.accountCell).eq(4).should('contain', '14005MC');

    cy.get(DOM_ELEMENTS.nameCell).eq(5).should('contain', 'CARTER, Frank');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(5).should('contain', 'CT1 1DD');
    cy.get(DOM_ELEMENTS.accountCell).eq(5).should('contain', '14006MC');
  });
});
