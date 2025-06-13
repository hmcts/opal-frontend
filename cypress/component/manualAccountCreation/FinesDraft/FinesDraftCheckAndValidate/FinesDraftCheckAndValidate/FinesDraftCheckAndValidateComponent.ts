import { mount } from 'cypress/angular';
import { FinesDraftCheckAndValidateTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { of } from 'rxjs';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_checker_inputter_elements';
import { NAVIGATION_LINKS } from './constants/fines_draft_cav_tableConstants';
import { IOpalFinesDraftAccountsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { DRAFT_SESSION_USER_STATE_MOCK } from '../../FinesDraftCreateAndManage/FinesDraftCreateAndManageComponent/mocks/fines-draft-session-mock';
import { OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK } from './mocks/fines-draft-validate-account.mock';

describe('FinesDraftCheckAndValidateComponent', () => {
  const setupComponent = (mockTableData: IOpalFinesDraftAccountsResponse, toReviewAccountsMockData: number) => {
    cy.then(() => {
      mount(FinesDraftCheckAndValidateTabsComponent, {
        providers: [
          provideHttpClient(),
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
          {
            provide: ActivatedRoute,
            useValue: {
              fragment: of('review'),
              snapshot: {
                data: {
                  draftAccounts: mockTableData,
                  rejectedCount: toReviewAccountsMockData,
                },
                fragment: 'review',
              },
            },
          },
        ],
        componentProperties: {},
      });
    });
  };

  it('(AC.1) should show summary table with correct tabs and data for the accounts', { tags: ['@PO-593'] }, () => {
    const reviewedMockData = { count: 0, summaries: [] };
    const toReviewCountMockData = 0;

    setupComponent(reviewedMockData, toReviewCountMockData);

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
      if (link === 'To review') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page').and('exist');
      }
      if (link === 'Rejected') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page').click();
        cy.get(DOM_ELEMENTS.heading).should('have.text', 'Rejected').and('have.text', 'There are no rejected accounts');
      }
      if (link === 'Deleted') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page').click();
        cy.get(DOM_ELEMENTS.heading).should('have.text', 'Rejected').and('have.text', 'There are no deleted accounts');
      }
    }
  });

  it('(AC.2) To Review tab view and there are zero draft account records', { tags: ['@PO-593'] }, () => {
    const reviewedMockData = { count: 0, summaries: [] };
    const toReviewCountMockData = 0;

    setupComponent(reviewedMockData, toReviewCountMockData);

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');
    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'To review');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
      if (link === 'To review') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page').and('exist');
        cy.get(DOM_ELEMENTS.navigationLinks).contains('have.text', 'There are no accounts to review.');
      }
    }
  });

  it('(AC.3) To Review tab view and there are one or more draft account records', { tags: ['@PO-593'] }, () => {
    const reviewedMockData = { count: 2, summaries: OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK.summaries };
    const toReviewCountMockData = 2;

    setupComponent(reviewedMockData, toReviewCountMockData);

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');
    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'To review');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
      if (link === 'To review') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page').and('exist');
        cy.get(DOM_ELEMENTS.navigationLinks).contains('have.text', 'There are no accounts to review.');
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
        cy.get(DOM_ELEMENTS.submittedBy).contains('opal-test');
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
        cy.get(DOM_ELEMENTS.submittedBy).contains('opal-test');
      });
  });

  it('AC.4should show summary table with correct data for approved accounts', { tags: ['@PO-593'] }, () => {
    const reviewedMockData = { count: 2, summaries: OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK.summaries };
    const toReviewCountMockData = 2;

    setupComponent(reviewedMockData, toReviewCountMockData);

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');
    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'To review');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
      if (link === 'To review') {
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
        cy.get(DOM_ELEMENTS.submittedBy).contains('opal-test');
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
        cy.get(DOM_ELEMENTS.submittedBy).contains('opal-test');
      });
  });

  it(
    '(AC.5) should have default sort order for created accounts set to descending for approved',
    { tags: ['@PO-593'] },
    () => {
      const toReviewMockData = { count: 2, summaries: OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK.summaries };
      const toReviewCountMockData = 2;

      setupComponent(toReviewMockData, toReviewCountMockData);
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
    '(AC.5b)should have pagination enabled for over 25 draft accounts for approved accounts',
    { tags: ['@PO-593'] },
    () => {
      const toReviewMockData = { count: 2, summaries: OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK.summaries };
      const toReviewCountMockData = 2;

      setupComponent(toReviewMockData, toReviewCountMockData);

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
