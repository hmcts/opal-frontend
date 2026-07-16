import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import {
  FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
} from './mocks/fines-reports-report-summary.mock';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { FinesReportsReportSummaryComponent } from './fines-reports-report-summary.component';
import { mapFinesReportsReportInstanceToReportSummary } from './utils/fines-reports-report-summary-map-report-instance.utils';
import { IFinesReportsReportSummaryInstance } from './interfaces/fines-reports-report-summary-instance.interface';

describe('FinesReportsReportSummaryComponent', () => {
  const setup = async (
    reportId = FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_id,
    reportInstanceId = FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_instance_id,
    reportSummary: IFinesReportsReportSummaryInstance | null = FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  ): Promise<{
    component: FinesReportsReportSummaryComponent;
    fixture: ComponentFixture<FinesReportsReportSummaryComponent>;
    mockRouter: { navigate: ReturnType<typeof vi.fn> };
  }> => {
    const reportParamMap = convertToParamMap({ reportId });
    const reportInstanceParamMap = convertToParamMap({ instanceId: reportInstanceId });
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
            paramMap: of(reportInstanceParamMap),
            data: of({ reportSummary }),
            snapshot: {
              paramMap: reportInstanceParamMap,
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

  it('should render the selected report route ids in the component state', async () => {
    const { component, fixture } = await setup();

    fixture.detectChanges();

    expect(component.reportId).toBe('operational_report_enforcement');
    expect(component.reportInstanceId).toBe('report-instance-enforcement-001');
  });

  it('should render the enforcement report heading and back link', async () => {
    const { fixture } = await setup();

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational reports (by enforcement) - ABDC - Summary',
    );
    expect(fixture.nativeElement.querySelector('.govuk-back-link')?.textContent.trim()).toBe('Back');
  });

  it('should prefer resolved report summary data when available', async () => {
    const resolvedReportSummary = mapFinesReportsReportInstanceToReportSummary(
      OPAL_FINES_REPORT_INSTANCE_MOCK,
      FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_id,
    );
    const { fixture } = await setup(
      FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_id,
      FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_instance_id,
      resolvedReportSummary,
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational reports (by enforcement) - ABDC - Summary',
    );
    expect(fixture.nativeElement.textContent).toContain('01 Jun 2006 at 10:36');
    expect(fixture.nativeElement.textContent).toContain('Summary');
  });

  it('should render the payments report heading', async () => {
    const { fixture } = await setup(
      FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK.report_id,
      FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK.report_instance_id,
      FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Operational reports (by payments) - PYMT - Detail',
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
    const { fixture } = await setup(
      FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK.report_id,
      FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK.report_instance_id,
      FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
    );

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
    const { fixture } = await setup(
      FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK.report_id,
      FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK.report_instance_id,
      FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK,
    );

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(pageText).toContain('Errors');
    expect(pageText).toContain('Report generation error');
    expect(pageText).toContain('Legacy report timed out');
    expect(pageText).toContain('Report service');
    expect(pageText).toContain('No response from reporting engine');
  });

  it('should render without a local error banner when no report summary data is resolved', async () => {
    const { fixture } = await setup(
      FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_id,
      FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_instance_id,
      null,
    );

    fixture.detectChanges();

    const pageText = fixture.nativeElement.textContent;

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Operational report');
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
      FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_id,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  });
});
