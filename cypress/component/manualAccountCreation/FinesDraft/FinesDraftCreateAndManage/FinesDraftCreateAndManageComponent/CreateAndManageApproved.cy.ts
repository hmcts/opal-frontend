import { mount } from 'cypress/angular';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/fines-draft-session-mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import { NAVIGATION_LINKS, TABLE_HEADINGS } from './constants/fines_draft_cam_inputter_tableConstants';
import { of } from 'rxjs';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { mock } from 'node:test';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';
import { interceptGetApprovedAccounts, interceptGetRejectedAccounts } from './mocks/create-and-manage-intercepts';

describe('FinesDraftCreateAndManageApprovedComponent', () => {
  const setupComponent = () => {
    cy.then(() => {
      mount(FinesDraftCreateAndManageTabsComponent, {
        providers: [
          provideHttpClient(),
          OpalFines,
          DateService,
          FinesMacPayloadService,
          FinesDraftStore,
          provideRouter([]),
          {
            provide: GlobalStore,
            useFactory: () => {
              let store = new GlobalStore();
              store.setUserState(DRAFT_SESSION_USER_STATE_MOCK);
              return store;
            },
          },
        ],
        componentProperties: {
          activeTab: 'review',
        },
      });
    });
  };

  it('(AC.3,AC.4)should show summary table with correct data for approved accounts', { tags: ['@PO-607'] }, () => {
    const approvedMockData = { count: 2, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };

    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetApprovedAccounts(200, approvedMockData);

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
      if (link === 'Approved') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page');
      }
    }

    //Check table row data in row 1
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.dob).contains('—');
        cy.get(DOM_ELEMENTS.created).contains('4 days ago');
        cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });

    //Check table row data in row 2
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.created).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains('Fine');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });
  });

  it(
    '(AC.5)should have pagination enabled for over 25 draft accounts for approved accounts',
    { tags: ['@PO-607'] },
    () => {
      const approvedMockData = structuredClone(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK);

      interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
      interceptGetApprovedAccounts(200, approvedMockData);

      setupComponent();

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();

      cy.get(DOM_ELEMENTS.tableCaption).contains('Showing 1 - 25 of 50 accounts').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('1').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('2').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').should('exist');
      cy.get(DOM_ELEMENTS.defendant).contains('Robert Brown').should('exist');

      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.defendant).contains('Emma Gonzalez').should('exist');
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Previous').should('exist');

      cy.get(DOM_ELEMENTS.defendant)
        .its('length')
        .then((count) => {
          expect(count).to.be.eq(25);
        });
    },
  );

  it(
    '(AC.5) should have default sort order for created accounts set to descending for approved',
    { tags: ['@PO-607'] },
    () => {
      const approvedMockData = { count: 2, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };

      interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
      interceptGetApprovedAccounts(200, approvedMockData);

      setupComponent();

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
      //Check table row data in row 1
      cy.get(DOM_ELEMENTS.tableRow)
        .eq(0)
        .within(() => {
          cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
          cy.get(DOM_ELEMENTS.dob).contains('—');
          cy.get(DOM_ELEMENTS.created).contains('4 days ago');
          cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
          cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
        });

      //Check table row data in row 2
      cy.get(DOM_ELEMENTS.tableRow)
        .eq(1)
        .within(() => {
          cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
          cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
          cy.get(DOM_ELEMENTS.created).contains('Today');
          cy.get(DOM_ELEMENTS.accountType).contains('Fine');
          cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
        });
    },
  );
  it(
    '(AC.1)should show empty value statement for Approved status when no accounts have been Approved',
    { tags: ['@PO-607'] },
    () => {
      const approvedMockData = { count: 0, summaries: [] };

      interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
      interceptGetApprovedAccounts(200, approvedMockData);

      setupComponent();

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Approved');
      cy.get('p').should('exist').and('contain', 'No accounts have been approved in the past 7 days.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
    },
  );
});
