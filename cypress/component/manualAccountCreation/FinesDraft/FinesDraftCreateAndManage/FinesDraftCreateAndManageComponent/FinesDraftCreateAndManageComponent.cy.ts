import { mount } from 'cypress/angular';
import { FinesDraftCheckAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-manage/fines-draft-check-and-manage-tabs/fines-draft-check-and-manage-tabs.component';
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
import { OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK } from './mocks/fines_draft_over_25_account_mock';

describe('FinesDraftCheckAndManageTabsComponent', () => {
  let mockData: any = OPAL_FINES_DRAFT_ACCOUNTS_MOCK;
  const dateService = new DateService();

  const setupComponent = () => {
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

  it('(AC.3,AC.4)should show summary table with correct data for In review accounts', { tags: ['@PO-584'] }, () => {
    setupComponent();
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks)
      .contains('' + NAVIGATION_LINKS[0])
      .click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
    }

    cy.get(DOM_ELEMENTS.satusHeading)
      .should('exist')
      .and('contain', '' + NAVIGATION_LINKS[0]);

    for (const heading of TABLE_HEADINGS) {
      cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');
    }
    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '15 May 1990');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fine');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit A');

    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'Jane Smith');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '—');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[1].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit B');
    mockData = OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK;
  });

  it(
    '(AC.5)should have pagination enabled for over 25 draft accounts for In Review accounts',
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

  it(
    '(AC.5) should have default sort order for created accounts set to descending for In review',
    { tags: ['@PO-584'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[0])
        .click();
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
      cy.get(DOM_ELEMENTS.created)
        .first()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
        );
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.created)
        .last()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[9].account_snapshot.created_date)}`,
        );
    },
  );

  it('(AC.3,AC.4)should show summary table with correct data for rejected accounts', { tags: ['@PO-605'] }, () => {
    setupComponent();
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks)
      .contains('' + NAVIGATION_LINKS[1])
      .click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
    }

    cy.get(DOM_ELEMENTS.satusHeading)
      .should('exist')
      .and('contain', '' + NAVIGATION_LINKS[1]);

    for (const heading of TABLE_HEADINGS) {
      cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');
    }
    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '15 May 1990');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fine');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit A');

    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'Jane Smith');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '—');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[1].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit B');
    mockData = OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK;
  });

  it(
    '(AC.5)should have pagination enabled for over 25 draft accounts for rejected accounts',
    { tags: ['@PO-605'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[1])
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
    '(AC.5) should have default sort order for created accounts set to descending for Rejected',
    { tags: ['@PO-605'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[1])
        .click();
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
      cy.get(DOM_ELEMENTS.created)
        .first()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
        );
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.created)
        .last()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[9].account_snapshot.created_date)}`,
        );
    },
  );

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

    cy.get(DOM_ELEMENTS.satusHeading)
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
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fine');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit A');

    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'Jane Smith');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '—');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[1].account_snapshot.created_date)}`,
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
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
        );
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.created)
        .last()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[9].account_snapshot.created_date)}`,
        );
    },
  );

  it('(AC.3,AC.4)should show summary table with correct data for deleted accounts', { tags: ['@PO-609'] }, () => {
    setupComponent();
    setupComponent();
    cy.get(DOM_ELEMENTS.navigationLinks)
      .contains('' + NAVIGATION_LINKS[3])
      .click();
    cy.get(DOM_ELEMENTS.heading).should('exist').and('contain', 'Create accounts');

    for (const link of NAVIGATION_LINKS) {
      cy.get(DOM_ELEMENTS.navigationLinks).contains(link).should('exist');
    }

    cy.get(DOM_ELEMENTS.satusHeading)
      .should('exist')
      .and('contain', '' + NAVIGATION_LINKS[3]);

    for (const heading of TABLE_HEADINGS) {
      cy.get(DOM_ELEMENTS.tableHeadings).contains(heading).should('exist');
    }
    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'John Doe');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '15 May 1990');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fine');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit A');

    cy.get(DOM_ELEMENTS.defendant).should('exist').and('contain', 'Jane Smith');
    cy.get(DOM_ELEMENTS.dob).should('exist').and('contain', '—');
    cy.get(DOM_ELEMENTS.created)
      .should('exist')
      .and(
        'contain',
        `${dateService.getDaysAgoString(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.summaries[1].account_snapshot.created_date)}`,
      );
    cy.get(DOM_ELEMENTS.accountType).should('exist').and('contain', 'Fixed Penalty');
    cy.get(DOM_ELEMENTS.businessUnit).should('exist').and('contain', 'Business Unit B');
    mockData = OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK;
  });

  it(
    '(AC.5)should have pagination enabled for over 25 draft accounts for deleted accounts',
    { tags: ['@PO-609'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[3])
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
    '(AC.5) should have default sort order for created accounts set to descending for Deleted',
    { tags: ['@PO-609'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks)
        .contains('' + NAVIGATION_LINKS[3])
        .click();
      cy.get(DOM_ELEMENTS.tableHeadings).contains('Created').should('exist');
      cy.get(DOM_ELEMENTS.created)
        .first()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[0].account_snapshot.created_date)}`,
        );
      cy.get(DOM_ELEMENTS.paginationLinks).contains('Next').click({ force: true });
      cy.get(DOM_ELEMENTS.created)
        .last()
        .contains(
          `${dateService.getDaysAgoString(OPAL_FINES_OVER_25_DRAFT_ACCOUNTS_MOCK.summaries[9].account_snapshot.created_date)}`,
        );
    },
  );

  it('(AC.1) should display number of rejected accounts in a icon on values of 1-99', { tags: ['@PO-605'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.rejectedIcon).should('exist').and('contain', '2');

    mockData = {
      count: 0,
      summaries: [],
    };
  });

  it(
    '(AC.1) Should not display notifications or rejected account tab when rejected account equals 0',
    { tags: ['@PO-605'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.rejectedIcon).should('not.exist');
      mockData = {
        count: 105,
        summaries: [],
      };
    },
  );

  it('(AC.1) should display rejected icon count up to 99 then after display 99+', { tags: ['@PO-605'] }, () => {
    setupComponent();

    cy.get(DOM_ELEMENTS.rejectedIcon).should('exist').and('contain', '99+');
  });

  it(
    '(AC.2) should show empty value statement for In Review status when no accounts have been submitted/resubmitted',
    { tags: ['@PO-584'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('In review').click();
      cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'In review');
      cy.get('p').should('exist').and('contain', 'You have no accounts in review.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
      mockData = {
        count: 0,
        summaries: [],
      };
    },
  );

  it(
    '(AC.2) should show empty value statement for Rejected status when no accounts have been Rejected',
    { tags: ['@PO-605'] },
    () => {
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
    },
  );

  it(
    '(AC.1)should show empty value statement for Approved status when no accounts have been Approved',
    { tags: ['@PO-607'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Approved').click();
      cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'Approved');
      cy.get('p').should('exist').and('contain', 'No accounts have been approved in the past 7 days.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
      mockData = {
        count: 0,
        summaries: [],
      };
    },
  );

  it(
    '(AC.1)should show empty value statement for Deleted status when no accounts have been Deleted',
    { tags: ['@PO-584'] },
    () => {
      setupComponent();
      cy.get(DOM_ELEMENTS.navigationLinks).contains('Deleted').click();
      cy.get(DOM_ELEMENTS.satusHeading).should('exist').and('contain', 'Deleted');
      cy.get('p').should('exist').and('contain', 'No accounts have been deleted in the past 7 days.');
      cy.get(DOM_ELEMENTS.table).should('not.exist');
    },
  );
});
