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
import { NAVIGATION_LINKS, TABLE_HEADINGS, TABLE_HEADINGS_FAILED } from './constants/fines_draft_cav_tableConstants';
import {
  interceptCAVGetDeletedAccounts,
  interceptCAVGetFailedAccounts,
  interceptCAVGetRejectedAccounts,
  interceptCAVGetToReviewAccounts,
} from './intercepts/check-and-validate-intercepts';
import { OPAL_FINES_VALIDATE_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_validate_over_25_account_mock';
import { OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK } from './mocks/fines-draft-validate-account.mock';

describe('FinesDraftCheckAndValidateFailedComponent', () => {
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
        componentProperties: {
          activeTab: 'to-review',
        },
      });
    });
  };

  it('(AC.1) Review account is created as per design artefact', { tags: ['@PO-1059'] }, () => {
    const emptyMockData = { count: 0, summaries: [] };

    interceptCAVGetRejectedAccounts(200, emptyMockData);
    interceptCAVGetToReviewAccounts(200, emptyMockData);
    interceptCAVGetDeletedAccounts(200, emptyMockData);
    interceptCAVGetFailedAccounts(200, emptyMockData);

    setupComponent();

    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');

    cy.get(DOM_ELEMENTS.navigationLinks).each((link, index) => {
      const expectedLink = NAVIGATION_LINKS[index];
      cy.wrap(link).should('contain', expectedLink);
      if (expectedLink === 'To review') {
        cy.wrap(link).should('have.attr', 'aria-current', 'page');
      } else {
        cy.wrap(link).should('not.have.attr', 'aria-current', 'page');
      }
    });

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
      if (link === 'To review') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page');
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).click();
        cy.get(DOM_ELEMENTS.statusHeading).should('have.text', 'To review');
        cy.get('p').should('exist').and('contain', 'There are no accounts to review');
      }
      //the below two verifications covered as part of PO-593
      if (link === 'Rejected') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', '');
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).click();
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page');
        cy.get(DOM_ELEMENTS.statusHeading).should('have.text', 'Rejected');
        cy.get('p').should('exist').and('contain', 'There are no rejected accounts');
      }
      if (link === 'Deleted') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', '');
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).click();
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page');
        cy.get(DOM_ELEMENTS.statusHeading).should('have.text', 'Deleted');
        cy.get('p').should('exist').and('contain', 'No accounts have been deleted in the past 7 days.');
      }
      if (link === 'Failed') {
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', '');
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).click();
        cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('have.attr', 'aria-current', 'page');
        cy.get(DOM_ELEMENTS.statusHeading).should('have.text', 'Failed');
        cy.get('p').should('exist').and('contain', 'There are no failed accounts');
      }
    }
  });

  it('(AC.2) should display the Failed tab correctly when there are zero draft records', { tags: ['@PO-1059'] }, () => {
    const emptyMockData = { count: 0, summaries: [] };

    interceptCAVGetRejectedAccounts(200, emptyMockData);
    interceptCAVGetToReviewAccounts(200, emptyMockData);
    interceptCAVGetDeletedAccounts(200, emptyMockData);
    interceptCAVGetFailedAccounts(200, emptyMockData);

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Failed').click();

    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Failed');
    cy.get('p').should('exist').and('contain', 'There are no failed accounts');
    cy.get(DOM_ELEMENTS.table).should('not.exist');

    cy.get(DOM_ELEMENTS.failedCountIcon).should('not.exist');
  });

  it('(AC.2c) should display the Failed account count for 1-99 accounts', { tags: ['@PO-1059'] }, () => {
    const count = [1, 2, 30, 49, 80, 99];
    cy.wrap(count).each((accountCount) => {
      interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
      interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
      interceptCAVGetDeletedAccounts(200, { count: 0, summaries: [] });
      interceptCAVGetFailedAccounts(200, { count: accountCount, summaries: [] });

      setupComponent();

      cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Failed').click();
      cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Failed');

      cy.get(DOM_ELEMENTS.failedCountIcon).should('exist');
      cy.get(DOM_ELEMENTS.failedCountIcon).should('contain', accountCount.toString());
    });
  });

  it('(AC.2c) should display the Failed account count for 99+ accounts', { tags: ['@PO-1059'] }, () => {
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetFailedAccounts(200, { count: 100, summaries: [] });

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Failed').click();
    cy.get(DOM_ELEMENTS.statusHeading).should('exist').and('contain', 'Failed');

    cy.get(DOM_ELEMENTS.failedCountIcon).should('exist');
    cy.get(DOM_ELEMENTS.failedCountIcon).should('contain', '99+');
  });

  it('(AC.3) should display the Failed tab correctly when there are draft records', { tags: ['@PO-1059'] }, () => {
    const failedMockData = structuredClone(OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK);
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetFailedAccounts(200, failedMockData);

    //Get the test user and business unit from the mock data
    const testUser = DRAFT_SESSION_USER_STATE_MOCK.business_unit_user[0].business_unit_user_id;
    const businessUnitId = DRAFT_SESSION_USER_STATE_MOCK.business_unit_user[0].business_unit_id;

    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Failed').click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Review accounts');
    cy.get(DOM_ELEMENTS.table).should('exist');

    //Ensure the request created by the frontend is correct
    cy.get('@getToReviewAccounts').then((interception: any) => {
      expect(interception.request.url).to.include(`business_unit=${businessUnitId}`);
      expect(interception.request.url).to.include(`not_submitted_by=${testUser}`);
    });

    //Check table headings
    cy.get(DOM_ELEMENTS.tableHeadings).each((heading, index) => {
      const expectedHeading = TABLE_HEADINGS_FAILED[index];
      cy.wrap(heading).should('contain', expectedHeading);
    });
  });

  it('(AC.4a) should have default sort order for created accounts set to ascending', { tags: ['@PO-1059'] }, () => {
    const failedMockData = structuredClone(OPAL_FINES_DRAFT_VALIDATE_ACCOUNTS_MOCK);
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetFailedAccounts(200, failedMockData);

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Failed').click();

    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Date failed').should('have.attr', 'aria-sort', 'ascending');

    //Check table row data in row 1
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.dob).contains('—');
        cy.get(DOM_ELEMENTS.changed).contains('4 days ago');
        cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });

    //Check table row data in row 2
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.changed).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains('Fine');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });

    cy.get(DOM_ELEMENTS.tableHeadings).contains('Date failed').click();
    cy.get(DOM_ELEMENTS.tableHeadings).contains('th', 'Date failed').should('have.attr', 'aria-sort', 'descending');

    cy.get(DOM_ELEMENTS.tableRow)
      .eq(0)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('DOE, John');
        cy.get(DOM_ELEMENTS.dob).contains('15 May 1990');
        cy.get(DOM_ELEMENTS.changed).contains('Today');
        cy.get(DOM_ELEMENTS.accountType).contains('Fine');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit A');
      });
    cy.get(DOM_ELEMENTS.tableRow)
      .eq(1)
      .within(() => {
        cy.get(DOM_ELEMENTS.defendant).contains('SMITH, Jane');
        cy.get(DOM_ELEMENTS.dob).contains('—');
        cy.get(DOM_ELEMENTS.changed).contains('4 days ago');
        cy.get(DOM_ELEMENTS.accountType).contains('Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).contains('Business Unit B');
      });
  });

  it('(AC.4b) should have pagination for over 25 accounts', { tags: ['@PO-1059'] }, () => {
    const failedMockData = structuredClone(OPAL_FINES_VALIDATE_OVER_25_DRAFT_ACCOUNTS_MOCK);
    interceptCAVGetRejectedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetToReviewAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetDeletedAccounts(200, { count: 0, summaries: [] });
    interceptCAVGetFailedAccounts(200, failedMockData);

    setupComponent();

    cy.get(DOM_ELEMENTS.navigationLinks).contains('To review').click();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Failed').click();

    cy.get(DOM_ELEMENTS.tableCaption).contains('Showing 1 to 25 of 50 results').should('exist');
    cy.get(DOM_ELEMENTS.paginationPageNumber(1)).should('exist');
    cy.get(DOM_ELEMENTS.paginationPageNumber(2)).should('exist');
    cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').should('exist');
    cy.get(DOM_ELEMENTS.defendant).eq(24).contains('Robert Brown').should('exist');

    cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
    cy.get(DOM_ELEMENTS.tableCaption).contains('Showing 26 to 50 of 50 results').should('exist');

    cy.get(DOM_ELEMENTS.defendant).eq(24).contains('Emma Gonzalez').should('exist');
    cy.get(DOM_ELEMENTS.paginationLinks).contains('Previous').should('exist');

    cy.get(DOM_ELEMENTS.defendant)
      .its('length')
      .then((count) => {
        expect(count).to.be.eq(25);
      });
  });
});
