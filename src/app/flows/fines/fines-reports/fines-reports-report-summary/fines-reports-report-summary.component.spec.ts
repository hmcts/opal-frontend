import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from './constants/fines-reports-report-summary-report-types.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY } from './constants/fines-reports-report-summary-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from './constants/fines-reports-report-summary-statuses.constant';
import { FinesReportsReportSummaryComponent } from './fines-reports-report-summary.component';
import { type IFinesReportsReportSummaryViewModel } from './interfaces/fines-reports-report-summary-view-model.interface';
import { mapFinesReportsReportInstanceToViewModel } from './utils/fines-reports-report-summary-map-view-model.utils';

describe('FinesReportsReportSummaryComponent', () => {
  const enforcementReportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
  const paymentsReportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments;
  const enforcementReportSummary = mapFinesReportsReportInstanceToViewModel(
    {
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      requested_at: '2025-10-17T09:30:00',
      status: {
        code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested,
        display_name: FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested],
      },
      business_units: [
        { business_unit_id: '1', business_unit_name: 'West London' },
        { business_unit_id: '2', business_unit_name: 'South London' },
      ],
      requested_by: {
        user_id: 1,
        name: 'jane.doe',
      },
      report_parameters: {
        reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
        includeAdult: true,
        includeYouth: true,
        minBalance: '120.50',
        maxBalance: '1000.00',
      },
    },
    enforcementReportTypeId,
  );
  const paymentsReportSummary = mapFinesReportsReportInstanceToViewModel(
    {
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      name: 'PYMT',
      number_of_records: 0,
      report: {
        ...OPAL_FINES_REPORT_INSTANCE_MOCK.report,
        id: paymentsReportTypeId,
      },
      report_parameters: {
        reportType: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
        includeAdult: true,
        includeCompany: true,
        accountStatus: 'CLOSED',
        collectionOrderChoice: 'WITH',
      },
    },
    paymentsReportTypeId,
  );
  const errorReportSummary = mapFinesReportsReportInstanceToViewModel(
    {
      ...OPAL_FINES_REPORT_INSTANCE_MOCK,
      status: {
        code: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
        display_name: FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[FINES_REPORTS_REPORT_SUMMARY_STATUSES.error],
      },
      errors: [
        {
          report_generation_error: 'Legacy report timed out',
          report_service: 'No response from reporting engine',
        },
        {
          report_generation_error: 'Reporting service connection was reset',
        },
      ],
    },
    enforcementReportTypeId,
  );

  const setup = async (
    reportTypeId = enforcementReportTypeId,
    reportSummary: IFinesReportsReportSummaryViewModel | null = enforcementReportSummary,
  ): Promise<{
    component: FinesReportsReportSummaryComponent;
    fixture: ComponentFixture<FinesReportsReportSummaryComponent>;
    mockRouter: { navigate: ReturnType<typeof vi.fn> };
  }> => {
    const reportParamMap = convertToParamMap({ reportTypeId });
    const mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [FinesReportsReportSummaryComponent],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ reportSummary }),
            snapshot: {
              data: {
                reportSummary,
              },
            },
            parent: {
              paramMap: of(reportParamMap),
              snapshot: {
                paramMap: reportParamMap,
              },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsReportSummaryComponent);
    const component = fixture.componentInstance;

    return { component, fixture, mockRouter };
  };

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should read the report type id from the parent route', async () => {
    const { component, fixture } = await setup();

    fixture.detectChanges();

    expect(component.reportTypeId).toBe(enforcementReportTypeId);
  });

  it('should render the enforcement report heading and back link', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational report (by enforcement) - ABDC - Summary',
    );
    expect(fixture.nativeElement.querySelector('.govuk-back-link')?.textContent.trim()).toBe('Back');
  });

  it('should use the report definition title for the page heading', async () => {
    const reportSummary = {
      ...enforcementReportSummary,
      reportTitle: 'Operational report (current title)',
    };
    const { fixture } = await setup(enforcementReportTypeId, reportSummary);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational report (current title) - ABDC - Summary',
    );
  });

  it('should render the resolved report summary data', async () => {
    const { fixture } = await setup(enforcementReportTypeId);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational report (by enforcement) - ABDC - Summary',
    );
    expect(fixture.nativeElement.textContent).toContain('17 Oct 2025 at 09:30');
    expect(fixture.nativeElement.textContent).toContain('Summary');
  });

  it('should render the payments report heading', async () => {
    const { fixture } = await setup(paymentsReportTypeId, paymentsReportSummary);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational report (by payments) - PYMT - Detail',
    );
  });

  it('should render the general and criteria sections for the selected report', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(pageText).toContain('General');
    expect(pageText).toContain('Status');
    expect(pageText).toContain('In progress');
    expect(pageText).toContain('Date Created');
    expect(pageText).toContain('17 Oct 2025 at 09:30');
    expect(pageText).toContain('Report criteria');
    expect(pageText).toContain('Report Type');
    expect(pageText).toContain('Summary');
    expect(pageText).toContain('Account type');
    expect(pageText).toContain('Adult, Youth');
    expect(pageText).toContain('£120.50');
    expect(pageText).toContain('£1,000.00');
  });

  it('should not render optional criteria that were not used', async () => {
    const { fixture } = await setup(paymentsReportTypeId, paymentsReportSummary);

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(pageText).toContain('Report criteria');
    expect(pageText).toContain('Report Type');
    expect(pageText).toContain('Detail');
    expect(pageText).not.toContain('Minimum account balance');
    expect(pageText).not.toContain('Maximum account balance');
    expect(pageText).not.toContain('Lower name range');
    expect(pageText).not.toContain('Upper name range');
  });

  it('should hide the errors section when the report is not in error', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Errors');
  });

  it('should render the errors section when the report is in error', async () => {
    const { fixture } = await setup(enforcementReportTypeId, errorReportSummary);

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(pageText).toContain('Errors');
    expect(pageText).toContain('Report generation error');
    expect(pageText).toContain('Legacy report timed out');
    expect(pageText).toContain('Report service');
    expect(pageText).toContain('No response from reporting engine');
    expect(pageText).toContain('Reporting service connection was reset');
  });

  it('should render without a local error banner when no report summary data is resolved', async () => {
    const { fixture } = await setup(enforcementReportTypeId, null);

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Operational report (by enforcement)');
    expect(fixture.nativeElement.querySelector('.moj-alert--error')).toBeNull();
    expect(pageText).not.toContain('ABDC');
    expect(pageText).not.toContain('General');
  });

  it('should navigate back to the current report summary list', async () => {
    const { component, mockRouter } = await setup();

    component.navigateBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_REPORTS_ROUTING_PATHS.root,
      enforcementReportTypeId,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  });
});
