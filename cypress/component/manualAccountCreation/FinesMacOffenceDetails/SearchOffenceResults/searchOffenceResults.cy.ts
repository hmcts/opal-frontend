import { mount } from 'cypress/angular';
import { ActivatedRoute } from '@angular/router';
import { DOM_ELEMENTS } from './constants/search_offence_results_elements_mock';
import { provideHttpClient } from '@angular/common/http';
import { NO_SEARCH_RESULTS_MOCK, TEST_CASES_MOCK, FULL_SEARCH_RESULTS_MOCK } from './mocks/offence_search_results_mock';
import { FinesMacOffenceDetailsSearchOffencesStore } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/stores/fines-mac-offence-details-search-offences.store';
import { FinesMacOffenceDetailsSearchOffencesResultsComponent } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences-results/fines-mac-offence-details-search-offences-results.component';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/constants/fines-mac-offence-details-search-offences-form.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

describe('FinesMacOffenceDetailsSearchOffencesResultsComponent', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      const originalClipboard = win.navigator.clipboard;

      const clipboardWriteTextStub = cy.stub().as('clipboardWriteText').resolves();

      Object.defineProperty(win.navigator, 'clipboard', {
        value: {
          ...originalClipboard,
          writeText: clipboardWriteTextStub,
        },
        configurable: true,
      });
    });
  });

  let searchResultState = {
    searchOffences: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM,
    unsavedChanges: false,
    stateChanges: false,
  };

  afterEach(() => {
    searchResultState = {
      searchOffences: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_FORM,
      unsavedChanges: false,
      stateChanges: false,
    };
  });

  const setupComponent = (mockSearchResults = TEST_CASES_MOCK) => {
    mount(FinesMacOffenceDetailsSearchOffencesResultsComponent, {
      providers: [
        provideHttpClient(),
        OpalFines,
        {
          provide: FinesMacOffenceDetailsSearchOffencesStore,
          useFactory: () => {
            const store = new FinesMacOffenceDetailsSearchOffencesStore();
            store.setSearchOffences(searchResultState.searchOffences);
            store.setUnsavedChanges(searchResultState.unsavedChanges);
            store.setStateChanges(searchResultState.stateChanges);
            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'manual-account-creation' }],
              data: {
                searchResults: mockSearchResults,
              },
            },
          },
        },
      ],
    });
  };

  it('Search offences results component is created correctly', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.heading).should('contain', 'Search results');

    cy.get(DOM_ELEMENTS.codeHeader).should('exist');
    cy.get(DOM_ELEMENTS.shortTitleHeader).should('exist');
    cy.get(DOM_ELEMENTS.actAndSectionHeader).should('exist');
    cy.get(DOM_ELEMENTS.usedFromHeader).should('exist');
    cy.get(DOM_ELEMENTS.usedToHeader).should('exist');

    cy.get(DOM_ELEMENTS.codeCell).should('exist');
    cy.get(DOM_ELEMENTS.shortTitleCell).should('exist');
    cy.get(DOM_ELEMENTS.actAndSectionCell).should('exist');
    cy.get(DOM_ELEMENTS.usedFromCell).should('exist');
    cy.get(DOM_ELEMENTS.usedToCell).should('exist');
  });

  it('Displays error message when no search matches are found (AC3, AC3a)', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent(NO_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.noResultsMessage).should('be.visible');
    cy.get(DOM_ELEMENTS.noResultsMessage).should('contain', 'There are no matching results.');

    cy.get(DOM_ELEMENTS.noResultsFollowupMessage).should('be.visible');
    cy.get(DOM_ELEMENTS.noResultsFollowupMessage).should('contain', 'Check your search and try again.');
  });

  it('Displays search results with correct column headers (AC4)', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.codeHeader).should('contain', 'Code');
    cy.get(DOM_ELEMENTS.shortTitleHeader).should('contain', 'Short title');
    cy.get(DOM_ELEMENTS.actAndSectionHeader).should('contain', 'Act and section');
    cy.get(DOM_ELEMENTS.usedFromHeader).should('contain', 'Used from');
    cy.get(DOM_ELEMENTS.usedToHeader).should('contain', 'Used to');
  });

  it('Displays "Copy Code" link between Code and Short Title columns (AC5)', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.copyCodeLink).first().should('exist');
    cy.get(DOM_ELEMENTS.copyCodeLink).first().should('contain', 'Copy code');

    cy.get(DOM_ELEMENTS.copyCodeLink).first().click();

    cy.get('@clipboardWriteText').should('have.been.called');

    cy.get(DOM_ELEMENTS.copyCodeLink).first().should('contain', 'Code copied');
  });

  it('Correctly handles pagination with 25 results per page (AC6b)', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent(FULL_SEARCH_RESULTS_MOCK);

    cy.get(DOM_ELEMENTS.table).should('have.length', 25);

    cy.get(DOM_ELEMENTS.paginationElement).should('exist');

    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');
  });

  it('Handles pagination buttons correctly (AC6a), (AC6b, AC6c)', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent(FULL_SEARCH_RESULTS_MOCK);

    //Handling Next and Previous buttons
    cy.get(DOM_ELEMENTS.previousPageButton).should('not.exist');

    cy.get(DOM_ELEMENTS.nextPageButton).should('exist').click();

    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '2');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');

    cy.get(DOM_ELEMENTS.previousPageButton).should('exist');
    cy.get(DOM_ELEMENTS.nextPageButton).should('exist').click();

    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '3');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 51 - 75 of 100 offences');

    cy.get(DOM_ELEMENTS.nextPageButton).should('exist').click();

    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '4');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 76 - 100 of 100 offences');

    cy.get(DOM_ELEMENTS.nextPageButton).should('not.exist');

    //Handle page number buttons
    cy.get(DOM_ELEMENTS.paginationList).should('exist');
    cy.get(DOM_ELEMENTS.paginationListItem).should('have.length', 4);
    cy.get(DOM_ELEMENTS.paginationPage1).should('exist').click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '1');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');
    cy.get(DOM_ELEMENTS.paginationPage2).should('exist').click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '2');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');
    cy.get(DOM_ELEMENTS.paginationPage3).should('exist').click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '3');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 51 - 75 of 100 offences');
    cy.get(DOM_ELEMENTS.paginationPage4).should('exist').click();
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('exist');
    cy.get(DOM_ELEMENTS.paginationCurrentPage).should('contain', '4');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 76 - 100 of 100 offences');
  });

  it('Handles column sorting and resets to page 1 for all columns (AC6a)', { tags: ['@PO-545', '@PO-987'] }, () => {
    setupComponent(FULL_SEARCH_RESULTS_MOCK);

    // Navigate to page 2 to verify sorting resets pagination
    cy.get(DOM_ELEMENTS.paginationElement).contains('1');
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');

    // Test Code column sorting
    cy.get(DOM_ELEMENTS.codeCell).eq(0).should('contain', 'CJS075');
    cy.get(DOM_ELEMENTS.codeCell).eq(1).should('contain', 'CJS074');

    cy.get(DOM_ELEMENTS.codeHeader).should('exist');
    cy.get(DOM_ELEMENTS.codeHeader).click();

    cy.get(DOM_ELEMENTS.codeCell).eq(0).should('contain', 'CJS001');
    cy.get(DOM_ELEMENTS.codeCell).eq(1).should('contain', 'CJS002');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');

    // Test Short Title column sorting
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');

    cy.get(DOM_ELEMENTS.shortTitleHeader).should('exist');
    cy.get(DOM_ELEMENTS.shortTitleHeader).click();

    cy.get(DOM_ELEMENTS.shortTitleCell).eq(0).should('contain', 'Offence Title 1');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');

    // Test Act and Section column sorting
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');

    cy.get(DOM_ELEMENTS.actAndSectionHeader).should('exist');
    cy.get(DOM_ELEMENTS.actAndSectionHeader).click();

    cy.get(DOM_ELEMENTS.actAndSectionCell).eq(0).should('contain', 'Section 1.1');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');

    // Test Used From column sorting
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');

    cy.get(DOM_ELEMENTS.usedFromHeader).should('exist');
    cy.get(DOM_ELEMENTS.usedFromHeader).click();

    cy.get(DOM_ELEMENTS.usedFromCell).eq(0).should('contain', '01 Jan 2024');
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');

    // Test Used To column sorting
    cy.get(DOM_ELEMENTS.nextPageButton).click();
    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 26 - 50 of 100 offences');

    cy.get(DOM_ELEMENTS.usedToHeader).should('exist');
    cy.get(DOM_ELEMENTS.usedToHeader).click();

    cy.get(DOM_ELEMENTS.paginationText).should('contain', 'Showing 1 - 25 of 100 offences');
    cy.get(DOM_ELEMENTS.usedToCell).eq(0).should('contain', '31 Dec 2025');
  });
});
