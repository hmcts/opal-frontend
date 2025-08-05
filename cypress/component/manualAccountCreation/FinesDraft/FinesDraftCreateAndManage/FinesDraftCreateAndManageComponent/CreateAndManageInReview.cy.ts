import { mount } from 'cypress/angular';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/fines-draft-session-mock';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import { NAVIGATION_LINKS } from './constants/fines_draft_cam_tableConstants';
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';
import { interceptGetInReviewAccounts, interceptGetRejectedAccounts } from './mocks/create-and-manage-intercepts';
import { FINES_MAC_ACCOUNT_TYPES } from 'src/app/flows/fines/fines-mac/constants/fines-mac-account-types';

describe('FinesDraftCreateAndManageInReviewComponent', () => {
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

  it('(AC.1) render all the fields In review account', { tags: ['@PO-584'] }, () => {
    const inReviewAccountsMockData = structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetInReviewAccounts(200, inReviewAccountsMockData);

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();

    for (const link of NAVIGATION_LINKS) {
      if (link === 'In review') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist').should('have.attr', 'aria-current', 'page');
      } else {
        cy.get(DOM_ELEMENTS.navigationLinks)
          .contains(link)
          .should('exist')
          .should('not.have.attr', 'aria-current', 'page');
      }
    }
  });

  it('AC.2 When user has not associated accounts, that are in review', { tags: ['@PO-584'] }, () => {
    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetInReviewAccounts(200, { count: 0, summaries: [] });

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();

    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'In review');
    cy.get('p').should('exist').and('contain', 'You have no accounts in review');
    cy.get(DOM_ELEMENTS.table).should('not.exist');
  });

  it('AC.3 verify the table of headers in review tab', { tags: ['@PO-584'] }, () => {
    const inReviewAccountsMockData = structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetInReviewAccounts(200, inReviewAccountsMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();

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
        cy.get(DOM_ELEMENTS.accountType).contains(FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']);
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });

    //Check table row data in row 2
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.created).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains(FINES_MAC_ACCOUNT_TYPES.Fine);
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });
  });

  it('(AC.4a) The table should have the correct default ordering', { tags: ['@PO-584'] }, () => {
    const inReviewAccountsMockData = structuredClone(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);

    interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptGetInReviewAccounts(200, inReviewAccountsMockData);

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();

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

    cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').click();
    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Created').should('have.attr', 'aria-sort', 'descending');

    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.created).contains('Today');
      });

    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.created).contains('4 days ago');
      });
  });

  it(
    '(AC.4b)should have pagination enabled for over 25 draft accounts for In Review accounts',
    { tags: ['@PO-584'] },
    () => {
      const inReviewAccountsMockData = structuredClone(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK);

      interceptGetRejectedAccounts(200, { count: 0, summaries: [] });
      interceptGetInReviewAccounts(200, inReviewAccountsMockData);

      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();

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
});
