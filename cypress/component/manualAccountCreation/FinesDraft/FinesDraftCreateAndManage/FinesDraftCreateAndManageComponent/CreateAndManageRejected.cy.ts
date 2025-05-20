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

describe('FinesDraftCheckAndManageRejectedComponent', () => {
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

  it('AC.1 should display number of rejected accounts in a icon on values of 1-99', { tags: ['@PO-605'] }, () => {
    const rejectedMockData = { count: 2, summaries: [] };
    interceptGetRejectedAccounts(200, rejectedMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
    cy.get(DOM_ELEMENTS.rejectedIcon).should('exist').and('contain', '2');
  });
  it(
    'AC.1b) Should not display notifications or rejected account tab when rejected account equals 0',
    { tags: ['@PO-605'] },
    () => {
      const rejectedMockData = { count: 0, summaries: [] };
      interceptGetRejectedAccounts(200, rejectedMockData);
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
      cy.get(DOM_ELEMENTS.rejectedIcon).should('not.exist');
    },
  );
  it('(AC.1) should display rejected icon count up to 99 then after display 99+', { tags: ['@PO-605'] }, () => {
    const rejectedMockData = { count: 100, summaries: [] };
    interceptGetRejectedAccounts(200, rejectedMockData);
    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
    cy.get(DOM_ELEMENTS.rejectedIcon).should('exist').and('contain', '99+');
  });

  it(
    '(AC.2) should show empty value statement for Rejected status when no accounts have been submitted/resubmitted',
    { tags: ['@PO-605'] },
    () => {
      const rejectedMockData = { count: 0, summaries: [] };
      interceptGetRejectedAccounts(200, rejectedMockData);

      setupComponent();

      cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Rejected');
      cy.get('p').should('exist').and('contain', 'You have no rejected accounts');
      cy.get('p')
        .should('exist')
        .and('contain', 'To resubmit accounts for other team members, you can view all rejected accounts');
      cy.get('p').find('a').should('have.text', 'view all rejected accounts');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
    },
  );
  it(
    '(AC.3) should show list of accounts for Rejected status when accounts have been submitted/resubmitted',
    { tags: ['@PO-605'] },
    () => {
      const rejectedMockData = { count: 0, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };
      interceptGetRejectedAccounts(200, rejectedMockData);

      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Rejected');
      cy.get('p')
        .should('exist')
        .and('contain', 'To resubmit accounts for other team members, you can view all rejected accounts');
      cy.get(DOM_ELEMENTS.table).should('exist');
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Defendant').should('exist');
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Date of birth').should('exist');
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Account type').should('exist');
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Business unit').should('exist');
    },
  );
  it('AC.4 verify the table of headers in review tab', { tags: ['@PO-605'] }, () => {
    const rejectedMockData = { count: 0, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };
    interceptGetRejectedAccounts(200, rejectedMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();

    cy.get(DOM_ELEMENTS.tableHeadings).contains('Defendant').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Date of birth').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Account type').should('exist');
    cy.get(DOM_ELEMENTS.tableHeadings).contains('Business unit').should('exist');

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

  it('(AC.5a) The table should have the correct default ordering', { tags: ['@PO-605'] }, () => {
    const rejectedMockData = { count: 0, summaries: OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries };
    interceptGetRejectedAccounts(200, rejectedMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();

    //cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').click();
    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Created').should('have.attr', 'aria-sort', 'ascending');
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.created).contains('4 days ago');
      });
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.created).contains('Today');
      });
  });
  it(
    '(AC.5b)should have pagination enabled for over 25 draft accounts for In Review accounts',
    { tags: ['@PO-605'] },
    () => {
      const rejectedMockData = { count: 0, summaries: OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries };
      interceptGetRejectedAccounts(200, rejectedMockData);

      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();

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
    },
  );
});
