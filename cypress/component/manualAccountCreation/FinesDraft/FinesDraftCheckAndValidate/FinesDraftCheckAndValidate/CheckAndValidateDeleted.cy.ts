import { mount } from 'cypress/angular';
import { FinesDraftCheckAndValidateTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-validate/fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/check-and-validate-session-mock';
import { DOM_ELEMENTS } from './constants/fines_draft_cav_elements';
import { TABLE_HEADINGS_DELETED } from './constants/fines_draft_cav_tableConstants';
import {
  interceptCAVGetDeletedAccounts,
  interceptCAVGetFailedAccounts,
  interceptCAVGetRejectedAccounts,
  interceptCAVGetToReviewAccounts,
} from './intercepts/check-and-validate-intercepts';
import { OPAL_FINES_VALIDATE_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_validate_over_25_account_mock';
import { OPAL_FINES_DRAFT_VALIDATE_DELETE_ACCOUNTS_MOCK } from './mocks/fines-draft-validate-delete-account.mock';

describe('FinesDraftCheckAndValidateDeleteComponent', () => {
  const setupComponent = () => {
    cy.then(() => {
      mount(FinesDraftCheckAndValidateTabsComponent, {
        providers: [
          provideHttpClient(),
          provideRouter([]),
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

  it('(AC.3) should display Deleted tab correctly when there are draft records', { tags: ['@PO-602'] }, () => {
    const deletedMockData = structuredClone(OPAL_FINES_DRAFT_VALIDATE_DELETE_ACCOUNTS_MOCK);
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, deletedMockData);
    interceptCAVGetFailedAccounts(200, { count: 0, summaries: [] });

    //Get the test user and business unit from the mock data
    const testUser = DRAFT_SESSION_USER_STATE_MOCK.business_unit_user[0].business_unit_user_id;
    const businessUnitId = DRAFT_SESSION_USER_STATE_MOCK.business_unit_user[0].business_unit_id;

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Deleted').click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');
    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Deleted');
    cy.get(DOM_ELEMENTS.table).should('exist');

    //Ensure the request created by the frontend is correct
    cy.get('@getDeletedAccounts').then((interception: any) => {
      expect(interception.request.url).to.include(`business_unit=${businessUnitId}`);
      expect(interception.request.url).to.include(`not_submitted_by=${testUser}`);
    });

    //Check table headings
    cy.get(DOM_ELEMENTS.tableHeadings).each((heading, index) => {
      const expectedHeading = TABLE_HEADINGS_DELETED[index];
      cy.wrap(heading).should('contain', expectedHeading);
    });
  });

  it('(AC.4a) should have default sort order for created accounts set to ascending', { tags: ['@PO-602'] }, () => {
    const deletedMockData = structuredClone(OPAL_FINES_DRAFT_VALIDATE_DELETE_ACCOUNTS_MOCK);
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, deletedMockData);
    interceptCAVGetFailedAccounts(200, { count: 0, summaries: [] });

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('Deleted').click();
    for (const heading of TABLE_HEADINGS_DELETED) {
      cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');
    }
    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Deleted').should('have.attr', 'aria-sort', 'ascending');
    //Check table row data in row 1
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.dob).contains('—');
        cy.get(DOM_ELEMENTS.deleted).contains('3 days ago');
        cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });

    //Check table row data in row 2
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.deleted).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains('Fine');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });

    cy.get(DOM_ELEMENTS.tableHeadings).contains('Deleted').click();
    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Deleted').should('have.attr', 'aria-sort', 'descending');

    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.deleted).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains('Fine');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.dob).contains('—');
        cy.get(DOM_ELEMENTS.deleted).contains('3 days ago');
        cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });
  });

  it('(AC.4b) should have pagination for over 25 accounts', { tags: ['@PO-602'] }, () => {
    const deletedMockData = structuredClone(OPAL_FINES_VALIDATE_OVER_25_DRAFT_ACCOUNTS_MOCK);
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, deletedMockData);
    interceptCAVGetFailedAccounts(200, { count: 0, summaries: [] });

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('Deleted').click();

    cy.get(DOM_ELEMENTS.tableCaption).contains('Showing 1 - 25 of 50 accounts').should('exist');
    cy.get(DOM_ELEMENTS.paginationLinks).contains('1').should('exist');
    cy.get(DOM_ELEMENTS.paginationLinks).contains('2').should('exist');
    cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').should('exist');
    cy.get(DOM_ELEMENTS.defendant).eq(24).contains('Robert Brown').should('exist');

    cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
    cy.get(DOM_ELEMENTS.tableCaption).contains('Showing 26 - 50 of 50 accounts').should('exist');

    cy.get(DOM_ELEMENTS.defendant).eq(24).contains('Emma Gonzalez').should('exist');
    cy.get(DOM_ELEMENTS.paginationLinks).contains('Previous').should('exist');

    cy.get(DOM_ELEMENTS.defendant)
      .its('length')
      .then((count) => {
        expect(count).to.be.eq(25);
      });
  });
});
