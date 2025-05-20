import { mount } from 'cypress/angular';
import { FinesDraftCheckAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-manage/fines-draft-check-and-manage-tabs/fines-draft-check-and-manage-tabs.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/fines-draft-session-mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { routes } from './constants/fines_draft_cam_inputter_routes';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import { NAVIGATION_LINKS, TABLE_HEADINGS } from './constants/fines_draft_cam_inputter_tableConstants';
import {
  interceptGetRejectedAccounts,
  interceptGetInReviewAccounts,
  interceptGetDeletedAccounts,
  interceptGetApprovedAccounts,
} from './intercepts/fines-draft-intercepts';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';

describe('FinesDraftCheckAndManageInReviewComponent', () => {
  const setupComponent = () => {
    cy.then(() => {
      mount(FinesDraftCheckAndManageTabsComponent, {
        providers: [
          provideHttpClient(),
          provideRouter(routes),
          OpalFines,
          DateService,
          FinesMacPayloadService,
          FinesDraftStore,
          {
            provide: GlobalStore,
            useFactory: () => {
              let store = new GlobalStore();
              store.setUserState(DRAFT_SESSION_USER_STATE_MOCK);
              return store;
            },
          },
        ],
        componentProperties: {},
      });
    });
  };

  it('(AC.3,AC.4)should show summary table with correct data for approved accounts', { tags: ['@PO-607'] }, () => {
    setupComponent();
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks)
      .contains('' + NAVIGATION_LINKS[2])
      .click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
    }

    cy.get(DOM_ELEMENTS.statusHeading)
      .should('exist')
      .and('contain', '' + NAVIGATION_LINKS[2]);

    for (const heading of TABLE_HEADINGS) {
      cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');
    }
    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '15 May 1990');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgo(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fine');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit A');

    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'Jane Smith');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '—');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgo(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[1].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit B');
    mockData = OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK;
  });

it(
    '(AC.5)should have pagination enabled for over 25 draft accounts for approved accounts',
    { tags: ['@PO-607'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[2])
        .click();

      cy.get('strong').contains('Showing 1 - 25 of 50 accounts').should('exist');
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
      mockData = OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK;
    },
  );

  it(
    '(AC.5) should have default sort order for created accounts set to descending for approved',
    { tags: ['@PO-607'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[2])
        .click();
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
      cy.get(DOM_ELEMENTS.created)
        .first()
        .contains(
          `${dateService.getDaysAgo(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
        );
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.created)
        .last()
        .contains(
          `${dateService.getDaysAgo(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[9].account_snapshot.created_date)}`,
        );
    },
  );
   it(
    '(AC.1)should show empty value statement for Approved status when no accounts have been Approved',
    { tags: ['@PO-607'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Approved');
      cy.get('p').should('exist').and('contain', 'No accounts have been approved in the past 7 days.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
      mockData = {
        count: 0,
        summaries: [],
      };
    },
  );

})
