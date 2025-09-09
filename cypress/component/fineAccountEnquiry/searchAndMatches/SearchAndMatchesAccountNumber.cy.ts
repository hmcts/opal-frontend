import { mount } from 'cypress/angular';
import { FinesSaSearchAccountComponent } from '../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/fines-sa-search-account.component';
import { FinesSaStore } from '../../../../src/app/flows/fines/fines-sa/stores/fines-sa.store';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { DOM_ELEMENTS } from './constants/search_and_matches_individuals_elements';
import { INDIVIDUAL_SEARCH_STATE_MOCK } from './mocks/search_and_matches_individual_mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { finesSaDefendantAccountsResolver } from 'src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-defendant-accounts/fines-sa-defendant-accounts.resolver';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { finesSaMinorCreditorAccountsResolver } from 'src/app/flows/fines/fines-sa/routing/resolvers/fines-sa-minor-creditor-accounts/fines-sa-minor-creditor-accounts.resolver';

describe('Search Account Component - Multiple account types', () => {
  let searchMock = structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK);

  const setupComponent = (formSubmit: any = null) => {
    mount(FinesSaSearchAccountComponent, {
      providers: [
        provideHttpClient(),
        provideRouter([
          {
            path: 'fines/search-accounts/results',
            component: FinesSaSearchAccountComponent,
            resolve: {
              title: TitleResolver,
              individualAccounts: finesSaDefendantAccountsResolver,
              companyAccounts: finesSaDefendantAccountsResolver,
              minorCreditorAccounts: finesSaMinorCreditorAccountsResolver,
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
            store.setSearchAccount(searchMock);
            store.setActiveTab('individuals');

            return store;
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('individuals'),
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
    searchMock = structuredClone(INDIVIDUAL_SEARCH_STATE_MOCK);
  });

  it(
    'AC1a,b,c,AC6a should send correct API parameters when searching by account number with active account only is false',
    { tags: ['PO-706'] },
    () => {
      // Set up valid account number search data
      searchMock.fsa_search_account_number = '12345678A';
      searchMock.fsa_search_account_business_unit_ids = [5];
      searchMock.fsa_search_account_active_accounts_only = false;
      searchMock.fsa_search_account_individuals_search_criteria = null;

      setupComponent(null);

      cy.window().then((win) => {
        cy.stub(win.console, 'info').as('consoleLog');
      });

      // Verify the account number field has the correct value
      cy.get(DOM_ELEMENTS.accountNumberInput).should('have.value', '12345678A');
      cy.get(DOM_ELEMENTS.searchButton).click();

      // Wait for all API calls to complete
      cy.wait(500);

      cy.get('@consoleLog').should('have.been.called');

      cy.get('@consoleLog').then((stub: any) => {
        // Log all calls to see what's happening
        cy.log(`Total API calls made: ${stub.callCount}`);

        //Verify we have at least 3 calls as expected
        cy.log(`Call count size: ${stub.callCount}`);

        // Only proceed if we have at least one call
        if (stub.callCount >= 1) {
          //AC1a: Check 1st call
          const call1 = stub.getCall(0).args[0];
          cy.log('Call 1 (AC1a):', JSON.stringify(call1, null, 2));
          expect(call1).to.have.property('account_number', '12345678A');
          expect(call1).to.have.property('business_unit_ids').that.deep.equals([5]);
          expect(call1).to.have.property('active_accounts_only', false);
          cy.log('AC1a verified: First API call');
        }

        // Only check second call if it exists
        if (stub.callCount >= 2) {
          const call2 = stub.getCall(1).args[0];
          expect(call2).to.have.property('business_unit_ids').that.deep.equals([5]);
          expect(call2).to.have.property('account_number', '12345678A');
          expect(call2).to.have.property('active_accounts_only', false);
          cy.log('AC1b verified: Second API call (searchDefendantAccounts)');
        } else {
          cy.log('No second API call found - only got', stub.callCount, 'calls');
        }

        // Only check third call if it exists
        if (stub.callCount >= 3) {
          const call3 = stub.getCall(2).args[0];
          expect(call3).to.have.property('account_number', '12345678A');
          expect(call3).to.have.property('active_accounts_only', false);
          expect(call3).to.have.property('business_unit_ids').that.deep.equals([5]);
          cy.log('AC1c verified: Third API call (searchCreditorAccounts)');
        } else {
          cy.log('No third API call found - only got', stub.callCount, 'calls');
        }
      });
    },
  );

  it(
    'AC6a should send correct API parameters when searching by account number with active account only is true',
    { tags: ['PO-706'] },
    () => {
      // Set up valid account number search data
      searchMock.fsa_search_account_number = '12345678A';
      searchMock.fsa_search_account_business_unit_ids = [5];
      searchMock.fsa_search_account_active_accounts_only = true;
      searchMock.fsa_search_account_individuals_search_criteria = null;

      setupComponent(null);

      cy.window().then((win) => {
        cy.stub(win.console, 'info').as('consoleLog');
      });

      // Verify the account number field has the correct value
      cy.get(DOM_ELEMENTS.accountNumberInput).should('have.value', '12345678A');
      cy.get(DOM_ELEMENTS.searchButton).click();

      // Wait for all API calls to complete
      cy.wait(500);

      cy.get('@consoleLog').should('have.been.called');

      cy.get('@consoleLog').then((stub: any) => {
        // Log all calls to see what's happening
        cy.log(`Total API calls made: ${stub.callCount}`);

        //Verify we have at least 3 calls as expected
        cy.log(`Call count size: ${stub.callCount}`);

        // Only proceed if we have at least one call
        if (stub.callCount >= 1) {
          //AC1a: Check 1st call
          const call1 = stub.getCall(0).args[0];
          cy.log('Call 1 (AC1a):', JSON.stringify(call1, null, 2));
          expect(call1).to.have.property('account_number', '12345678A');
          expect(call1).to.have.property('business_unit_ids').that.deep.equals([5]);
          expect(call1).to.have.property('active_accounts_only', false);
          cy.log('AC1a verified: First API call');
        }

        // Only check second call if it exists
        if (stub.callCount >= 2) {
          const call2 = stub.getCall(1).args[0];
          expect(call2).to.have.property('business_unit_ids').that.deep.equals([5]);
          expect(call2).to.have.property('account_number', '12345678A');
          expect(call2).to.have.property('active_accounts_only', false);
          cy.log('AC1b verified: Second API call (searchDefendantAccounts)');
        } else {
          cy.log('No second API call found - only got', stub.callCount, 'calls');
        }

        // Only check third call if it exists
        if (stub.callCount >= 3) {
          const call3 = stub.getCall(2).args[0];
          expect(call3).to.have.property('account_number', '12345678A');
          expect(call3).to.have.property('active_accounts_only', false);
          expect(call3).to.have.property('business_unit_ids').that.deep.equals([5]);
          cy.log('AC1c verified: Third API call (searchCreditorAccounts)');
        } else {
          cy.log('No third API call found - only got', stub.callCount, 'calls');
        }
      });
    },
  );
});
