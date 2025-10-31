import { mount } from 'cypress/angular';
import { FinesSaResultsComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-results/fines-sa-results.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS as INDIVIDUAL_DOM_ELEMENTS } from './constants/search_results_individuals_elements';
import { DOM_ELEMENTS as MINOR_CREDITOR_DOM_ELEMENTS } from './constants/search_results_minor_creditors_elements';
import { UNIFIED_SEARCH_RESULTS_MOCK, getAllAccountTypes } from './mocks/search_results_account_mock';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_individual_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { BehaviorSubject } from 'rxjs';

describe('FinesSaResultsComponent - All Account Types', () => {
  let fragmentSubject: BehaviorSubject<string>;

  let searchResultState = {
    searchAccount: INDIVIDUAL_SEARCH_STATE_MOCK,
    unsavedChanges: false,
    stateChanges: false,
  };

  afterEach(() => {
    fragmentSubject?.complete();
    searchResultState = {
      searchAccount: INDIVIDUAL_SEARCH_STATE_MOCK,
      unsavedChanges: false,
      stateChanges: false,
    };
  });

  const setupComponent = (
    scenario: keyof typeof UNIFIED_SEARCH_RESULTS_MOCK = 'WITH_DATA',
    initialFragment: string = 'individuals',
  ) => {
    const allMockData = getAllAccountTypes(scenario);

    // Create BehaviorSubject for reactive fragment changes (signals-compatible)
    fragmentSubject = new BehaviorSubject(initialFragment);

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
            fragment: fragmentSubject.asObservable(),
            snapshot: {
              url: [{ path: 'search-results' }],
              data: {
                individualAccounts: allMockData.individuals,
                companyAccounts: allMockData.companies,
                minorCreditorAccounts: allMockData.minorCreditors,
              },
              fragment: initialFragment,
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
    // Return fragmentSubject for reactive tab switching
    return { fragmentSubject };
  };

  // Helper function for tab switching
  const switchToTab = (tabFragment: string, tabSelector: string) => {
    fragmentSubject.next(tabFragment);
    cy.get(tabSelector).click();
  };

  // Helper function to verify tab is active
  const verifyTabIsActive = (tabSelector: string) => {
    cy.get(tabSelector).should('have.class', 'govuk-tabs__list-item govuk-tabs__list-item--selected');
  };

  it('(AC1d) Search results component is created correctly', { tags: ['PO-706'] }, () => {
    setupComponent('WITH_DATA');

    cy.get(INDIVIDUAL_DOM_ELEMENTS.heading).should('contain', 'Search results');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.backLink).should('exist');
  });

  it('(AC3a) Displays error message when no search matches are found', { tags: ['PO-706'] }, () => {
    setupComponent('EMPTY_RESULTS');

    // AC3a: Verify the error screen is displayed when no search matches are found
    cy.get(INDIVIDUAL_DOM_ELEMENTS.noResultsHeading).should('be.visible');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.noResultsHeading).should('contain', 'There are no matching results');

    cy.get(INDIVIDUAL_DOM_ELEMENTS.checkSearchLink).should('be.visible');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.checkSearchLink).should('contain', 'Check your search');
    // AC3b: Verify 'Check your search' link is clickable and functional
    cy.get(INDIVIDUAL_DOM_ELEMENTS.checkSearchLink).click();
  });

  //Note: AC3b The 'Check your search' link will navigate a user back to the Search for an Account screen - Full Test to be implemented when API complete

  it(
    '(AC4a) Displays "There are more than 100 results" message when more than 100 matches found',
    { tags: ['PO-706'] },
    () => {
      setupComponent('LARGE_RESULTS');

      // AC4a: Verify the "too many results" error screen is displayed
      cy.get(INDIVIDUAL_DOM_ELEMENTS.tooManyResultsHeading).should('be.visible');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.tooManyResultsHeading).should('contain', 'There are more than 100 results');

      // Note: AC4b The 'Try adding more information' link will navigate a user back to the Search for an Account screen - Full Test to be implemented when API complete
      // AC4b: Verify 'Try adding more information' link is present
      cy.get(INDIVIDUAL_DOM_ELEMENTS.addMoreInfoLink)
        .should('be.visible')
        .should('contain', 'Try adding more information');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.addMoreInfoLink).should('have.class', 'govuk-link');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.addMoreInfoLink).click();
    },
  );

  it(
    '(AC5 ,5b,5f) Displays tabs when matches across multiple debtor/creditor types and Individual tab is in focus by default',
    { tags: ['PO-706'] },
    () => {
      setupComponent('WITH_DATA', 'individuals');

      // AC5b-Verify Individuals tab is in focus by default
      verifyTabIsActive(INDIVIDUAL_DOM_ELEMENTS.individualsTab);

      // Verify all column headers are present
      cy.get(INDIVIDUAL_DOM_ELEMENTS.accountHeader).should('contain', 'Account');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.nameHeader).should('contain', 'Name');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.aliasesHeader).should('contain', 'Aliases');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.dobHeader).should('contain', 'Date of birth');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.niNumberHeader).should('contain', 'NI number');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.parentGuardianHeader).should('contain', 'Parent or guardian');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.refHeader).should('contain', 'Ref');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.enfHeader).should('contain', 'ENF');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');

      cy.get(INDIVIDUAL_DOM_ELEMENTS.accountCell).first().should('contain', '13001BU');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.accountCell).first().find('a').should('exist');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.nameCell).first().should('contain', 'SMITH, John Michael');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.aliasesCell).first().should('contain', 'SMITH, John Michael');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.dobCell).first().should('contain', '01 Jun 1985');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.addressCell).first().should('contain', '1 High Street');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.postcodeCell).first().should('contain', 'RG1 9RT');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.niNumberCell).first().should('contain', 'JK 56 78 90 C');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.parentGuardianCell).first().should('contain', 'DOE, Jane');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Test Business Unit');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.refCell).first().should('contain', 'PCR19274548');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.enfCell).first().should('contain', 'BWTD');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.balanceCell).first().should('contain', '£714.00');

      cy.get(INDIVIDUAL_DOM_ELEMENTS.accountCell).eq(1).should('contain', '13002BU');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.nameCell).eq(1).should('contain', 'DOE, Jane');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.dobCell).eq(1).should('contain', '15 Mar 1990');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.enfCell).eq(1).should('contain', 'WARRANT');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£524.00');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.aliasesCell).eq(1).should('not.contain', 'SMITH');
      cy.get(INDIVIDUAL_DOM_ELEMENTS.parentGuardianCell).eq(1).should('not.contain', 'DOE, Jane');
    },
  );

  it('(AC5c) Companies tab displays company defendant account summary data', { tags: ['PO-706'] }, () => {
    setupComponent('WITH_DATA', 'companies');

    switchToTab('companies', INDIVIDUAL_DOM_ELEMENTS.companiesTab);
    verifyTabIsActive(INDIVIDUAL_DOM_ELEMENTS.companiesTab);

    // Verify table exists and headers match design
    cy.get(INDIVIDUAL_DOM_ELEMENTS.tableWrapper).should('exist');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.accountHeader).should('contain', 'Account');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.refHeader).should('contain', 'Ref');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.enfHeader).should('contain', 'ENF');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');

    // Verify first row matches mock data
    cy.get(INDIVIDUAL_DOM_ELEMENTS.nameCell).first().should('contain', 'ACME LTD');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.addressCell).first().should('contain', '10 Downing Street');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.balanceCell).first().should('contain', '£1,000.00');
  });
  it('(AC5d) Minor Creditors tab displays creditor account summary data', { tags: ['PO-706'] }, () => {
    setupComponent('WITH_DATA', 'individuals');
    // Switch to minor creditors tab using helper function
    switchToTab('minorCreditors', INDIVIDUAL_DOM_ELEMENTS.minorCreditorsTab);
    verifyTabIsActive(INDIVIDUAL_DOM_ELEMENTS.minorCreditorsTab);
    // Verify table headers for minor creditors
    cy.get(INDIVIDUAL_DOM_ELEMENTS.accountHeader).should('contain', 'Account');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.nameHeader).should('contain', 'Name');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.addressHeader).should('contain', 'Address line 1');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.postcodeHeader).should('contain', 'Postcode');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.businessUnitHeader).should('contain', 'Business unit');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.defendantHeader).should('contain', 'Defendant');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.balanceHeader).should('contain', 'Balance');
    // Verify first row data matches mock
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.accountCell).first().should('contain', '14002MC');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.accountCell).first().find('a').should('exist');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.nameCell).first().should('contain', 'WILSON, James Robert');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.addressCell).first().should('contain', '8 Elm Street');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.postcodeCell).first().should('contain', 'MC3 5RT');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.businessUnitCell).first().should('contain', 'Minor Creditors Unit');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.defendantCell).first().should('contain', 'WILSON, James Robert');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.defendantCell).first().find('a').should('exist');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.balanceCell).first().should('contain', '£567.00');

    // Verify second row data
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.accountCell).eq(1).should('contain', '14001MC');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.accountCell).eq(1).find('a').should('exist');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.nameCell).eq(1).should('contain', ' THOMPSON, Emma Claire ');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.addressCell).eq(1).should('contain', '5 Minor Court');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.postcodeCell).eq(1).should('contain', 'MC1 2RT');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.defendantCell).eq(1).should('contain', 'THOMPSON, Emma Claire');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.defendantCell).eq(1).find('a').should('exist');
    cy.get(MINOR_CREDITOR_DOM_ELEMENTS.balanceCell).eq(1).should('contain', '£345.00');
  });

  it('(AC5e) Tabs only displayed when results exist for corresponding type', { tags: ['PO-706'] }, () => {
    // Test scenario with only individuals and companies (no minor creditors)
    setupComponent('PARTIAL_RESULTS');

    // Verify only individuals and companies tabs are shown
    cy.get(INDIVIDUAL_DOM_ELEMENTS.individualsTab).should('be.visible');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.companiesTab).should('be.visible');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.minorCreditorsTab).should('not.exist');
  });

  it('(AC5fi) Companies tab in focus when no individuals found', { tags: ['PO-706'] }, () => {
    setupComponent('COMPANY_RESULTS_ONLY', 'companies');

    // Verify companies tab is selected when individuals tab doesn't exist
    cy.get(INDIVIDUAL_DOM_ELEMENTS.individualsTab).should('not.exist');
    verifyTabIsActive(INDIVIDUAL_DOM_ELEMENTS.companiesTab);
    cy.get(INDIVIDUAL_DOM_ELEMENTS.tableWrapper).should('exist');
  });

  it('(AC5fii) No tabs displayed for single creditor type results', { tags: ['PO-706'] }, () => {
    setupComponent('INDIVIDUALS_ONLY_RESULTS', 'individuals');

    cy.get(INDIVIDUAL_DOM_ELEMENTS.individualsTab).should('be.visible');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.companiesTab).should('not.exist');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.minorCreditorsTab).should('not.exist');
  });

  it('(AC5fii) No tabs displayed for single debtor type results', { tags: ['PO-706'] }, () => {
    setupComponent('MINOR_CREDITOR_ONLY_RESULTS', 'minorCreditors');

    cy.get(INDIVIDUAL_DOM_ELEMENTS.individualsTab).should('not.exist');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.companiesTab).should('not.exist');
    cy.get(INDIVIDUAL_DOM_ELEMENTS.minorCreditorsTab).should('be.visible');
  });
});
