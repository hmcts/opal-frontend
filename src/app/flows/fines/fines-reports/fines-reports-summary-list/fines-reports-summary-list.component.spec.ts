import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsSummaryListComponent } from './fines-reports-summary-list.component';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from './routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';

type MockActivatedRoute = {
  snapshot: {
    paramMap: ReturnType<typeof convertToParamMap>;
    data: Record<string, unknown>;
  };
  paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: BehaviorSubject<any>;
  parent: {
    snapshot: {
      paramMap: ReturnType<typeof convertToParamMap>;
    };
    paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  } | null;
};

describe('FinesReportsSummaryListComponent', () => {
  const reportId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
  const mockReportMetadata: IOpalFinesReport = {
    report_id: reportId,
    report_title: 'Operational reports (by enforcement)',
    can_manually_create: true,
  };
  const mockReportInstances: IOpalFinesReportInstancesResponse = {
    report_instances: [
      {
        instance_id: 1,
        report_id: reportId,
        created_at: '2026-06-08T09:15:00Z',
        name: 'Operational report (by enforcement) - CLAMPO - Detailed',
        business_unit: 'London Central & South East',
        created_by: 'Olivia Smith',
        status: 'READY',
        number_of_records: 10,
        is_downloadable: true,
        supported_types: ['CSV'],
      },
      {
        instance_id: 2,
        report_id: reportId,
        created_at: '2026-06-07T09:15:00Z',
        name: 'Operational report (by enforcement) - No actions - Summary',
        business_unit: 'Multiple',
        created_by: 'James Brown',
        status: 'REQUESTED',
        number_of_records: 0,
      },
      {
        instance_id: 3,
        report_id: reportId,
        created_at: '2026-06-06T09:15:00Z',
        name: 'Operational report (by enforcement) - Empty - Summary',
        business_unit: 'London North West',
        created_by: 'Sarah Johnson',
        status: 'READY',
        number_of_records: 0,
      },
    ],
    count: 3,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFines: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalUserService: any;

  const setup = async (
    currentReportId: string = reportId,
    reportInstances: IOpalFinesReportInstancesResponse = mockReportInstances,
  ): Promise<{
    component: FinesReportsSummaryListComponent;
    fixture: ComponentFixture<FinesReportsSummaryListComponent>;
    activatedRoute: MockActivatedRoute;
  }> => {
    const routeData = {
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: mockReportMetadata,
      reportInstances,
    };
    const activatedRoute: MockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({}),
        data: routeData,
      },
      paramMap: new BehaviorSubject(convertToParamMap({})),
      data: new BehaviorSubject(routeData),
      parent: {
        snapshot: {
          paramMap: convertToParamMap({ reportTypeId: currentReportId }),
        },
        paramMap: new BehaviorSubject(convertToParamMap({ reportTypeId: currentReportId })),
      },
    };

    mockOpalFines = {
      getReportInstances: vi.fn().mockReturnValue(of(reportInstances)),
    };
    mockOpalUserService = {
      getLoggedInUserState: vi.fn().mockReturnValue(of({ user_id: 123 })),
    };

    await TestBed.configureTestingModule({
      imports: [FinesReportsSummaryListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: OpalFines,
          useValue: mockOpalFines,
        },
        {
          provide: OpalUserService,
          useValue: mockOpalUserService,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsSummaryListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { component, fixture, activatedRoute };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    const { component } = await setup();

    expect(component).toBeTruthy();
  });

  it('should derive the page heading from the current report type id', async () => {
    const { component, fixture } = await setup();
    const heading = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId)?.heading;

    expect(component['reportId']()).toBe(reportId);
    expect(component.pageHeading).toBe(heading);
    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe(heading);
  });

  it('should render the title, action button, rows, and mapped statuses', async () => {
    const { fixture } = await setup();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Operational report (by enforcement) - CLAMPO - Detailed');
    expect(text).toContain('In progress');
    expect(text).toContain('No content');

    const header = fixture.nativeElement.querySelector('.reports-summary-list-header');
    expect(header?.querySelector('h1')?.textContent?.trim()).toBe('Operational reports (by enforcement)');
    expect(header?.querySelector('button')?.textContent?.trim()).toBe('Create report');
  });

  it('should render no reports found when the report list is empty', async () => {
    const { fixture } = await setup(reportId, { report_instances: [], count: 0 });

    expect(fixture.nativeElement.textContent).toContain('No reports found');
  });

  it('should render an over-limit state when the backend response indicates there are more results', async () => {
    const { fixture } = await setup(reportId, {
      report_instances: [],
      count: 101,
      max_results: 100,
      has_more: true,
    });

    expect(fixture.nativeElement.textContent).toContain('There are more than 100 reports');
    expect(fixture.nativeElement.textContent).toContain('Use the filters to reduce the number of results.');
  });

  it('should expose Refresh as Apply filters and refresh for assistive technology', async () => {
    const { fixture } = await setup();
    const refreshButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[type="submit"]');

    expect(refreshButton?.textContent?.trim()).toBe('Refresh');
    expect(refreshButton?.getAttribute('aria-label')).toBe('Apply filters and refresh');
  });

  it('should call report instances API with selected filters when Refresh is selected', async () => {
    const { component } = await setup();

    component.filtersForm.controls.businessUnit.setValue('1');
    component.onRefresh();

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: reportId,
        business_units: ['1'],
      }),
    );
  });

  it('should update the table rows when Refresh returns new report instances', async () => {
    const refreshedReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 4,
          report_id: reportId,
          created_at: '2026-06-09T10:30:00Z',
          name: 'Operational report (by enforcement) - Refreshed',
          business_unit: 'London East',
          created_by: 'Ava Wilson',
          status: 'READY',
          number_of_records: 15,
        },
      ],
      count: 1,
    };
    const { component, fixture } = await setup();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - CLAMPO - Detailed');

    mockOpalFines.getReportInstances.mockReturnValueOnce(of(refreshedReportInstances));
    component.onRefresh();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - Refreshed');
    expect(fixture.nativeElement.textContent).not.toContain(
      'Operational report (by enforcement) - CLAMPO - Detailed',
    );
  });

  it('should show custom days validation when Custom days is selected without a value', async () => {
    const { component, fixture } = await setup();

    component.filtersForm.controls.dateFilter.setValue('customDays');
    fixture.detectChanges();
    component.onRefresh();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Enter number of days');
    expect(mockOpalFines.getReportInstances).not.toHaveBeenCalled();
  });

  it('should show date range validation when no date range values are entered', async () => {
    const { component, fixture } = await setup();

    component.filtersForm.controls.dateFilter.setValue('dateRange');
    fixture.detectChanges();
    component.onRefresh();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('You must enter at least 1 of date from or date to');
    expect(mockOpalFines.getReportInstances).not.toHaveBeenCalled();
  });

  it('should show date order validation when Date from is after Date to', async () => {
    const { component, fixture } = await setup();

    component.filtersForm.controls.dateFilter.setValue('dateRange');
    component.filtersForm.controls.dateFrom.setValue('08/06/2026');
    component.filtersForm.controls.dateTo.setValue('07/06/2026');
    fixture.detectChanges();
    component.onRefresh();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('The Date from cannot be after the Date to');
    expect(mockOpalFines.getReportInstances).not.toHaveBeenCalled();
  });

  it('should clear conditional date fields when another date filter is selected', async () => {
    const { component } = await setup();

    component.filtersForm.controls.dateFilter.setValue('dateRange');
    component.filtersForm.controls.dateFrom.setValue('01/06/2026');
    component.filtersForm.controls.dateTo.setValue('02/06/2026');
    component.filtersForm.controls.dateFilter.setValue('last7Days');

    expect(component.filtersForm.controls.dateFrom.value).toBe('');
    expect(component.filtersForm.controls.dateTo.value).toBe('');
  });
});
