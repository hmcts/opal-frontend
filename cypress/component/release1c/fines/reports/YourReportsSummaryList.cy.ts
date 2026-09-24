import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { mount } from 'cypress/angular';
import { BehaviorSubject, of } from 'rxjs';

import { FinesReportsSummaryListComponent } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/fines-reports-summary-list.component';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ReportsSummaryListLocators as L } from '../../../../shared/selectors/reports-summary-list.locators';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import {
  YOUR_REPORTS_INSTANCES_MOCK,
  YOUR_REPORTS_NO_INSTANCES_MOCK,
  YOUR_REPORTS_OVER_LIMIT_MOCK,
} from './mocks/your-reports-summary-list.mock';

const REPORT_ID = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports;

type MockActivatedRoute = {
  snapshot: {
    paramMap: ReturnType<typeof convertToParamMap>;
    data: typeof routeData;
  };
  paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  data: BehaviorSubject<typeof routeData>;
  parent: {
    snapshot: {
      paramMap: ReturnType<typeof convertToParamMap>;
    };
    paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  };
};

const routeData = {
  businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
  reportMetadata: null,
  reportInstances: YOUR_REPORTS_INSTANCES_MOCK,
};

describe('Your reports summary list', { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] }, () => {
  const setupComponent = (reportInstances = YOUR_REPORTS_INSTANCES_MOCK) => {
    const getReportInstances = cy.stub().returns(of(reportInstances));
    const componentRouteData = { ...routeData, reportInstances };
    cy.wrap(getReportInstances).as('getReportInstances');
    const activatedRoute: MockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({}),
        data: componentRouteData,
      },
      paramMap: new BehaviorSubject(convertToParamMap({})),
      data: new BehaviorSubject(componentRouteData),
      parent: {
        snapshot: {
          paramMap: convertToParamMap({ reportTypeId: REPORT_ID }),
        },
        paramMap: new BehaviorSubject(convertToParamMap({ reportTypeId: REPORT_ID })),
      },
    };

    return mount(FinesReportsSummaryListComponent, {
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: OpalFines,
          useValue: {
            getReportInstances,
          },
        },
        {
          provide: GlobalStore,
          useValue: {
            userState: () => OPAL_USER_STATE_MOCK,
          },
        },
      ],
    });
  };

  const sortBy = (columnName: string) => cy.contains(L.table.headings, columnName).find('button').click();

  const assertColumnOrder = (cellLocator: (rowIndex: number) => string, expectedValues: string[]) => {
    expectedValues.forEach((expectedValue, rowIndex) => {
      cy.get(cellLocator(rowIndex)).should('contain.text', expectedValue);
    });
  };

  it(
    'AC1a AC1b AC1c: shows the Your reports summary list heading and number of results',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      cy.get(L.pageHeader).should('be.visible').and('have.text', 'Your reports');
      cy.get(L.table.root).should('be.visible');
      cy.get(L.table.rows).should('have.length', 3);
      cy.get(L.table.resultsCount).should('contain.text', 'Showing 3 results');
    },
  );

  it(
    'AC2: shows report date and time, title, business unit, creator and status',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      cy.get(L.table.headings).then(($headings) => {
        const headingText = Cypress.$.makeArray($headings).map((heading) => heading.textContent?.trim());

        expect(headingText).to.deep.equal([
          'Date and time',
          'Title',
          'Business unit',
          'Created by',
          'Status',
          'Action',
        ]);
      });

      cy.get(L.table.dateTime(0)).should('contain.text', '21 Aug 2026 at');
      cy.get(L.table.title(0)).should('contain.text', 'My report 1');
      cy.get(L.table.businessUnit(0)).should('contain.text', 'London Central & South East');
      cy.get(L.table.createdBy(0)).should('contain.text', 'Current user');
      cy.get(L.table.status(0)).should('contain.text', 'Ready');
    },
  );

  it(
    'AC3: lists reports by newest date first and toggles date sorting',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      assertColumnOrder(L.table.dateTime, ['21 Aug 2026 at', '20 Aug 2026 at', '19 Aug 2026 at']);

      sortBy('Date and time');

      assertColumnOrder(L.table.dateTime, ['19 Aug 2026 at', '20 Aug 2026 at', '21 Aug 2026 at']);
    },
  );

  it(
    'AC3b: sorts Title, Business unit and Status in ascending and descending order',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      sortBy('Title');
      assertColumnOrder(L.table.title, ['My report 1', 'My report 2', 'My report 3']);

      sortBy('Title');
      assertColumnOrder(L.table.title, ['My report 3', 'My report 2', 'My report 1']);

      sortBy('Business unit');
      assertColumnOrder(L.table.businessUnit, ['London Central & South East', 'London North West', 'Multiple']);

      sortBy('Business unit');
      assertColumnOrder(L.table.businessUnit, ['Multiple', 'London North West', 'London Central & South East']);

      sortBy('Status');
      assertColumnOrder(L.table.status, ['In progress', 'No content', 'Ready']);

      sortBy('Status');
      assertColumnOrder(L.table.status, ['Ready', 'No content', 'In progress']);
    },
  );

  it(
    'AC4 and AC6: defaults to all business units and last 7 days',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent();

      cy.get(L.filters.businessUnit).should('have.value', 'all');
      cy.get(L.filters.businessUnitAutocomplete).should('have.value', 'All business units');
      cy.get(L.filters.last7Days).should('be.checked');
      cy.get(L.filters.customDays).should('not.be.visible');
      cy.get(L.filters.dateRange).should('not.be.visible');
    },
  );

  it(
    'AC7d: shows an error when Refresh is clicked without a custom days value',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent(YOUR_REPORTS_NO_INSTANCES_MOCK);

      cy.get(L.filters.customDays).check({ force: true });
      cy.get(L.filters.days).should('be.visible');
      cy.get(L.filters.refreshButton).click();

      cy.get(L.filters.errorSummary).should('contain.text', 'Enter number of days');
    },
  );

  it(
    'AC8f AC8g AC8h AC8i: validates date range fields',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent(YOUR_REPORTS_NO_INSTANCES_MOCK);

      cy.get(L.filters.dateRange).check({ force: true });
      cy.get(L.filters.dateFrom).should('be.visible');
      cy.get(L.filters.dateTo).should('be.visible');

      cy.get(L.filters.refreshButton).click();
      cy.get(L.filters.errorSummary).should('contain.text', 'You must enter at least 1 of date from or date to');

      cy.get(L.filters.dateFrom).type('15/08/2026');
      cy.get(L.filters.dateTo).type('10/08/2026');
      cy.get(L.filters.refreshButton).click();
      cy.get(L.filters.errorSummary).should('contain.text', 'The Date from cannot be after the Date to');

      cy.get(L.filters.dateFrom).clear().type('invalid');
      cy.get(L.filters.dateTo).clear().type('15/08/2026');
      cy.get(L.filters.refreshButton).click();
      cy.get(L.filters.errorSummary).should('contain.text', 'Date must be in the format DD/MM/YYYY');

      cy.get(L.filters.dateFrom).clear().type('31/12/2099');
      cy.get(L.filters.dateTo).clear();
      cy.get(L.filters.refreshButton).click();
      cy.get(L.filters.errorSummary).should('contain.text', 'Date cannot be in the future');
    },
  );

  it(
    'AC10: shows No reports found when there are no reports',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent(YOUR_REPORTS_NO_INSTANCES_MOCK);

      cy.get(L.noReportsFound).should('be.visible').and('contain.text', 'No reports found');
    },
  );

  it(
    'AC11: shows the over-limit message when the backend reports more results than can be shown',
    { tags: ['@JIRA-STORY:PO-2314', '@JIRA-EPIC:PO-2248'] },
    () => {
      setupComponent(YOUR_REPORTS_OVER_LIMIT_MOCK);

      cy.get(L.resultLimitHeading).should('contain.text', 'There are more than 100 reports');
      cy.get(L.resultLimitHeading).next().should('contain.text', 'Use the filters to reduce the number of results.');
    },
  );
});
