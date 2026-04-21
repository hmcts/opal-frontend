import { mount } from 'cypress/angular';
import { FinesSaResultsComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-results/fines-sa-results.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { AccountEnquiryResultsLocators as ResultsLocators } from '../../../shared/selectors/account-enquiry/account.enquiry.results.locators';
import {
  EMPTY_SEARCH_RESULTS_MOCK,
  INDIVIDUAL_SEARCH_RESULTS_MOCK,
  COMPANY_SEARCH_RESULTS_MOCK,
  LARGE_SEARCH_RESULTS_MOCK,
  SORTING_MINOR_CREDITORS_MOCK,
} from './mocks/search_results_minor_creditors_mock';
import { MINOR_CREDITORS_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_minor_creditors_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const ResultsPageLocators = ResultsLocators.page;
const ResultsMessageLocators = ResultsLocators.messages;
const ResultsHeaderLocators = ResultsLocators.headerCells;
const ResultsCellLocators = ResultsLocators.cols;
const ResultsPaginationLocators = ResultsLocators.pagination;

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('FinesSaResultsComponent - Minor Creditors', () => {
  const createSearchResultState = () => ({
    searchAccount: structuredClone(MINOR_CREDITORS_SEARCH_STATE_MOCK),
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

  it(
    'Search results component is created correctly for minor creditors',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7061'] },
    () => {
      setupComponent();

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');
    },
  );

  it(
    '(AC2) Displays error message when no minor creditor search matches are found',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7062'] },
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
    '(AC3) Handles more than 100 minor creditor search matches correctly',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7063'] },
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
    '(AC4) Displays Search Results - Individual Minor Creditors with correct table structure and data formatting',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7064'] },
    () => {
      setupComponent(INDIVIDUAL_SEARCH_RESULTS_MOCK);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');

      cy.get(ResultsLocators.table.root).should('exist');

      cy.get(ResultsHeaderLocators.account).should('contain', 'Account');
      cy.get(ResultsHeaderLocators.account).find('button').click();
      cy.get(ResultsHeaderLocators.name).should('contain', 'Name');
      cy.get(ResultsHeaderLocators.addr1).should('contain', 'Address line 1');
      cy.get(ResultsHeaderLocators.postcode).should('contain', 'Postcode');
      cy.get(ResultsHeaderLocators.bu).should('contain', 'Business unit');
      cy.get(ResultsHeaderLocators.defendant).should('contain', 'Defendant');
      cy.get(ResultsHeaderLocators.balance).should('contain', 'Balance');

      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().should('contain', '14001MC');

      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().find('a').should('exist');

      cy.get(ResultsCellLocators.minorCreditorName).first().should('contain', 'THOMPSON, Emma Claire');

      cy.get(ResultsCellLocators.minorCreditorAddr1).first().should('contain', '5 Minor Court');

      cy.get(ResultsCellLocators.minorCreditorPostcode).first().should('contain', 'MC1 2RT');

      cy.get(ResultsCellLocators.minorCreditorBusinessUnit).first().should('contain', 'Minor Creditors Unit');

      cy.get(ResultsCellLocators.minorCreditorDefendant).first().should('contain', 'THOMPSON, Emma Claire');

      cy.get(ResultsCellLocators.minorCreditorDefendant).first().find('a').should('exist');

      cy.get(ResultsCellLocators.minorCreditorBalance).first().should('contain', '£345.00');

      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(1).should('contain', '14002MC');
      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(1).find('a').should('exist');
      cy.get(ResultsCellLocators.minorCreditorName).eq(1).should('contain', 'WILSON, James Robert');
      cy.get(ResultsCellLocators.minorCreditorAddr1).eq(1).should('contain', '8 Elm Street');
      cy.get(ResultsCellLocators.minorCreditorPostcode).eq(1).should('contain', 'MC3 5RT');
      cy.get(ResultsCellLocators.minorCreditorDefendant).eq(1).should('contain', 'WILSON, James Robert');
      cy.get(ResultsCellLocators.minorCreditorDefendant).eq(1).find('a').should('exist');
      cy.get(ResultsCellLocators.minorCreditorBalance).eq(1).should('contain', '£567.00');
    },
  );

  it(
    '(AC4) Displays Search Results - Company Minor Creditors with correct table structure and data formatting',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7065'] },
    () => {
      setupComponent(COMPANY_SEARCH_RESULTS_MOCK);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');

      cy.get(ResultsLocators.table.root).should('exist');

      cy.get(ResultsHeaderLocators.account).should('contain', 'Account');
      cy.get(ResultsHeaderLocators.account).find('button').click();
      cy.get(ResultsHeaderLocators.name).should('contain', 'Name');
      cy.get(ResultsHeaderLocators.addr1).should('contain', 'Address line 1');
      cy.get(ResultsHeaderLocators.postcode).should('contain', 'Postcode');
      cy.get(ResultsHeaderLocators.bu).should('contain', 'Business unit');
      cy.get(ResultsHeaderLocators.defendant).should('contain', 'Defendant');
      cy.get(ResultsHeaderLocators.balance).should('contain', 'Balance');

      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().should('contain', '14003MC');
      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().find('a').should('exist');

      cy.get(ResultsCellLocators.minorCreditorName).first().should('contain', 'Young Entrepreneurs Ltd');

      cy.get(ResultsCellLocators.minorCreditorAddr1).first().should('contain', '12 Business Park');

      cy.get(ResultsCellLocators.minorCreditorPostcode).first().should('contain', 'MC2 4RT');

      cy.get(ResultsCellLocators.minorCreditorBusinessUnit).first().should('contain', 'Minor Creditors Unit');

      cy.get(ResultsCellLocators.minorCreditorDefendant).first().should('contain', 'Young Entrepreneurs Ltd');
      cy.get(ResultsCellLocators.minorCreditorDefendant).first().find('a').should('exist');

      cy.get(ResultsCellLocators.minorCreditorBalance).first().should('contain', '£890.00');

      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(1).should('contain', '14004MC');
      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(1).find('a').should('exist');
      cy.get(ResultsCellLocators.minorCreditorName).eq(1).should('contain', 'Tech Solutions Inc');
      cy.get(ResultsCellLocators.minorCreditorAddr1).eq(1).should('contain', '45 Industrial Estate');
      cy.get(ResultsCellLocators.minorCreditorPostcode).eq(1).should('contain', 'MC4 7RT');
      cy.get(ResultsCellLocators.minorCreditorDefendant).eq(1).should('contain', 'Tech Solutions Inc');
      cy.get(ResultsCellLocators.minorCreditorDefendant).eq(1).find('a').should('exist');
      cy.get(ResultsCellLocators.minorCreditorBalance).eq(1).should('contain', '£1,250.00');
    },
  );

  it(
    '(AC4d) Displays pagination with 25 results per page for maximum of 100 results',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7066'] },
    () => {
      // Using LARGE_SEARCH_RESULTS_MOCK but limiting to 100 results for pagination testing
      const paginationMock = {
        count: 100,
        creditor_accounts: LARGE_SEARCH_RESULTS_MOCK.creditor_accounts.slice(0, 100),
      };

      setupComponent(paginationMock);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPaginationLocators.root).should('exist');
      cy.get(ResultsPaginationLocators.resultsText).should('contain', '100 total results');
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '1');

      // Verify pagination shows 4 pages total
      cy.get(ResultsPaginationLocators.list).within(() => {
        cy.get(ResultsPaginationLocators.listItem).should('have.length.at.least', 4);
        cy.contains('1').should('exist');
        cy.contains('2').should('exist');
        cy.get(ResultsPaginationLocators.listItemEllipses).should('exist');
        cy.contains('4').should('exist');
      });

      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsPaginationLocators.pageNumber(2)).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '2');
      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsPaginationLocators.pageNumber(4)).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '4');
      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsPaginationLocators.previousButton).should('exist');
      cy.get(ResultsPaginationLocators.nextButton).should('not.exist');

      cy.get(ResultsPaginationLocators.previousButton).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '3');
      cy.get(ResultsLocators.table.rows).should('have.length', 25);

      cy.get(ResultsPaginationLocators.nextButton).should('exist');
      cy.get(ResultsPaginationLocators.nextButton).click();
      cy.get(ResultsPaginationLocators.currentPage).should('contain', '4');
    },
  );

  it(
    '(AC4f) Should sort by each column - ascending then descending (FinesSaResultsComponent - Minor Creditors)',
    { tags: [...buildTags('@JIRA-STORY:PO-708'), '@JIRA-KEY:POT-7067'] },
    () => {
      setupComponent(SORTING_MINOR_CREDITORS_MOCK);

      cy.get(ResultsPageLocators.heading).should('contain', 'Search results');
      cy.get(ResultsPageLocators.backLinkHost).should('exist');
      cy.get(ResultsLocators.table.root).should('exist');

      // Initially account number in descending order
      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().should('contain', '14005MC');
      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(4).should('contain', '14001MC');

      // Test Account column sorting - sort ascending
      cy.get(ResultsHeaderLocators.account).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().should('contain', '14001MC');
      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(4).should('contain', '14005MC');

      // sort descending
      cy.get(ResultsHeaderLocators.account).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorAccountCell).first().should('contain', '14005MC');
      cy.get(ResultsCellLocators.minorCreditorAccountCell).eq(4).should('contain', '14001MC');

      // Test Name column sorting - sort ascending
      cy.get(ResultsHeaderLocators.name).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorName).first().should('contain', 'ANDERSON, Lisa');
      cy.get(ResultsCellLocators.minorCreditorName).eq(4).should('contain', 'WILLIAMS, Sarah');

      // sort descending
      cy.get(ResultsHeaderLocators.name).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorName).first().should('contain', 'WILLIAMS, Sarah');
      cy.get(ResultsCellLocators.minorCreditorName).eq(4).should('contain', 'ANDERSON, Lisa');

      // Test Address column sorting - sort ascending
      cy.get(ResultsHeaderLocators.addr1).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorAddr1).first().should('contain', '1 High Street');
      cy.get(ResultsCellLocators.minorCreditorAddr1).eq(4).should('contain', '8 Park Avenue');

      // sort descending
      cy.get(ResultsHeaderLocators.addr1).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorAddr1).first().should('contain', '8 Park Avenue');
      cy.get(ResultsCellLocators.minorCreditorAddr1).eq(4).should('contain', '1 High Street');

      // Test Postcode column sorting - sort ascending
      cy.get(ResultsHeaderLocators.postcode).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorPostcode).first().should('contain', 'B2 4TY');
      cy.get(ResultsCellLocators.minorCreditorPostcode).eq(4).should('contain', 'RG1 9RT');

      // sort descending
      cy.get(ResultsHeaderLocators.postcode).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorPostcode).first().should('contain', 'RG1 9RT');
      cy.get(ResultsCellLocators.minorCreditorPostcode).eq(4).should('contain', 'B2 4TY');

      // Test Balance column sorting - sort ascending
      cy.get(ResultsHeaderLocators.balance).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorBalance).first().should('contain', '£310.00');
      cy.get(ResultsCellLocators.minorCreditorBalance).eq(4).should('contain', '£890.00');

      // sort descending
      cy.get(ResultsHeaderLocators.balance).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorBalance).first().should('contain', '£890.00');
      cy.get(ResultsCellLocators.minorCreditorBalance).eq(4).should('contain', '£310.00');

      // Test Business unit column sorting - sort ascending
      cy.get(ResultsHeaderLocators.bu).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorBusinessUnit).first().should('contain', 'Central Unit');
      cy.get(ResultsCellLocators.minorCreditorBusinessUnit).eq(4).should('contain', 'West Unit');

      // sort descending
      cy.get(ResultsHeaderLocators.bu).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorBusinessUnit).first().should('contain', 'West Unit');
      cy.get(ResultsCellLocators.minorCreditorBusinessUnit).eq(4).should('contain', 'Central Unit');

      // Test Defendant column sorting - sort ascending
      cy.get(ResultsHeaderLocators.defendant).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorDefendant).first().should('contain', 'ANDERSON, Lisa');
      cy.get(ResultsCellLocators.minorCreditorDefendant).eq(4).should('contain', 'WILLIAMS, Sarah');

      // sort descending
      cy.get(ResultsHeaderLocators.defendant).find('button').click();
      cy.get(ResultsCellLocators.minorCreditorDefendant).first().should('contain', 'WILLIAMS, Sarah');
      cy.get(ResultsCellLocators.minorCreditorDefendant).eq(4).should('contain', 'ANDERSON, Lisa');
    },
  );
});
