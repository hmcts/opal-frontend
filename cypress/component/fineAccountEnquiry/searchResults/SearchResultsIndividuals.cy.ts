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
} from './mocks/search_results_individuals_mock';
import { SORTING_SEARCH_RESULTS_MOCK } from './mocks/search_results_sorting_mock';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_individual_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';

describe('FinesSaResultsComponent - Individuals', () => {
  let searchResultState = {
    searchAccount: INDIVIDUAL_SEARCH_STATE_MOCK,
    unsavedChanges: false,
    stateChanges: false,
  };

  afterEach(() => {
    searchResultState = {
      searchAccount: INDIVIDUAL_SEARCH_STATE_MOCK,
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
            fragment: of('individuals'),
            snapshot: {
              url: [{ path: 'search-results' }],
              data: {
                individualAccounts: mockSearchResults,
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

  it('Search results component is created correctly', { tags: ['PO-717'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');
  });

  it('(AC2) Displays error message when no search matches are found', { tags: ['PO-717'] }, () => {
    setupComponent(EMPTY_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.noResultsHeading).should('be.visible');
    cy.get(DOM_ELEMENTS.noResultsHeading).should('contain', 'There are no matching results');

    cy.get(DOM_ELEMENTS.checkSearchLink).should('be.visible');
    cy.get(DOM_ELEMENTS.checkSearchLink).should('contain', 'Check your search');
  });

  it('(AC3) Handles more than 100 search matches correctly', { tags: ['PO-717'] }, () => {
    setupComponent(LARGE_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    // Should show too many results message when more than 100 results
    cy.get(DOM_ELEMENTS.tooManyResultsHeading).should('be.visible');
    cy.get(DOM_ELEMENTS.tooManyResultsHeading).should('contain', 'There are more than 100 results');

    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('be.visible');
    cy.get(DOM_ELEMENTS.addMoreInfoLink).should('contain', 'Try adding more information');

    cy.get(DOM_ELEMENTS.tableWrapper).should('not.exist');
  });

  it(
    '(AC4) Displays Search Results - Individuals screen with correct table structure and data formatting for 100 or less results',
    { tags: ['PO-717'] },
    () => {
      setupComponent(SEARCH_RESULTS_WITH_DATA_MOCK);

      cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
      cy.get(DOM_ELEMENTS.backLink).should('exist');

      cy.get(DOM_ELEMENTS.tableWrapper).should('exist');

      // Verify all column headers are present (AC4 requirements)
      cy.get(DOM_ELEMENTS.accountHeader).should('contain', 'Account');
      cy.get(DOM_ELEMENTS.nameHeader).should('contain', 'Name');
      cy.get(DOM_ELEMENTS.aliasesHeader).should('contain', 'Aliases');
      cy.get(DOM_ELEMENTS.dobHeader).should('contain', 'Date of birth');
      cy.get(DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
      cy.get(DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
      cy.get(DOM_ELEMENTS.niNumberHeader).should('contain', 'NI number');
      cy.get(DOM_ELEMENTS.parentGuardianHeader).should('contain', 'Parent or guardian');
      cy.get(DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
      cy.get(DOM_ELEMENTS.refHeader).should('contain', 'Ref');
      cy.get(DOM_ELEMENTS.enfHeader).should('contain', 'ENF');
      cy.get(DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');

      // Verify data is displayed correctly (AC4 field requirements)
      cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '13001BU');
      cy.get(DOM_ELEMENTS.accountCell).first().find('a').should('exist');

      cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'SMITH, John Michael');

      cy.get(DOM_ELEMENTS.aliasesCell).first().should('contain', 'SMITH, John Michael');

      cy.get(DOM_ELEMENTS.dobCell).first().should('contain', '01 Jun 1985');

      cy.get(DOM_ELEMENTS.addressCell).first().should('contain', '1 High Street');

      cy.get(DOM_ELEMENTS.postcodeCell).first().should('contain', 'RG1 9RT');

      cy.get(DOM_ELEMENTS.niNumberCell).first().should('contain', 'JK 56 78 90 C');

      cy.get(DOM_ELEMENTS.parentGuardianCell).first().should('contain', 'DOE, Jane');

      cy.get(DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Test Business Unit');

      cy.get(DOM_ELEMENTS.refCell).first().should('contain', 'PCR19274548');

      cy.get(DOM_ELEMENTS.enfCell).first().should('contain', 'BWTD');

      cy.get(DOM_ELEMENTS.balanceCell).first().should('contain', '£714.00');

      cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '13002BU');
      cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'DOE, Jane');
      cy.get(DOM_ELEMENTS.dobCell).eq(1).should('contain', '15 Mar 1990');
      cy.get(DOM_ELEMENTS.enfCell).eq(1).should('contain', 'WARRANT');
      cy.get(DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£524.00');

      cy.get(DOM_ELEMENTS.aliasesCell).eq(1).should('not.contain', 'SMITH');

      cy.get(DOM_ELEMENTS.parentGuardianCell).eq(1).should('not.contain', 'DOE, Jane');
    },
  );

  it('(AC4d) Displays pagination with 25 results per page and 4 pages for 100 results', { tags: ['PO-717'] }, () => {
    setupComponent(PAGINATION_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(DOM_ELEMENTS.backLink).should('exist');

    cy.get(DOM_ELEMENTS.tableWrapper).should('exist');

    cy.get(DOM_ELEMENTS.paginationElement).should('exist');

    // Verify pagination text shows correct total results
    cy.get(DOM_ELEMENTS.paginationText).should('contain', '100 results');

    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '1');

    cy.get(DOM_ELEMENTS.paginationList).within(() => {
      cy.get(DOM_ELEMENTS.paginationListItem).should('have.length.at.least', 4);
      cy.contains('1').should('exist');
      cy.contains('2').should('exist');
      cy.contains('…').should('exist');
      cy.contains('4').should('exist');
    });

    // Verify exactly 25 results are displayed
    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '1300001BU');
    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'SMITH1, John');

    cy.get(DOM_ELEMENTS.accountCell).eq(24).should('contain', '1300025BU');
    cy.get(DOM_ELEMENTS.nameCell).eq(24).should('contain', 'SMITH25, John');

    cy.get(DOM_ELEMENTS.paginationPageNumber(2)).click();

    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '2');

    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '1300026BU');
    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'SMITH26, Jane');

    cy.get(DOM_ELEMENTS.paginationPageNumber(4)).click();

    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '4');

    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '1300076BU');
    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'SMITH76, Jane');

    cy.get(DOM_ELEMENTS.accountCell).eq(24).should('contain', '1300100BU');
    cy.get(DOM_ELEMENTS.nameCell).eq(24).should('contain', 'SMITH100, Jane');

    cy.get(DOM_ELEMENTS.previousPageButton).should('exist');
    // Should not exist on last page
    cy.get(DOM_ELEMENTS.nextPageButton).should('not.exist');

    // Navigate back to page 1 using Previous button
    cy.get(DOM_ELEMENTS.previousPageButton).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '3');

    // Navigate to page 2 using Next button
    cy.get(DOM_ELEMENTS.nextPageButton).should('exist');
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '4');
  });

  it('(AC4f) Should sort by each column - ascending then descending', { tags: ['PO-717'] }, () => {
    setupComponent(SORTING_SEARCH_RESULTS_MOCK);

    //Account column sorting
    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '13003BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '13001BU');

    cy.get(DOM_ELEMENTS.accountHeader).click();

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '13001BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '13002BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(2).should('contain', '13003BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(3).should('contain', '13004BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(4).should('contain', '13005BU');

    cy.get(DOM_ELEMENTS.accountHeader).click();

    cy.get(DOM_ELEMENTS.accountCell).first().should('contain', '13005BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(1).should('contain', '13004BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(2).should('contain', '13003BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(3).should('contain', '13002BU');
    cy.get(DOM_ELEMENTS.accountCell).eq(4).should('contain', '13001BU');

    // Name column sorting
    cy.get(DOM_ELEMENTS.nameHeader).find('button').click();

    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'ANDERSON, Lisa Marie');
    cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'BROWN, David Paul');
    cy.get(DOM_ELEMENTS.nameCell).eq(2).should('contain', 'JOHNSON, Emily Rose');
    cy.get(DOM_ELEMENTS.nameCell).eq(3).should('contain', 'SMITH, John Michael');
    cy.get(DOM_ELEMENTS.nameCell).eq(4).should('contain', 'WILLIAMS, Sarah Jane');

    cy.get(DOM_ELEMENTS.nameHeader).find('button').click();

    cy.get(DOM_ELEMENTS.nameCell).first().should('contain', 'WILLIAMS, Sarah Jane');
    cy.get(DOM_ELEMENTS.nameCell).eq(1).should('contain', 'SMITH, John Michael');
    cy.get(DOM_ELEMENTS.nameCell).eq(2).should('contain', 'JOHNSON, Emily Rose');
    cy.get(DOM_ELEMENTS.nameCell).eq(3).should('contain', 'BROWN, David Paul');
    cy.get(DOM_ELEMENTS.nameCell).eq(4).should('contain', 'ANDERSON, Lisa Marie');

    // DOB column sorting
    cy.get(DOM_ELEMENTS.dobHeader).click();

    cy.get(DOM_ELEMENTS.dobCell).first().should('contain', '08 Nov 1975');
    cy.get(DOM_ELEMENTS.dobCell).eq(1).should('contain', '12 Sep 1982');
    cy.get(DOM_ELEMENTS.dobCell).eq(2).should('contain', '01 Jun 1985');
    cy.get(DOM_ELEMENTS.dobCell).eq(3).should('contain', '25 Dec 1988');
    cy.get(DOM_ELEMENTS.dobCell).eq(4).should('contain', '15 Mar 1990');

    cy.get(DOM_ELEMENTS.dobHeader).click();

    cy.get(DOM_ELEMENTS.dobCell).first().should('contain', '15 Mar 1990');
    cy.get(DOM_ELEMENTS.dobCell).eq(1).should('contain', '25 Dec 1988');
    cy.get(DOM_ELEMENTS.dobCell).eq(2).should('contain', '01 Jun 1985');
    cy.get(DOM_ELEMENTS.dobCell).eq(3).should('contain', '12 Sep 1982');
    cy.get(DOM_ELEMENTS.dobCell).eq(4).should('contain', '08 Nov 1975');

    // Address line 1 column sorting
    cy.get(DOM_ELEMENTS.addressHeader).click();

    cy.get(DOM_ELEMENTS.addressCell).first().should('contain', '1 High Street');
    cy.get(DOM_ELEMENTS.addressCell).eq(1).should('contain', '15 Oak Street');
    cy.get(DOM_ELEMENTS.addressCell).eq(2).should('contain', '22 Victoria Road');
    cy.get(DOM_ELEMENTS.addressCell).eq(3).should('contain', '5 Church Lane');
    cy.get(DOM_ELEMENTS.addressCell).eq(4).should('contain', '8 Park Avenue');

    cy.get(DOM_ELEMENTS.addressHeader).click();

    cy.get(DOM_ELEMENTS.addressCell).first().should('contain', '8 Park Avenue');
    cy.get(DOM_ELEMENTS.addressCell).eq(1).should('contain', '5 Church Lane');
    cy.get(DOM_ELEMENTS.addressCell).eq(2).should('contain', '22 Victoria Road');
    cy.get(DOM_ELEMENTS.addressCell).eq(3).should('contain', '15 Oak Street');
    cy.get(DOM_ELEMENTS.addressCell).eq(4).should('contain', '1 High Street');

    // Postcode column sorting
    cy.get(DOM_ELEMENTS.postcodeHeader).click();

    cy.get(DOM_ELEMENTS.postcodeCell).first().should('contain', 'B2 4TY');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'L3 8GH');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(2).should('contain', 'M1 5AB');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(3).should('contain', 'NE1 2DF');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(4).should('contain', 'RG1 9RT');

    cy.get(DOM_ELEMENTS.postcodeHeader).click();

    cy.get(DOM_ELEMENTS.postcodeCell).first().should('contain', 'RG1 9RT');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'NE1 2DF');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(2).should('contain', 'M1 5AB');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(3).should('contain', 'L3 8GH');
    cy.get(DOM_ELEMENTS.postcodeCell).eq(4).should('contain', 'B2 4TY');

    // NI number column sorting
    cy.get(DOM_ELEMENTS.niNumberHeader).click();

    cy.get(DOM_ELEMENTS.niNumberCell).first().should('contain', 'AB 12 34 56 C');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(1).should('contain', 'CD 78 90 12 E');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(2).should('contain', 'EF 34 56 78 G');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(3).should('contain', 'GH 90 12 34 H');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(4).should('contain', 'JK 56 78 90 C');

    cy.get(DOM_ELEMENTS.niNumberHeader).click();

    cy.get(DOM_ELEMENTS.niNumberCell).first().should('contain', 'JK 56 78 90 C');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(1).should('contain', 'GH 90 12 34 H');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(2).should('contain', 'EF 34 56 78 G');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(3).should('contain', 'CD 78 90 12 E');
    cy.get(DOM_ELEMENTS.niNumberCell).eq(4).should('contain', 'AB 12 34 56 C');

    // Parent or guardian column sorting
    cy.get(DOM_ELEMENTS.parentGuardianHeader).click();

    cy.get(DOM_ELEMENTS.parentGuardianCell).first().should('contain', 'BROWN, Michael');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(1).should('contain', 'DOE, Jane');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(2).should('contain', 'TAYLOR, Susan');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(3).should('contain', 'null, null');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(4).should('contain', 'null, null');

    cy.get(DOM_ELEMENTS.parentGuardianHeader).click();

    cy.get(DOM_ELEMENTS.parentGuardianCell).first().should('contain', 'null, null');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(1).should('contain', 'null, null');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(2).should('contain', 'TAYLOR, Susan');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(3).should('contain', 'DOE, Jane');
    cy.get(DOM_ELEMENTS.parentGuardianCell).eq(4).should('contain', 'BROWN, Michael');

    // Business unit column sorting
    cy.get(DOM_ELEMENTS.businessUnitHeader).click();

    cy.get(DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Birmingham Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(1).should('contain', 'Liverpool Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(2).should('contain', 'Manchester Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(3).should('contain', 'Newcastle Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(4).should('contain', 'Reading Unit');

    cy.get(DOM_ELEMENTS.businessUnitHeader).click();

    cy.get(DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Reading Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(1).should('contain', 'Newcastle Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(2).should('contain', 'Manchester Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(3).should('contain', 'Liverpool Unit');
    cy.get(DOM_ELEMENTS.businessUnitCell).eq(4).should('contain', 'Birmingham Unit');

    // ref column sorting
    cy.get(DOM_ELEMENTS.refHeader).find('button').click();

    cy.get(DOM_ELEMENTS.refCell).first().should('contain', 'PCR19274548');
    cy.get(DOM_ELEMENTS.refCell).eq(1).should('contain', 'PCR19274549');
    cy.get(DOM_ELEMENTS.refCell).eq(2).should('contain', 'PCR19274550');
    cy.get(DOM_ELEMENTS.refCell).eq(3).should('contain', 'PCR19274551');
    cy.get(DOM_ELEMENTS.refCell).eq(4).should('contain', 'PCR19274552');

    cy.get(DOM_ELEMENTS.refHeader).find('button').click();

    cy.get(DOM_ELEMENTS.refCell).first().should('contain', 'PCR19274552');
    cy.get(DOM_ELEMENTS.refCell).eq(1).should('contain', 'PCR19274551');
    cy.get(DOM_ELEMENTS.refCell).eq(2).should('contain', 'PCR19274550');
    cy.get(DOM_ELEMENTS.refCell).eq(3).should('contain', 'PCR19274549');
    cy.get(DOM_ELEMENTS.refCell).eq(4).should('contain', 'PCR19274548');

    // ENF column sorting
    cy.get(DOM_ELEMENTS.enfHeader).find('button').click();

    cy.get(DOM_ELEMENTS.enfCell).first().should('contain', 'BWTD');
    cy.get(DOM_ELEMENTS.enfCell).eq(1).should('contain', 'BWTD');
    cy.get(DOM_ELEMENTS.enfCell).eq(2).should('contain', 'ENFORCEMENT');
    cy.get(DOM_ELEMENTS.enfCell).eq(3).should('contain', 'WARRANT');
    cy.get(DOM_ELEMENTS.enfCell).eq(4).should('contain', 'WARRANT');

    cy.get(DOM_ELEMENTS.enfHeader).find('button').click();

    cy.get(DOM_ELEMENTS.enfCell).first().should('contain', 'WARRANT');
    cy.get(DOM_ELEMENTS.enfCell).eq(1).should('contain', 'WARRANT');
    cy.get(DOM_ELEMENTS.enfCell).eq(2).should('contain', 'ENFORCEMENT');
    cy.get(DOM_ELEMENTS.enfCell).eq(3).should('contain', 'BWTD');
    cy.get(DOM_ELEMENTS.enfCell).eq(4).should('contain', 'BWTD');

    // Balance column sorting
    cy.get(DOM_ELEMENTS.balanceHeader).click();

    cy.get(DOM_ELEMENTS.balanceCell).first().should('contain', '£524.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£675.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(2).should('contain', '£714.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(3).should('contain', '£850.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(4).should('contain', '£1,200.00');

    cy.get(DOM_ELEMENTS.balanceHeader).click();

    cy.get(DOM_ELEMENTS.balanceCell).first().should('contain', '£1,200.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£850.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(2).should('contain', '£714.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(3).should('contain', '£675.00');
    cy.get(DOM_ELEMENTS.balanceCell).eq(4).should('contain', '£524.00');
  });
});
