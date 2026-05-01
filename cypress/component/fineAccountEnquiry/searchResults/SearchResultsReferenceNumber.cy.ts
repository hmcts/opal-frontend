import { mount } from 'cypress/angular';
import { FinesSaResultsComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-results/fines-sa-results.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AccountEnquiryResultsLocators as ResultsLocators } from '../../../shared/selectors/account-enquiry/account.enquiry.results.locators';
import { UNIFIED_SEARCH_RESULTS_MOCK, getAllAccountTypes } from './mocks/search_results_account_mock';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from '../searchAndMatches/mocks/search_and_matches_individual_mock';
import { OpalFines } from '../../../../src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { BehaviorSubject } from 'rxjs';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const ResultsMessageLocators = ResultsLocators.messages;
const ResultsTabLocators = ResultsLocators.tabs;
const ResultsHeaderCellLocators = ResultsLocators.headerCells;
const ResultsCellLocators = ResultsLocators.cols;

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL];

describe('FinesSaResultsComponent - All Account Types', () => {
  let fragmentSubject: BehaviorSubject<string>;
  const createSearchResultState = () => ({
    searchAccount: structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK),
    unsavedChanges: false,
    stateChanges: false,
  });
  let searchResultStateTemplate = createSearchResultState();
  let searchResultState = searchResultStateTemplate;

  beforeEach(() => {
    fragmentSubject?.complete();
    searchResultStateTemplate = createSearchResultState();
    searchResultState = searchResultStateTemplate;
  });

  const setupComponent = (
    scenario: keyof typeof UNIFIED_SEARCH_RESULTS_MOCK = 'PARTIAL_RESULTS',
    initialFragment: string = 'individuals',
  ) => {
    const allMockData = getAllAccountTypes(scenario);

    // Create BehaviorSubject for reactive fragment changes (signals-compatible)
    fragmentSubject = new BehaviorSubject(initialFragment);
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
            fragment: fragmentSubject.asObservable(),
            snapshot: {
              url: [{ path: 'search-results' }],
              data: {
                individualAccounts: allMockData.individuals,
                companyAccounts: allMockData.companies,
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

  it(
    '(AC3a) Displays error message when no search matches are found (Search Results Reference Number)',
    { tags: [...buildTags('@JIRA-STORY:PO-709'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent('EMPTY_RESULTS');

      // AC3a: Verify the error screen is displayed when no search matches are found
      cy.get(ResultsMessageLocators.heading).should('be.visible');
      cy.get(ResultsMessageLocators.heading).should('contain', 'There are no matching results');

      cy.get(ResultsMessageLocators.link).should('be.visible');
      cy.get(ResultsMessageLocators.link).should('contain', 'Check your search');
      // AC3b: Verify 'Check your search' link is clickable and functional
      cy.get(ResultsMessageLocators.link).click();
    },
  );

  it(
    '(AC4) Displays "There are more than 100 results" message when more than 100 matches found',
    { tags: [...buildTags('@JIRA-STORY:PO-709'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent('LARGE_RESULTS_REF_NUM');

      // AC4a: Verify the "too many results" error screen is displayed
      cy.get(ResultsMessageLocators.heading).should('be.visible');
      cy.get(ResultsMessageLocators.heading).should('contain', 'There are more than 100 results');

      // AC4b: Verify 'Try adding more information' link is present
      cy.get(ResultsMessageLocators.link).should('be.visible').should('contain', 'Try adding more information');
      cy.get(ResultsMessageLocators.link).should('have.class', 'govuk-link');
      cy.get(ResultsMessageLocators.link).click();
    },
  );

  it(
    '(AC5 ,5b,5f) Displays tabs when matches across multiple debtor types and Individual tab is in focus by default',
    { tags: [...buildTags('@JIRA-STORY:PO-709'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent('WITH_DATA', 'individuals');

      // AC5b-Verify Individuals tab is in focus by default
      verifyTabIsActive(ResultsTabLocators.individualsTab);

      // Verify all column headers are present
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
    '(AC5c) Companies tab displays company defendant account summary data (Search Results Reference Number)',
    { tags: [...buildTags('@JIRA-STORY:PO-709'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent('WITH_DATA', 'companies');

      switchToTab('companies', ResultsTabLocators.companiesTab);
      verifyTabIsActive(ResultsTabLocators.companiesTab);

      // Verify table exists and headers match design
      cy.get(ResultsLocators.table.root).should('exist');
      cy.get(ResultsHeaderCellLocators.account).should('contain', 'Account');
      cy.get(ResultsHeaderCellLocators.addr1).should('contain', 'Address line 1');
      cy.get(ResultsHeaderCellLocators.postcode).should('contain', 'Postcode');
      cy.get(ResultsHeaderCellLocators.bu).should('contain', 'Business unit');
      cy.get(ResultsHeaderCellLocators.ref).should('contain', 'Ref');
      cy.get(ResultsHeaderCellLocators.enf).should('contain', 'ENF');
      cy.get(ResultsHeaderCellLocators.balance).should('contain', 'Balance');

      // Verify first row matches mock data
      cy.get(ResultsCellLocators.name).first().should('contain', 'ACME LTD');
      cy.get(ResultsCellLocators.addr1).first().should('contain', '10 Downing Street');
      cy.get(ResultsCellLocators.balance).first().should('contain', '£1,000.00');
    },
  );

  it(
    '(AC5e, 5d) Only individual tab when only results exist for individual',
    { tags: [...buildTags('@JIRA-STORY:PO-709'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent('INDIVIDUALS_ONLY_RESULTS');

      // Verify only individuals and companies tabs are shown
      cy.get(ResultsTabLocators.individualsTab).should('be.visible');
      cy.get(ResultsTabLocators.companiesTab).should('not.exist');
      cy.get(ResultsTabLocators.minorCreditorsTab).should('not.exist');
    },
  );

  it(
    '(AC5e, 5d) Only company tab when only results exist for company',
    { tags: [...buildTags('@JIRA-STORY:PO-709'), '@JIRA-EPIC:PO-704'] },
    () => {
      setupComponent('COMPANY_RESULTS_ONLY');

      // Verify only companies tab are shown
      cy.get(ResultsTabLocators.individualsTab).should('not.exist');
      cy.get(ResultsTabLocators.companiesTab).should('be.visible');
      cy.get(ResultsTabLocators.minorCreditorsTab).should('not.exist');
    },
  );
});
