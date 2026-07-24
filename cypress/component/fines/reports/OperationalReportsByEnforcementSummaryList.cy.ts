import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { mount } from 'cypress/angular';
import { BehaviorSubject, of } from 'rxjs';

import { FinesReportsSummaryListComponent } from 'src/app/flows/fines/fines-reports/fines-reports-summary-list/fines-reports-summary-list.component';
import { OpalFines } from 'src/app/flows/fines/services/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ReportsSummaryListLocators as L } from '../../../shared/selectors/reports-summary-list.locators';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from 'src/app/flows/fines/services/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import {
  OPERATIONAL_REPORT_BY_ENFORCEMENT_INSTANCES_MOCK,
  OPERATIONAL_REPORT_BY_ENFORCEMENT_METADATA_MOCK,
  OPERATIONAL_REPORT_BY_ENFORCEMENT_NO_INSTANCES_MOCK,
  OPERATIONAL_REPORT_BY_ENFORCEMENT_OVER_LIMIT_MOCK,
  OPERATIONAL_REPORT_BY_ENFORCEMENT_PAGINATED_INSTANCES_MOCK,
} from './mocks/operational-reports-by-enforcement-summary-list.mock';

const REPORT_ID = OPERATIONAL_REPORT_BY_ENFORCEMENT_METADATA_MOCK.report_id;

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
  reportMetadata: OPERATIONAL_REPORT_BY_ENFORCEMENT_METADATA_MOCK,
  reportInstances: OPERATIONAL_REPORT_BY_ENFORCEMENT_INSTANCES_MOCK,
};

describe(
  'Operational reports by enforcement summary list',
  { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
  () => {
    const setupComponent = (reportInstances = OPERATIONAL_REPORT_BY_ENFORCEMENT_INSTANCES_MOCK) => {
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
      'AC1a and AC1b: shows the Operational reports by enforcement summary list',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.pageHeader).should('be.visible').and('have.text', 'Operational reports (by enforcement)');
        cy.get(L.table.root).should('be.visible');
        cy.get(L.table.rows).should('have.length', 3);
      },
    );

    it(
      'AC2: shows report date and time, title, business unit, creator and status',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
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

        cy.get(L.table.dateTime(0)).should('contain.text', '21 Jul 2026 at');
        cy.get(L.table.title(0)).should('contain.text', 'Operational report (by enforcement) - CLAMPO - Detailed');
        cy.get(L.table.businessUnit(0)).should('contain.text', 'London Central & South East');
        cy.get(L.table.createdBy(0)).should('contain.text', 'Olivia Smith');
        cy.get(L.table.status(0)).should('contain.text', 'Ready');
      },
    );

    it('AC3: shows a Requested report as In progress', { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] }, () => {
      setupComponent();

      cy.get(L.table.status(1)).should('contain.text', 'In progress');
    });

    it(
      'AC4: shows a Ready report with no records as No content',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.table.status(2)).should('contain.text', 'No content');
      },
    );

    it(
      'AC5 and AC5a: lists reports by newest date first and toggles to oldest first',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        assertColumnOrder(L.table.dateTime, ['21 Jul 2026 at', '20 Jul 2026 at', '19 Jul 2026 at']);

        sortBy('Date and time');

        assertColumnOrder(L.table.dateTime, ['19 Jul 2026 at', '20 Jul 2026 at', '21 Jul 2026 at']);
      },
    );

    it(
      'AC5b: sorts Title in ascending and descending order',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        sortBy('Title');

        assertColumnOrder(L.table.title, ['CLAMPO', 'Empty', 'No actions']);

        sortBy('Title');

        assertColumnOrder(L.table.title, ['No actions', 'Empty', 'CLAMPO']);
      },
    );

    it(
      'AC5b: sorts Business unit in ascending and descending order',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        sortBy('Business unit');

        assertColumnOrder(L.table.businessUnit, ['London Central & South East', 'London North West', 'Multiple']);

        sortBy('Business unit');

        assertColumnOrder(L.table.businessUnit, ['Multiple', 'London North West', 'London Central & South East']);
      },
    );

    it(
      'AC5b: sorts Created by in ascending and descending order',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        sortBy('Created by');

        assertColumnOrder(L.table.createdBy, ['James Brown', 'Olivia Smith', 'Sarah Johnson']);

        sortBy('Created by');

        assertColumnOrder(L.table.createdBy, ['Sarah Johnson', 'Olivia Smith', 'James Brown']);
      },
    );

    it(
      'AC5b: sorts Status in ascending and descending order',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        sortBy('Status');

        assertColumnOrder(L.table.status, ['In progress', 'No content', 'Ready']);

        sortBy('Status');

        assertColumnOrder(L.table.status, ['Ready', 'No content', 'In progress']);
      },
    );

    // AC6a–d require permission-filtered API data and will be covered by a follow-up E2E test.
    it(
      'AC6: defaults the business unit filter to All business units',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.businessUnitAutocomplete).should('be.visible').and('have.value', 'All business units');
        cy.get(L.filters.businessUnit).should('have.value', 'all');
      },
    );

    // AC7a–b require API/E2E data to verify the returned results;
    it(
      'AC7: lists all resolved business units in the filter dropdown',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.businessUnitAutocomplete).clear().click();
        cy.get(L.filters.businessUnitOptions).should('have.length', 8);
        cy.contains(L.filters.businessUnitOptions, 'All business units').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'Historical Debt').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'London Central & South East').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'London Confiscation Orders').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'London North East').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'London North West').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'London South West').should('be.visible');
        cy.contains(L.filters.businessUnitOptions, 'MBEC London').should('be.visible');
      },
    );

    // This test covers only that Refresh sends the selected BU ID, not the returned results from API
    it(
      'AC7c: applies the selected business unit when Refresh is selected',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.businessUnitAutocomplete).clear().type('London Central & South East');
        cy.contains(L.filters.businessUnitOptions, 'London Central & South East').click();
        cy.get(L.filters.businessUnit).should('have.value', '67');

        cy.get(L.filters.refreshButton).click();

        cy.get('@getReportInstances')
          .should('have.been.calledOnce')
          .its('firstCall.args.0')
          .should('deep.include', {
            report_id: REPORT_ID,
            business_units: ['67'],
          });
      },
    );

    // AC8a requires API/E2E data to verify returned reports; this test covers the default selection and date-range request.
    it(
      'AC8: defaults to Last 7 days and requests an inclusive date-only seven-day range on Refresh',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        cy.clock(Date.UTC(2026, 6, 24, 12));
        setupComponent();

        cy.get(L.filters.last7Days).should('be.checked');

        cy.get(L.filters.refreshButton).click();

        cy.get('@getReportInstances').should('have.been.calledOnce').its('firstCall.args.0').should('deep.include', {
          report_id: REPORT_ID,
          from_date: '2026-07-18',
          to_date: '2026-07-24',
        });
      },
    );

    it(
      'AC9a, AC9b and AC9d: shows Days and validates numeric and required values',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.customDays).click();
        cy.get(L.filters.days).should('be.visible').and('have.attr', 'inputmode', 'numeric');

        cy.get(L.filters.days).type('three');
        cy.get(L.filters.refreshButton).click();
        cy.contains(L.filters.form, 'Enter number of days').should('be.visible');

        cy.get(L.filters.days).clear();
        cy.get(L.filters.refreshButton).click();
        cy.contains(L.filters.form, 'Enter number of days').should('be.visible');
      },
    );

    // AC9c requires API/E2E data to verify returned reports; this test covers the inclusive date-only request range.
    it(
      'AC9c: requests the selected number of inclusive days on Refresh',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.customDays).check();
        cy.get(L.filters.days).type('3');

        cy.clock(Date.UTC(2026, 6, 24, 12));
        cy.get(L.filters.refreshButton).click();

        cy.get('@getReportInstances').should('have.been.calledOnce').its('firstCall.args.0').should('deep.include', {
          report_id: REPORT_ID,
          from_date: '2026-07-22',
          to_date: '2026-07-24',
        });
      },
    );

    it(
      'AC9e: hides and clears Days when a different date filter is selected',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.customDays).click();
        cy.get(L.filters.days).type('3');

        cy.get(L.filters.last7Days).click();
        cy.get(L.filters.days).should('not.exist');

        cy.get(L.filters.customDays).click();
        cy.get(L.filters.days).should('have.value', '');
      },
    );

    it(
      'AC10a and AC10b: shows date fields and allows a date to be entered or selected using the calendar',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();

        cy.get(L.filters.dateFrom).should('be.visible').type('01/07/2026');
        cy.get(L.filters.dateTo).should('be.visible').type('03/07/2026');

        cy.get(L.filters.dateFrom).closest('.moj-datepicker').find(L.filters.datePickerButton).click();

        cy.get(L.filters.datePickerDialogHeader).should('be.visible');
      },
    );

    // AC10c requires API/E2E data to verify returned reports; this test covers the frontend request range.
    it(
      'AC10c: sends the entered date range when Refresh is selected',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateFrom).type('01/07/2026');
        cy.get(L.filters.dateTo).type('03/07/2026');
        cy.get(L.filters.refreshButton).click();

        cy.get('@getReportInstances').should('have.been.calledOnce').its('firstCall.args.0').should('deep.include', {
          report_id: REPORT_ID,
          from_date: '2026-07-01',
          to_date: '2026-07-03',
        });
      },
    );

    // AC10d requires API/E2E data to verify all past reports are returned; this test covers the open start-date request.
    it(
      'AC10d: sends no from date when only date to is entered',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateTo).type('03/07/2026');
        cy.get(L.filters.refreshButton).click();

        cy.get('@getReportInstances').should('have.been.calledOnce').its('firstCall.args.0').should('deep.include', {
          report_id: REPORT_ID,
          from_date: null,
          to_date: '2026-07-03',
        });
      },
    );

    // AC10e requires API/E2E data to verify all future reports are returned; this test covers the open end-date request.
    it(
      'AC10e: sends no to date when only date from is entered',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateFrom).type('01/07/2026');
        cy.get(L.filters.refreshButton).click();

        cy.get('@getReportInstances').should('have.been.calledOnce').its('firstCall.args.0').should('deep.include', {
          report_id: REPORT_ID,
          from_date: '2026-07-01',
          to_date: null,
        });
      },
    );

    it(
      'AC10f: shows an error when neither date is entered',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.refreshButton).click();

        cy.contains(L.filters.form, 'You must enter at least 1 of date from or date to').should('be.visible');
        cy.get('@getReportInstances').should('not.have.been.called');
      },
    );

    it(
      'AC10g: shows an error when Date from is after Date to',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateFrom).type('03/07/2026');
        cy.get(L.filters.dateTo).type('01/07/2026');
        cy.get(L.filters.refreshButton).click();
        cy.contains(L.filters.form, 'The Date from cannot be after the Date to').should('be.visible');
        cy.get('@getReportInstances').should('not.have.been.called');
      },
    );

    it(
      'AC10h: shows an error for an invalid date format',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateFrom).type('2026-07-01');
        cy.get(L.filters.refreshButton).click();

        cy.contains(L.filters.form, 'Date must be in the format DD/MM/YYYY').should('be.visible');
        cy.get('@getReportInstances').should('not.have.been.called');
      },
    );

    it('AC10i: shows an error for a future date', { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] }, () => {
      setupComponent();

      cy.get(L.filters.dateRange).check();
      cy.get(L.filters.dateFrom).type('31/12/2099');
      cy.get(L.filters.refreshButton).click();

      cy.contains(L.filters.form, 'Date cannot be in the future').should('be.visible');
      cy.get('@getReportInstances').should('not.have.been.called');
    });

    it(
      'AC10j: hides and clears date fields when a different date filter is selected',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateFrom).type('01/07/2026');
        cy.get(L.filters.dateTo).type('03/07/2026');

        cy.get(L.filters.last7Days).check();
        cy.get(L.filters.dateFrom).should('not.exist');
        cy.get(L.filters.dateTo).should('not.exist');

        cy.get(L.filters.dateRange).check();
        cy.get(L.filters.dateFrom).should('have.value', '');
        cy.get(L.filters.dateTo).should('have.value', '');
      },
    );

    it(
      'AC11: shows 25 reports per page and provides pagination for further reports',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent(OPERATIONAL_REPORT_BY_ENFORCEMENT_PAGINATED_INSTANCES_MOCK);

        cy.get(L.table.rows).should('have.length', 25);
        cy.get(L.pagination).should('be.visible');
        cy.get(L.paginationResults).should('have.text', 'Showing 1 to 25 of 26 total results');

        cy.get(L.paginationNext).click();

        cy.get(L.table.rows).should('have.length', 1);
        cy.get(L.paginationResults).should('have.text', 'Showing 26 to 26 of 26 total results');
      },
    );

    it(
      'AC12: shows No reports found when there are no reports',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent(OPERATIONAL_REPORT_BY_ENFORCEMENT_NO_INSTANCES_MOCK);

        cy.get(L.noReportsFound).should('be.visible').and('have.text', 'No reports found');
        cy.get(L.table.root).should('not.exist');
      },
    );

    it(
      'AC13: shows the result-limit message when more reports exist than the configured maximum',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent(OPERATIONAL_REPORT_BY_ENFORCEMENT_OVER_LIMIT_MOCK);

        cy.get(L.resultLimitHeading).should('be.visible').and('have.text', 'There are more than 100 reports');
        cy.contains(L.page, 'Use the filters to reduce the number of results.').should('be.visible');
        cy.get(L.table.root).should('not.exist');
      },
    );

    it(
      'AC14: gives Refresh the required accessible name',
      { tags: ['@JIRA-STORY:PO-2307', '@JIRA-EPIC:PO-2248'] },
      () => {
        setupComponent();

        cy.get(L.filters.refreshButton).should('have.attr', 'aria-label', 'Apply filters and refresh');
      },
    );
  },
);
