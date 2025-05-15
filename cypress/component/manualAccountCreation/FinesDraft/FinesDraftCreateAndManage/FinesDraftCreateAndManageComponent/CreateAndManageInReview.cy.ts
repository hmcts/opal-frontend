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
import { interceptGetRejectedAccounts, interceptGetInReviewAccounts } from './intercepts/fines-draft-intercepts.cy';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';

describe('FinesDraftCheckAndManageInReviewComponent', () => {
  let mockData: any = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
  const dateService = new DateService();

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

  it('should render component', () => {
    const rejectedMockData = { count: 0, summaries: [] };
    const inReviewMockData = { count: 0, summaries: [] };
    interceptGetRejectedAccounts(200, rejectedMockData);
    interceptGetInReviewAccounts(200, inReviewMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.app).should('exist');
    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();
  });

  it.only('(AC.1) render all the fields In review account', { tags: ['@PO-584'] }, () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks)
      .contains('' + NAVIGATION_LINKS[0])
      .click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
    }

    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').should('be.focused');
    cy.get(DOM_ELEMENTS.statusHeading)
      .should('exist')
      .and('contain', '' + NAVIGATION_LINKS[0]);

    for (const heading of TABLE_HEADINGS) {
      cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Rejected');
      cy.get('p').should('exist').and('contain', 'You have no rejected accounts.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Approved');
      cy.get('p').should('exist').and('contain', 'No accounts have been approved in the past 7 days.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Deleted').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Deleted');
      cy.get('p').should('exist').and('contain', 'No accounts have been deleted in the past 7 days.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
    }
  });
  it('AC.2 When user has not associated accounts, that are in review', { tags: ['@PO-584'] }, () => {
    setupComponent();
    mockData = {
      count: 0,
      summaries: [],
    };

    //You have no accounts in review
    cy.get(DOM_ELEMENTS.navigationLinks)
      .contains('' + NAVIGATION_LINKS[0])
      .click();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review');
    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'In review');
    cy.get('p').should('exist').and('contain', 'You have no accounts in review');
    cy.get(DOM_ELEMENTS.table).should('not.exist');
  });
  it('AC.3 verify the table of headers in review tab', { tags: ['@PO-584'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.tableHeadings).should('exist').and('contains', 'Defendant');
    cy.get(DOM_ELEMENTS.tableHeadings).should('exist').and('contains', 'Date of Birth');
    cy.get(DOM_ELEMENTS.tableHeadings).should('exist').and('contains', 'Created');
    cy.get(DOM_ELEMENTS.tableHeadings).should('exist').and('contains', 'Account type');
    cy.get(DOM_ELEMENTS.tableHeadings).should('exist').and('contains', 'Business unit');
  });

  it(
    '(AC.4)should have pagination enabled for over 25 draft accounts for In Review accounts',
    { tags: ['@PO-584'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[0])
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
});
