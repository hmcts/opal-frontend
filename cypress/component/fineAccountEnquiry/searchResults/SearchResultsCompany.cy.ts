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
} from './mocks/search_results_companies_mock';
import { SORTING_SEARCH_RESULTS_MOCK_COMPANIES } from './mocks/search_results_sorting_companies_mock';
import { COMPANY_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_company_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const ResultsPageLocators = ResultsLocators.page;
const ResultsMessageLocators = ResultsLocators.messages;
const ResultsHeaderCellLocators = ResultsLocators.headerCells;
const ResultsHeaderButtonLocators = ResultsLocators.headers;
const ResultsCellLocators = ResultsLocators.cols;
const ResultsPaginationLocators = ResultsLocators.pagination;

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('FinesSaResultsComponent - Companies', () => {
  const createSearchResultState = () => ({
    searchAccount: structuredClone(COMPANY_SEARCH_STATE_MOCK),
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

  it('Search company results component is created correctly', { tags: [...buildTags('@JIRA-STORY:PO-707'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4546'] }, () => {
      setupComponent();

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');
    });

  it('(AC2) Displays error message when no search matches are found', { tags: [...buildTags('@JIRA-STORY:PO-707'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4547'] }, () => {
      setupComponent(EMPTY_SEARCH_RESULTS_MOCK);

      cy.get(ResultsMessageLocators.heading).should('contain', 'There are no matching results');

      //(AC2b) Check your search link is clickable and functional
      // Test that the link is clickable (Full Test to be implemented when API complete)
      cy.get(ResultsMessageLocators.link).should('have.class', 'govuk-link');
      cy.get(ResultsMessageLocators.link).should('be.visible').click();
      cy.get(ResultsMessageLocators.link).should('contain', 'Check your search');
    });

  it('(AC3) Handles more than 100 search matches correctly', { tags: [...buildTags('@JIRA-STORY:PO-717'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4548'] }, () => {
      setupComponent(LARGE_SEARCH_RESULTS_MOCK);

      cy.get(ResultsMessageLocators.heading).should('contain', 'There are more than 100 results');
      cy.get(ResultsLocators.table.root).should('not.exist');
      cy.get(ResultsMessageLocators.link).should('contain', 'Try adding more information');
      cy.get(ResultsLocators.table.root).should('not.exist');

      //(AC3b) Try adding more information link is clickable and functional
      // Test that the link is clickable (Full Test to be implemented when API complete)
      cy.get(ResultsMessageLocators.link).should('have.class', 'govuk-link');
      cy.get(ResultsMessageLocators.link).click();
    });

  it('(AC4a-c) Displays results correctly for 100 or fewer matches', { tags: [...buildTags('@JIRA-STORY:PO-707'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4549'] }, () => {
      setupComponent(SEARCH_RESULTS_WITH_DATA_MOCK);

      // Check table exists and headers match design
      cy.get(ResultsLocators.table.root).should('exist');
      cy.get(ResultsHeaderCellLocators.account).should('contain', 'Account');
      cy.get(ResultsHeaderCellLocators.addr1).should('contain', 'Address line 1');
      cy.get(ResultsHeaderCellLocators.postcode).should('contain', 'Postcode');
      cy.get(ResultsHeaderCellLocators.bu).should('contain', 'Business unit');
      cy.get(ResultsHeaderCellLocators.ref).should('contain', 'Ref');
      cy.get(ResultsHeaderCellLocators.enf).should('contain', 'ENF');
      cy.get(ResultsHeaderCellLocators.balance).should('contain', 'Balance');

      // Check first row matches mock data
      cy.get(ResultsCellLocators.name).first().should('contain', 'ACME LTD');
      cy.get(ResultsCellLocators.addr1).first().should('contain', '10 Downing Street');
      cy.get(ResultsCellLocators.balance).first().should('contain', '£1,000.00');
    });

  it('(AC4d) Displays pagination correctly for companies', { tags: [...buildTags('@JIRA-STORY:PO-707'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4550'] }, () => {
      setupComponent(PAGINATION_SEARCH_RESULTS_MOCK);

      cy.get(ResultsPaginationLocators.root).should('exist');
      cy.get(ResultsPaginationLocators.resultsText).should('contain', '100 total results');
      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsPaginationLocators.pageNumber(2)).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '2');
    });

  it('(AC4e) Default sorting of results is correct', { tags: [...buildTags('@JIRA-STORY:PO-707'), '@JIRA-EPIC:PO-704', '@JIRA-TEST-KEY:PO-4551'] }, () => {
      setupComponent(SORTING_SEARCH_RESULTS_MOCK_COMPANIES);

      // Default sort = order in the mock
      cy.get(ResultsCellLocators.name).eq(0).should('contain', 'ACME LTD');
      cy.get(ResultsCellLocators.name).eq(1).should('contain', 'ZENITH CORP');
      cy.get(ResultsCellLocators.name).eq(2).should('contain', 'BETA LTD');
      cy.get(ResultsCellLocators.name).eq(3).should('contain', 'OMEGA INC');
      cy.get(ResultsCellLocators.name).eq(4).should('contain', 'DELTA PLC');

      cy.get(ResultsCellLocators.accountCell).eq(0).should('contain', '13006BU');
      cy.get(ResultsCellLocators.accountCell).eq(1).should('contain', '13007BU');
      cy.get(ResultsCellLocators.accountCell).eq(2).should('contain', '13008BU');
      cy.get(ResultsCellLocators.accountCell).eq(3).should('contain', '13009BU');
      cy.get(ResultsCellLocators.accountCell).eq(4).should('contain', '13010BU');

      cy.get(ResultsCellLocators.postcode).eq(0).should('contain', 'SW1A 2AA');
      cy.get(ResultsCellLocators.postcode).eq(1).should('contain', 'EC4Y 1AA');
      cy.get(ResultsCellLocators.postcode).eq(2).should('contain', 'NW1 6XE');
      cy.get(ResultsCellLocators.postcode).eq(3).should('contain', 'NE1 2DF');
      cy.get(ResultsCellLocators.postcode).eq(4).should('contain', 'L3 8GH');

      cy.get(ResultsCellLocators.balance).eq(0).should('contain', '£1,000.00');
      cy.get(ResultsCellLocators.balance).eq(1).should('contain', '£1,200.00');
      cy.get(ResultsCellLocators.balance).eq(2).should('contain', '£850.00');
      cy.get(ResultsCellLocators.balance).eq(3).should('contain', '£675.00');
      cy.get(ResultsCellLocators.balance).eq(4).should('contain', '£524.00');

      // Account column sorting
      cy.get(ResultsHeaderButtonLocators.account).click(); // Ascending
      cy.get(ResultsCellLocators.accountCell).eq(0).should('contain', '13006BU');
      cy.get(ResultsCellLocators.accountCell).eq(4).should('contain', '13010BU');

      cy.get(ResultsHeaderButtonLocators.account).click(); // Descending
      cy.get(ResultsCellLocators.accountCell).eq(0).should('contain', '13010BU');
      cy.get(ResultsCellLocators.accountCell).eq(4).should('contain', '13006BU');

      // Name column sorting
      cy.get(ResultsHeaderButtonLocators.name).click(); // Ascending
      cy.get(ResultsCellLocators.name).eq(0).should('contain', 'ACME LTD');
      cy.get(ResultsCellLocators.name).eq(4).should('contain', 'ZENITH CORP');

      cy.get(ResultsHeaderButtonLocators.name).click(); // Descending
      cy.get(ResultsCellLocators.name).eq(0).should('contain', 'ZENITH CORP');
      cy.get(ResultsCellLocators.name).eq(4).should('contain', 'ACME LTD');

      // Postcode column sorting
      cy.get(ResultsHeaderButtonLocators.postcode).click(); // Ascending
      cy.get(ResultsCellLocators.postcode).eq(0).should('contain', 'EC4Y 1AA');
      cy.get(ResultsCellLocators.postcode).eq(4).should('contain', 'SW1A 2AA');

      cy.get(ResultsHeaderButtonLocators.postcode).click(); // Descending
      cy.get(ResultsCellLocators.postcode).eq(0).should('contain', 'SW1A 2AA');
      cy.get(ResultsCellLocators.postcode).eq(4).should('contain', 'EC4Y 1AA');

      // Balance column sorting
      cy.get(ResultsHeaderButtonLocators.balance).click(); // Ascending
      cy.get(ResultsCellLocators.balance).eq(0).should('contain', '£524.00');
      cy.get(ResultsCellLocators.balance).eq(4).should('contain', '£1,200.00');

      cy.get(ResultsHeaderButtonLocators.balance).click(); // Descending
      cy.get(ResultsCellLocators.balance).eq(0).should('contain', '£1,200.00');
      cy.get(ResultsCellLocators.balance).eq(4).should('contain', '£524.00');
    });
});
