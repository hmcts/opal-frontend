import { mount } from 'cypress/angular';
import { FinesDraftCamInputterComponent } from 'src/app/flows/fines/fines-draft/fines-draft-cam/fines-draft-cam-inputter/fines-draft-cam-inputter.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './mocks/fines-draft-account.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacPayloadService } from 'src/app/flows/fines/fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { FinesDraftStore } from 'src/app/flows/fines/fines-draft/stores/fines-draft.store';
import { DateService } from '@services/date-service/date.service';
import { DRAFT_SESSION_USER_STATE_MOCK } from './mocks/fines-draft-session-mock';
import { routes } from './constants/fines_draft_cam_inputter_routes';
import { DOM_ELEMENTS } from './constants/fines_draft_cam_inputter_elements';
import { NAVIGATION_LINKS, TABLE_HEADINGS } from './constants/fines_draft_cam_inputter_tableConstants';

describe('FinesDraftCamInputterComponent', () => {
  let mockData: any = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
  const setupComponent = () => {
    mount(FinesDraftCamInputterComponent, {
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
  };

  beforeEach(() => {
    cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Rejected*', {
      statusCode: 200,
      body: mockData,
    }).as('getRejectedAccounts');

    cy.intercept(
      'GET',
      '*opal-fines-service/draft-accounts?business_unit=77&status=Submitted&status=Resubmitted&submitted_by=L073JG',
      {
        statusCode: 200,
        body: mockData,
      },
    ).as('getInReviewAccounts');

    cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Approved*', {
      statusCode: 200,
      body: mockData,
    }).as('getApprovedAccounts');

    cy.intercept('GET', '*opal-fines-service/draft-accounts?business_unit=77&status=Deleted*', {
      statusCode: 200,
      body: mockData,
    }).as('getDeletedAccounts');
  });

  it('should render component', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.app).should('exist');
  });

  it('should render all elments in the component for all links', () => {
    cy.wrap(NAVIGATION_LINKS).each((link) => {
      cy.then(() => {
        setupComponent();
        cy.get(DOM_ELEMENTS.navigationLinks)
          .contains('' + link)
          .click();
        cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

        for (const link of NAVIGATION_LINKS) {
          cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
        }

        cy.get(DOM_ELEMENTS.satusHeading)
          .should('exist')
          .and('contain', '' + link);

        for (const heading of TABLE_HEADINGS) {
          cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');
        }
        cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'John Doe');
        cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '15 May 1990');
        cy.get(DOM_ELEMENTS.created).should('exist').and('contain', '800 days ago');
        cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fine');
        cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit A');

        cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'Jane Smith');
        cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '—');
        cy.get(DOM_ELEMENTS.created).should('exist').and('contain', '800 days ago');
        cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fixed Penalty');
        cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit B');
      });
    });
  });

  it('should show number of rejected accounts in a icon dependant on count variable on rejected status', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.rejectedIcon).should('exist').and('contain', '2');
    mockData = {
      count: 0,
      summaries: [],
    };
  });

  it('should show empty value statement for In Review status when no accounts have been submitted/resubmitted', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();
    cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'In review');
    cy.get('p').should('exist').and('contain', 'You have no accounts in review.');
    cy.get(DOM_ELEMENTS.table).should('not.exist');
    mockData = {
      count: 0,
      summaries: [],
    };
  });

  it('should show empty value statement for Rejected status when no accounts have been Rejected', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Rejected').click();
    cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'Rejected');
    cy.get('p').should('exist').and('contain', 'You have no rejected accounts.');
    cy.get('p').should('exist').and('contain', 'To resubmit accounts for other team members, you can');
    cy.get('a.govuk-link').should('exist').and('contain', 'view all rejected accounts');

    cy.get(DOM_ELEMENTS.table).should('not.exist');
    mockData = {
      count: 0,
      summaries: [],
    };
  });

  it('should show empty value statement for Approved status when no accounts have been Approved', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();
    cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'Approved');
    cy.get('p').should('exist').and('contain', 'No accounts have been approved in the past 7 days.');
    cy.get(DOM_ELEMENTS.table).should('not.exist');
    mockData = {
      count: 0,
      summaries: [],
    };
  });

  it('should show empty value statement for Deleted status when no accounts have been Deleted', () => {
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks).contains('Deleted').click();
    cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'Deleted');
    cy.get('p').should('exist').and('contain', 'No accounts have been deleted in the past 7 days.');
    cy.get(DOM_ELEMENTS.table).should('not.exist');
  });
});
