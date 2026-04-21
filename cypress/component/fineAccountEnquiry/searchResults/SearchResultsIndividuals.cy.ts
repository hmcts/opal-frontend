import { mount } from 'cypress/angular';
import { FinesSaResultsComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-results/fines-sa-results.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { AccountEnquiryResultsLocators as ResultsLocators } from '../../../shared/selectors/account-enquiry/account.enquiry.results.locators';
import {
  EMPTY_SEARCH_RESULTS_MOCK,
  SEARCH_RESULTS_WITH_DATA_MOCK,
  LARGE_SEARCH_RESULTS_MOCK,
  PAGINATION_SEARCH_RESULTS_MOCK,
} from './mocks/search_results_individuals_mock';
import { SORTING_SEARCH_RESULTS_MOCK } from './mocks/search_results_sorting_mock';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_individual_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const ResultsPageLocators = ResultsLocators.page;
const ResultsMessageLocators = ResultsLocators.messages;
const ResultsHeaderCellLocators = ResultsLocators.headerCells;
const ResultsHeaderButtonLocators = ResultsLocators.headers;
const ResultsCellLocators = ResultsLocators.cols;
const ResultsPaginationLocators = ResultsLocators.pagination;

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('FinesSaResultsComponent - Individuals', () => {
  const createSearchResultState = () => ({
    searchAccount: structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK),
    unsavedChanges: false,
    stateChanges: false,
  });
  let searchResultStateTemplate = createSearchResultState();
  let searchResultState = searchResultStateTemplate;

  beforeEach(() => {
    searchResultStateTemplate = createSearchResultState();
    searchResultState = searchResultStateTemplate;
  });

  const setupComponent = (mockSearchResults = EMPTY_SEARCH_RESULTS_MOCK) => {
    searchResultState = structuredClone(searchResultStateTemplate);

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

  it(
    'Search results component is created correctly',
    { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-KEY:POT-7055'] },
    () => {
      setupComponent();

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');
    },
  );

  it(
    '(AC2) Displays error message when no search matches are found (FinesSaResultsComponent - Individuals)',
    { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-KEY:POT-7056'] },
    () => {
      setupComponent(EMPTY_SEARCH_RESULTS_MOCK);

      cy.get(ResultsMessageLocators.heading).should('be.visible');
      cy.get(ResultsMessageLocators.heading).should('contain', 'There are no matching results');

      cy.get(ResultsMessageLocators.link).should('be.visible');
      cy.get(ResultsMessageLocators.link).should('contain', 'Check your search');
      //(AC2b) Check your search link is clickable and functional
      // Test that the link is clickable (Full Test to be implemented when API complete)
      cy.get(ResultsMessageLocators.link).should('have.class', 'govuk-link');
      cy.get(ResultsMessageLocators.link).click();
    },
  );

  it(
    '(AC3) Handles more than 100 search matches correctly (FinesSaResultsComponent - Individuals)',
    { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-KEY:POT-7057'] },
    () => {
      setupComponent(LARGE_SEARCH_RESULTS_MOCK);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');

      // Should show too many results message when more than 100 results
      cy.get(ResultsMessageLocators.heading).should('be.visible');
      cy.get(ResultsMessageLocators.heading).should('contain', 'There are more than 100 results');

      cy.get(ResultsMessageLocators.link).should('be.visible');
      cy.get(ResultsMessageLocators.link).should('contain', 'Try adding more information');

      cy.get(ResultsLocators.table.root).should('not.exist');

      //(AC3b) Try adding more information link is clickable and functional
      // Test that the link is clickable (Full Test to be implemented when API complete)
      cy.get(ResultsMessageLocators.link).should('have.class', 'govuk-link');
      cy.get(ResultsMessageLocators.link).click();
    },
  );

  it(
    '(AC4) Displays Search Results - Individuals screen with correct table structure and data formatting for 100 or less results',
    { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-KEY:POT-7058'] },
    () => {
      setupComponent(SEARCH_RESULTS_WITH_DATA_MOCK);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');

      cy.get(ResultsLocators.table.root).should('exist');

      // Verify all column headers are present (AC4 requirements)
      cy.get(ResultsHeaderCellLocators.account).should('contain', 'Account');
      cy.get(ResultsHeaderCellLocators.name).should('contain', 'Name');
      cy.get(ResultsHeaderCellLocators.aliases).should('contain', 'Aliases');
      cy.get(ResultsHeaderCellLocators.dob).should('contain', 'Date of birth');
      cy.get(ResultsHeaderCellLocators.addr1).should('contain', 'Address line 1');
      cy.get(ResultsHeaderCellLocators.postcode).should('contain', 'Postcode');
      cy.get(ResultsHeaderCellLocators.ni).should('contain', 'NI number');
      cy.get(ResultsHeaderCellLocators.pg).should('contain', 'Parent or guardian');
      cy.get(ResultsHeaderCellLocators.bu).should('contain', 'Business unit');
      cy.get(ResultsHeaderCellLocators.ref).should('contain', 'Ref');
      cy.get(ResultsHeaderCellLocators.enf).should('contain', 'ENF');
      cy.get(ResultsHeaderCellLocators.balance).should('contain', 'Balance');

      // Verify data is displayed correctly (AC4 field requirements)
      cy.get(ResultsCellLocators.accountCell).first().should('contain', '13001BU');
      cy.get(ResultsCellLocators.accountCell).first().find('a').should('exist');

      cy.get(ResultsCellLocators.name).first().should('contain', 'SMITH, John Michael');

      cy.get(ResultsCellLocators.aliases).first().should('contain', 'SMITH, John Michael');

      cy.get(ResultsCellLocators.dob).first().should('contain', '01 Jun 1985');

      cy.get(ResultsCellLocators.addr1).first().should('contain', '1 High Street');

      cy.get(ResultsCellLocators.postcode).first().should('contain', 'RG1 9RT');

      cy.get(ResultsCellLocators.ni).first().should('contain', 'JK 56 78 90 C');

      cy.get(ResultsCellLocators.parentGuard).first().should('contain', 'DOE, Jane');

      cy.get(ResultsCellLocators.businessUnit).first().should('contain', 'Test Business Unit');

      cy.get(ResultsCellLocators.ref).first().should('contain', 'PCR19274548');

      cy.get(ResultsCellLocators.enf).first().should('contain', 'BWTD');

      cy.get(ResultsCellLocators.balance).first().should('contain', '£714.00');

      cy.get(ResultsCellLocators.accountCell).eq(1).should('contain', '13002BU');
      cy.get(ResultsCellLocators.name).eq(1).should('contain', 'DOE, Jane');
      cy.get(ResultsCellLocators.dob).eq(1).should('contain', '15 Mar 1990');
      cy.get(ResultsCellLocators.enf).eq(1).should('contain', 'WARRANT');
      cy.get(ResultsCellLocators.balance).eq(1).should('contain', '£524.00');

      cy.get(ResultsCellLocators.aliases).eq(1).should('not.contain', 'SMITH');

      cy.get(ResultsCellLocators.parentGuard).eq(1).should('not.contain', 'DOE, Jane');
    },
  );

  it(
    '(AC4d) Displays pagination with 25 results per page and 4 pages for 100 results',
    { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-KEY:POT-7059'] },
    () => {
      setupComponent(PAGINATION_SEARCH_RESULTS_MOCK);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');

      cy.get(ResultsLocators.table.root).should('exist');

      cy.get(ResultsPaginationLocators.root).should('exist');

      // Verify pagination text shows correct total results
      cy.get(ResultsPaginationLocators.resultsText).should('contain', '100 total results');

      cy.get(ResultsPaginationLocators.currentPage).should('contain', '1');

      cy.get(ResultsPaginationLocators.list).within(() => {
        cy.get(ResultsPaginationLocators.listItem).should('have.length.at.least', 4);
        cy.contains('1').should('exist');
        cy.contains('2').should('exist');
        cy.get(ResultsPaginationLocators.listItemEllipses).should('exist');
        cy.contains('4').should('exist');
      });

      // Verify exactly 25 results are displayed
      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsCellLocators.accountCell).first().should('contain', '1300001BU');
      cy.get(ResultsCellLocators.name).first().should('contain', 'SMITH1, John');

      cy.get(ResultsCellLocators.accountCell).eq(24).should('contain', '1300025BU');
      cy.get(ResultsCellLocators.name).eq(24).should('contain', 'SMITH25, John');

      cy.get(ResultsPaginationLocators.pageNumber(2)).click();

      cy.get(ResultsPaginationLocators.currentPage).should('contain', '2');

      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsCellLocators.accountCell).first().should('contain', '1300026BU');
      cy.get(ResultsCellLocators.name).first().should('contain', 'SMITH26, Jane');

      cy.get(ResultsPaginationLocators.pageNumber(4)).click();

      cy.get(ResultsPaginationLocators.currentPage).should('contain', '4');

      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsCellLocators.accountCell).first().should('contain', '1300076BU');
      cy.get(ResultsCellLocators.name).first().should('contain', 'SMITH76, Jane');

      cy.get(ResultsCellLocators.accountCell).eq(24).should('contain', '1300100BU');
      cy.get(ResultsCellLocators.name).eq(24).should('contain', 'SMITH100, Jane');

      cy.get(ResultsPaginationLocators.previousButton).should('exist');
      // Should not exist on last page
      cy.get(ResultsPaginationLocators.nextButton).should('not.exist');

      // Navigate back to page 1 using Previous button
      cy.get(ResultsPaginationLocators.previousButton).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '3');

      // Navigate to page 2 using Next button
      cy.get(ResultsPaginationLocators.nextButton).should('exist');
      cy.get(ResultsPaginationLocators.nextButton).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '4');
    },
  );

  it(
    '(AC4f) Should sort by each column - ascending then descending',
    { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-KEY:POT-7060'] },
    () => {
      setupComponent(SORTING_SEARCH_RESULTS_MOCK);

      //Account column sorting
      cy.get(ResultsCellLocators.accountCell).first().should('contain', '13003BU');
      cy.get(ResultsCellLocators.accountCell).eq(1).should('contain', '13001BU');

      cy.get(ResultsHeaderButtonLocators.account).click();

      cy.get(ResultsCellLocators.accountCell).first().should('contain', '13001BU');
      cy.get(ResultsCellLocators.accountCell).eq(1).should('contain', '13002BU');
      cy.get(ResultsCellLocators.accountCell).eq(2).should('contain', '13003BU');
      cy.get(ResultsCellLocators.accountCell).eq(3).should('contain', '13004BU');
      cy.get(ResultsCellLocators.accountCell).eq(4).should('contain', '13005BU');

      cy.get(ResultsHeaderButtonLocators.account).click();

      cy.get(ResultsCellLocators.accountCell).first().should('contain', '13005BU');
      cy.get(ResultsCellLocators.accountCell).eq(1).should('contain', '13004BU');
      cy.get(ResultsCellLocators.accountCell).eq(2).should('contain', '13003BU');
      cy.get(ResultsCellLocators.accountCell).eq(3).should('contain', '13002BU');
      cy.get(ResultsCellLocators.accountCell).eq(4).should('contain', '13001BU');

      // Name column sorting
      cy.get(ResultsHeaderButtonLocators.name).click();

      cy.get(ResultsCellLocators.name).first().should('contain', 'ANDERSON, Lisa Marie');
      cy.get(ResultsCellLocators.name).eq(1).should('contain', 'BROWN, David Paul');
      cy.get(ResultsCellLocators.name).eq(2).should('contain', 'JOHNSON, Emily Rose');
      cy.get(ResultsCellLocators.name).eq(3).should('contain', 'SMITH, John Michael');
      cy.get(ResultsCellLocators.name).eq(4).should('contain', 'WILLIAMS, Sarah Jane');

      cy.get(ResultsHeaderButtonLocators.name).click();

      cy.get(ResultsCellLocators.name).first().should('contain', 'WILLIAMS, Sarah Jane');
      cy.get(ResultsCellLocators.name).eq(1).should('contain', 'SMITH, John Michael');
      cy.get(ResultsCellLocators.name).eq(2).should('contain', 'JOHNSON, Emily Rose');
      cy.get(ResultsCellLocators.name).eq(3).should('contain', 'BROWN, David Paul');
      cy.get(ResultsCellLocators.name).eq(4).should('contain', 'ANDERSON, Lisa Marie');

      // DOB column sorting
      cy.get(ResultsHeaderButtonLocators.dob).click();

      cy.get(ResultsCellLocators.dob).first().should('contain', '08 Nov 1975');
      cy.get(ResultsCellLocators.dob).eq(1).should('contain', '12 Sep 1982');
      cy.get(ResultsCellLocators.dob).eq(2).should('contain', '01 Jun 1985');
      cy.get(ResultsCellLocators.dob).eq(3).should('contain', '25 Dec 1988');
      cy.get(ResultsCellLocators.dob).eq(4).should('contain', '15 Mar 1990');

      cy.get(ResultsHeaderButtonLocators.dob).click();

      cy.get(ResultsCellLocators.dob).first().should('contain', '15 Mar 1990');
      cy.get(ResultsCellLocators.dob).eq(1).should('contain', '25 Dec 1988');
      cy.get(ResultsCellLocators.dob).eq(2).should('contain', '01 Jun 1985');
      cy.get(ResultsCellLocators.dob).eq(3).should('contain', '12 Sep 1982');
      cy.get(ResultsCellLocators.dob).eq(4).should('contain', '08 Nov 1975');

      // Address line 1 column sorting
      cy.get(ResultsHeaderButtonLocators.addr1).click();

      cy.get(ResultsCellLocators.addr1).first().should('contain', '1 High Street');
      cy.get(ResultsCellLocators.addr1).eq(1).should('contain', '15 Oak Street');
      cy.get(ResultsCellLocators.addr1).eq(2).should('contain', '22 Victoria Road');
      cy.get(ResultsCellLocators.addr1).eq(3).should('contain', '5 Church Lane');
      cy.get(ResultsCellLocators.addr1).eq(4).should('contain', '8 Park Avenue');

      cy.get(ResultsHeaderButtonLocators.addr1).click();

      cy.get(ResultsCellLocators.addr1).first().should('contain', '8 Park Avenue');
      cy.get(ResultsCellLocators.addr1).eq(1).should('contain', '5 Church Lane');
      cy.get(ResultsCellLocators.addr1).eq(2).should('contain', '22 Victoria Road');
      cy.get(ResultsCellLocators.addr1).eq(3).should('contain', '15 Oak Street');
      cy.get(ResultsCellLocators.addr1).eq(4).should('contain', '1 High Street');

      // Postcode column sorting
      cy.get(ResultsHeaderButtonLocators.postcode).click();

      cy.get(ResultsCellLocators.postcode).first().should('contain', 'B2 4TY');
      cy.get(ResultsCellLocators.postcode).eq(1).should('contain', 'L3 8GH');
      cy.get(ResultsCellLocators.postcode).eq(2).should('contain', 'M1 5AB');
      cy.get(ResultsCellLocators.postcode).eq(3).should('contain', 'NE1 2DF');
      cy.get(ResultsCellLocators.postcode).eq(4).should('contain', 'RG1 9RT');

      cy.get(ResultsHeaderButtonLocators.postcode).click();

      cy.get(ResultsCellLocators.postcode).first().should('contain', 'RG1 9RT');
      cy.get(ResultsCellLocators.postcode).eq(1).should('contain', 'NE1 2DF');
      cy.get(ResultsCellLocators.postcode).eq(2).should('contain', 'M1 5AB');
      cy.get(ResultsCellLocators.postcode).eq(3).should('contain', 'L3 8GH');
      cy.get(ResultsCellLocators.postcode).eq(4).should('contain', 'B2 4TY');

      // NI number column sorting
      cy.get(ResultsHeaderButtonLocators.ni).click();

      cy.get(ResultsCellLocators.ni).first().should('contain', 'AB 12 34 56 C');
      cy.get(ResultsCellLocators.ni).eq(1).should('contain', 'CD 78 90 12 E');
      cy.get(ResultsCellLocators.ni).eq(2).should('contain', 'EF 34 56 78 G');
      cy.get(ResultsCellLocators.ni).eq(3).should('contain', 'GH 90 12 34 H');
      cy.get(ResultsCellLocators.ni).eq(4).should('contain', 'JK 56 78 90 C');

      cy.get(ResultsHeaderButtonLocators.ni).click();

      cy.get(ResultsCellLocators.ni).first().should('contain', 'JK 56 78 90 C');
      cy.get(ResultsCellLocators.ni).eq(1).should('contain', 'GH 90 12 34 H');
      cy.get(ResultsCellLocators.ni).eq(2).should('contain', 'EF 34 56 78 G');
      cy.get(ResultsCellLocators.ni).eq(3).should('contain', 'CD 78 90 12 E');
      cy.get(ResultsCellLocators.ni).eq(4).should('contain', 'AB 12 34 56 C');

      // Parent or guardian column sorting
      cy.get(ResultsHeaderButtonLocators.pg).click();

      cy.get(ResultsCellLocators.parentGuard).first().should('contain', 'BROWN, Michael');
      cy.get(ResultsCellLocators.parentGuard).eq(1).should('contain', 'DOE, Jane');
      cy.get(ResultsCellLocators.parentGuard).eq(2).should('contain', 'TAYLOR, Susan');
      cy.get(ResultsCellLocators.parentGuard).eq(3).should('contain', '—');
      cy.get(ResultsCellLocators.parentGuard).eq(4).should('contain', '—');

      cy.get(ResultsHeaderButtonLocators.pg).click();

      cy.get(ResultsCellLocators.parentGuard).first().should('contain', 'TAYLOR, Susan');
      cy.get(ResultsCellLocators.parentGuard).eq(1).should('contain', 'DOE, Jane');
      cy.get(ResultsCellLocators.parentGuard).eq(2).should('contain', 'BROWN, Michael');
      cy.get(ResultsCellLocators.parentGuard).eq(3).should('contain', '—');
      cy.get(ResultsCellLocators.parentGuard).eq(4).should('contain', '—');

      // Business unit column sorting
      cy.get(ResultsHeaderButtonLocators.bu).click();

      cy.get(ResultsCellLocators.businessUnit).first().should('contain', 'Birmingham Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(1).should('contain', 'Liverpool Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(2).should('contain', 'Manchester Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(3).should('contain', 'Newcastle Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(4).should('contain', 'Reading Unit');

      cy.get(ResultsHeaderButtonLocators.bu).click();

      cy.get(ResultsCellLocators.businessUnit).first().should('contain', 'Reading Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(1).should('contain', 'Newcastle Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(2).should('contain', 'Manchester Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(3).should('contain', 'Liverpool Unit');
      cy.get(ResultsCellLocators.businessUnit).eq(4).should('contain', 'Birmingham Unit');

      // ref column sorting
      cy.get(ResultsHeaderButtonLocators.ref).click();

      cy.get(ResultsCellLocators.ref).first().should('contain', 'PCR19274548');
      cy.get(ResultsCellLocators.ref).eq(1).should('contain', 'PCR19274549');
      cy.get(ResultsCellLocators.ref).eq(2).should('contain', 'PCR19274550');
      cy.get(ResultsCellLocators.ref).eq(3).should('contain', 'PCR19274551');
      cy.get(ResultsCellLocators.ref).eq(4).should('contain', 'PCR19274552');

      cy.get(ResultsHeaderButtonLocators.ref).click();

      cy.get(ResultsCellLocators.ref).first().should('contain', 'PCR19274552');
      cy.get(ResultsCellLocators.ref).eq(1).should('contain', 'PCR19274551');
      cy.get(ResultsCellLocators.ref).eq(2).should('contain', 'PCR19274550');
      cy.get(ResultsCellLocators.ref).eq(3).should('contain', 'PCR19274549');
      cy.get(ResultsCellLocators.ref).eq(4).should('contain', 'PCR19274548');

      // ENF column sorting
      cy.get(ResultsHeaderButtonLocators.enf).click();

      cy.get(ResultsCellLocators.enf).first().should('contain', 'BWTD');
      cy.get(ResultsCellLocators.enf).eq(1).should('contain', 'BWTD');
      cy.get(ResultsCellLocators.enf).eq(2).should('contain', 'ENFORCEMENT');
      cy.get(ResultsCellLocators.enf).eq(3).should('contain', 'WARRANT');
      cy.get(ResultsCellLocators.enf).eq(4).should('contain', 'WARRANT');

      cy.get(ResultsHeaderButtonLocators.enf).click();

      cy.get(ResultsCellLocators.enf).first().should('contain', 'WARRANT');
      cy.get(ResultsCellLocators.enf).eq(1).should('contain', 'WARRANT');
      cy.get(ResultsCellLocators.enf).eq(2).should('contain', 'ENFORCEMENT');
      cy.get(ResultsCellLocators.enf).eq(3).should('contain', 'BWTD');
      cy.get(ResultsCellLocators.enf).eq(4).should('contain', 'BWTD');

      // Balance column sorting
      cy.get(ResultsHeaderButtonLocators.balance).click();

      cy.get(ResultsCellLocators.balance).first().should('contain', '£524.00');
      cy.get(ResultsCellLocators.balance).eq(1).should('contain', '£675.00');
      cy.get(ResultsCellLocators.balance).eq(2).should('contain', '£714.00');
      cy.get(ResultsCellLocators.balance).eq(3).should('contain', '£850.00');
      cy.get(ResultsCellLocators.balance).eq(4).should('contain', '£1,200.00');

      cy.get(ResultsHeaderButtonLocators.balance).click();

      cy.get(ResultsCellLocators.balance).first().should('contain', '£1,200.00');
      cy.get(ResultsCellLocators.balance).eq(1).should('contain', '£850.00');
      cy.get(ResultsCellLocators.balance).eq(2).should('contain', '£714.00');
      cy.get(ResultsCellLocators.balance).eq(3).should('contain', '£675.00');
      cy.get(ResultsCellLocators.balance).eq(4).should('contain', '£524.00');
    },
  );
});
