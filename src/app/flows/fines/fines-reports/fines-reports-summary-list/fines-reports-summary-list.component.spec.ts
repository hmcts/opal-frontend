import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsSummaryListComponent } from './fines-reports-summary-list.component';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from './routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FinesReportsSummaryListStore } from './stores/fines-reports-summary-list.store';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import type { FinesReportsReportInstancesResolverData } from '../routing/resolvers/fines-reports-report-instances/fines-reports-report-instances.resolver';

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
  const paymentsReportId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments;
  const mockReportMetadata: IOpalFinesReport = {
    report_id: reportId,
    report_title: 'Operational reports (by enforcement)',
    can_manually_create: true,
  };
  const mockPaymentsReportMetadata: IOpalFinesReport = {
    report_id: paymentsReportId,
    report_title: 'Operational reports (by payments)',
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

  const createUserState = (): IOpalUserState => {
    const userState = structuredClone(OPAL_USER_STATE_MOCK);
    const enforcementPermissionId = FINES_PERMISSIONS['operational-report-by-enforcement'];
    const paymentsPermissionId = FINES_PERMISSIONS['operational-report-by-payments'];

    userState.business_unit_users = [
      {
        ...userState.business_unit_users[0],
        business_unit_user_id: '99000000008000',
        business_unit_id: 67,
        permissions: [
          {
            permission_id: enforcementPermissionId,
            permission_name: 'Operational report by enforcement',
          },
          {
            permission_id: paymentsPermissionId,
            permission_name: 'Operational report by payments',
          },
        ],
      },
    ];

    return userState;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFines: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalStore: any;

  const setup = async (
    currentReportId: string = reportId,
    reportInstances: FinesReportsReportInstancesResolverData | undefined = mockReportInstances,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureStore?: (store: any) => void,
    businessUnits: IOpalFinesBusinessUnitRefData = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
    options: {
      parentParamName?: 'reportTypeId' | 'reportId';
      childParamName?: 'reportTypeId' | 'reportId';
      useParentRoute?: boolean;
      omitRouteParams?: boolean;
      omitBusinessUnits?: boolean;
      omitReportInstances?: boolean;
    } = {},
  ): Promise<{
    component: FinesReportsSummaryListComponent;
    fixture: ComponentFixture<FinesReportsSummaryListComponent>;
    activatedRoute: MockActivatedRoute;
  }> => {
    const parentParamName = options.parentParamName ?? 'reportTypeId';
    const childParamName = options.childParamName ?? 'reportTypeId';
    const childParamMap = convertToParamMap(
      options.useParentRoute === false && !options.omitRouteParams ? { [childParamName]: currentReportId } : {},
    );
    const routeData: Record<string, unknown> = {
      reportMetadata: currentReportId === paymentsReportId ? mockPaymentsReportMetadata : mockReportMetadata,
    };

    if (!options.omitBusinessUnits) {
      routeData['businessUnits'] = businessUnits;
    }

    if (!options.omitReportInstances) {
      routeData['reportInstances'] = reportInstances;
    }

    const activatedRoute: MockActivatedRoute = {
      snapshot: {
        paramMap: childParamMap,
        data: routeData,
      },
      paramMap: new BehaviorSubject(childParamMap),
      data: new BehaviorSubject(routeData),
      parent:
        options.useParentRoute === false
          ? null
          : {
              snapshot: {
                paramMap: convertToParamMap(options.omitRouteParams ? {} : { [parentParamName]: currentReportId }),
              },
              paramMap: new BehaviorSubject(
                convertToParamMap(options.omitRouteParams ? {} : { [parentParamName]: currentReportId }),
              ),
            },
    };

    mockOpalFines = {
      getReportInstances: vi.fn().mockReturnValue(of(reportInstances)),
    };

    await TestBed.configureTestingModule({
      imports: [FinesReportsSummaryListComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: OpalFines,
          useValue: mockOpalFines,
        },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(createUserState());
    const store = TestBed.inject(FinesReportsSummaryListStore);
    store.resetFilters();
    configureStore?.(store);

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

  it('should return empty heading and hide create report button for unknown report routes', async () => {
    const { component, fixture, activatedRoute } = await setup('unknown-report');

    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: null,
      reportInstances: mockReportInstances,
    });
    fixture.detectChanges();

    expect(component.pageHeading).toBe('');
    expect(component.showCreateReportButton).toBe(false);
  });

  it('should render the title, action button, rows, and mapped statuses', async () => {
    const { fixture } = await setup();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Operational report (by enforcement) - CLAMPO - Detailed');
    expect(text).toContain('In progress');
    expect(text).toContain('No content');

    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Operational reports (by enforcement)');
    expect(fixture.nativeElement.querySelector('#create-report-button')?.textContent?.trim()).toBe('Create report');
  });

  it('should render report instances returned in the backend DTO shape', async () => {
    const { fixture } = await setup(reportId, {
      report_instances: [
        {
          instanceId: 99000000008000,
          reportId,
          name: 'Operational report (by enforcement) - Backend row',
          requestedAt: '2026-05-12T11:37:55.196682',
          requested_by: {
            user_id: 12345678,
            name: 'opal-test',
          },
          business_units: [
            {
              business_unit_id: 77,
            },
          ],
          status: {
            code: 'READY',
            display_name: 'Ready',
          },
          numberOfRecords: 42,
          isDownloadable: true,
          supportedFileTypes: ['CSV', 'PDF'],
        },
      ],
      count: 1,
    });
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Operational report (by enforcement) - Backend row');
    expect(text).toContain('London Central & South East');
    expect(text).toContain('opal-test');
    expect(text).toContain('Ready');
    expect(fixture.nativeElement.querySelector('#reportInstanceAction-0')?.querySelector('a')).toBeNull();
    expect(fixture.nativeElement.querySelector('#reportInstanceAction-0')?.textContent?.trim()).toBe('CSV');
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

  it('should render a generic over-limit state when the backend does not return a result limit', async () => {
    const { fixture } = await setup(reportId, {
      report_instances: [],
      count: 101,
      has_more: true,
    });

    expect(fixture.nativeElement.textContent).toContain('There are more reports than can be shown');
    expect(fixture.nativeElement.textContent).toContain('Use the filters to reduce the number of results.');
    expect(fixture.nativeElement.textContent).not.toContain('There are more than  reports');
  });

  it('should expose Refresh as Apply filters and refresh for assistive technology', async () => {
    const { fixture } = await setup();
    const refreshButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[type="submit"]');

    expect(refreshButton?.textContent?.trim()).toBe('Refresh');
    expect(refreshButton?.getAttribute('aria-label')).toBe('Apply filters and refresh');
  });

  it('should disable browser autocomplete on the filters form', async () => {
    const { fixture } = await setup();
    const form: HTMLFormElement | null = fixture.nativeElement.querySelector('form');

    expect(form?.getAttribute('autocomplete')).toBe('off');
  });

  it('should call report instances API with selected filters when Refresh is selected', async () => {
    const { component } = await setup();

    component.filtersForm.controls.businessUnit.setValue('67');
    component.onRefresh();

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: reportId,
        business_units: ['67'],
      }),
    );
  });

  it('should build business unit options from resolved accessible business units only', async () => {
    const accessibleBusinessUnits = {
      count: 1,
      refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1]],
    };
    const { component } = await setup(reportId, mockReportInstances, undefined, accessibleBusinessUnits);

    expect(component.businessUnitOptions()).toEqual([
      { value: 'all', name: 'All business units' },
      { value: '67', name: 'London Central & South East' },
    ]);
  });

  it('should fall back to all business units when route data has no business units', async () => {
    const { component } = await setup(
      reportId,
      mockReportInstances,
      undefined,
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      {
        omitBusinessUnits: true,
      },
    );

    expect(component.businessUnitRefData()).toEqual([]);
    expect(component.businessUnitOptions()).toEqual([{ value: 'all', name: 'All business units' }]);
  });

  it('should support Operational reports by payments as a configured summary list report type', async () => {
    const paymentsReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 5,
          report_id: paymentsReportId,
          created_at: '2026-06-08T11:15:00Z',
          name: 'Operational report (by payments) - Paid in full',
          business_unit: 'London Central & South East',
          created_by: 'Priya Patel',
          status: 'READY',
          number_of_records: 12,
        },
      ],
      count: 1,
    };
    const { component, fixture } = await setup(paymentsReportId, paymentsReportInstances);

    expect(component.pageHeading).toBe('Operational reports (by payments)');
    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Operational reports (by payments)');
    expect(fixture.nativeElement.textContent).toContain('Operational report (by payments) - Paid in full');

    component.onRefresh();

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: paymentsReportId,
      }),
    );
  });

  it('should request current user report instances for Your reports', async () => {
    const { component, fixture, activatedRoute } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
    );

    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: null,
      reportInstances: mockReportInstances,
    });
    fixture.detectChanges();

    component.onRefresh();

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: OPAL_USER_STATE_MOCK.user_id,
      }),
    );
    expect(mockOpalFines.getReportInstances.mock.calls[0][0]).not.toHaveProperty('report_id');
  });

  it('should fall back to configured create report visibility when metadata is unavailable', async () => {
    const { component, fixture, activatedRoute } = await setup(reportId);

    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: null,
      reportInstances: mockReportInstances,
    });
    fixture.detectChanges();

    expect(component.showCreateReportButton).toBe(true);
  });

  it('should fall back to the current report id when no report configuration matches refresh', async () => {
    const { component, activatedRoute, fixture } = await setup('unknown-report');

    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: null,
      reportInstances: mockReportInstances,
    });
    fixture.detectChanges();
    component.onRefresh();

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: 'unknown-report',
      }),
    );
  });

  it('should normalize null filter form values when refreshing', async () => {
    const { component } = await setup();

    component.filtersForm.setValue({
      businessUnit: null,
      dateFilter: null,
      days: null,
      dateFrom: null,
      dateTo: null,
    });
    component.onRefresh();

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: reportId,
        business_units: undefined,
      }),
    );
  });

  it('should restore Custom days controls for the same report type', async () => {
    const { component, fixture } = await setup(reportId, mockReportInstances, (store) => {
      store.setReportTypeId(reportId);
      store.setFilters({
        businessUnit: '1',
        dateFilter: 'customDays',
        days: '30',
        dateFrom: '',
        dateTo: '',
      });
      store.setAppliedQuery({
        fromDate: '2026-05-10',
        toDate: '2026-06-08',
        businessUnit: '1',
      });
    });

    expect(component.dateFilter()).toBe('customDays');
    expect(fixture.nativeElement.querySelector('#reports-summary-list-custom-days')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#reports-summary-list-days')?.value).toBe('30');
  });

  it('should restore Date range controls for the same report type', async () => {
    const { component, fixture } = await setup(reportId, mockReportInstances, (store) => {
      store.setReportTypeId(reportId);
      store.setFilters({
        businessUnit: '1',
        dateFilter: 'dateRange',
        days: '',
        dateFrom: '01/06/2026',
        dateTo: '08/06/2026',
      });
      store.setAppliedQuery({
        fromDate: '2026-06-01',
        toDate: '2026-06-08',
        businessUnit: '1',
      });
    });

    expect(component.dateFilter()).toBe('dateRange');
    expect(fixture.nativeElement.querySelector('#reports-summary-list-date-range')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#reports-summary-list-date-from')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#reports-summary-list-date-to')).toBeTruthy();
  });

  it('should reset retained filters when the report type changes', async () => {
    const { component, fixture } = await setup(paymentsReportId, mockReportInstances, (store) => {
      store.setReportTypeId(reportId);
      store.setFilters({
        businessUnit: '1',
        dateFilter: 'customDays',
        days: '30',
        dateFrom: '',
        dateTo: '',
      });
      store.setAppliedQuery({
        fromDate: '2026-05-10',
        toDate: '2026-06-08',
        businessUnit: '1',
      });
    });

    expect(component.dateFilter()).toBe('last7Days');
    expect(component.filtersForm.controls.businessUnit.value).toBe('all');
    expect(fixture.nativeElement.querySelector('#reports-summary-list-custom-days')).toBeFalsy();
  });

  it('should refresh route-backed state when navigating between report types on the same component instance', async () => {
    const paymentsReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 5,
          report_id: paymentsReportId,
          created_at: '2026-06-08T11:15:00Z',
          name: 'Operational report (by payments) - Paid in full',
          business_unit: 'London Central & South East',
          created_by: 'Priya Patel',
          status: 'READY',
          number_of_records: 12,
        },
      ],
      count: 1,
    };
    const { component, fixture, activatedRoute } = await setup(reportId, mockReportInstances);

    component.filtersForm.controls.dateFilter.setValue('customDays');
    component.filtersForm.controls.days.setValue('30');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - CLAMPO - Detailed');

    activatedRoute.parent?.paramMap.next(convertToParamMap({ reportTypeId: paymentsReportId }));
    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: mockPaymentsReportMetadata,
      reportInstances: paymentsReportInstances,
    });
    fixture.detectChanges();

    expect(component.pageHeading).toBe('Operational reports (by payments)');
    expect(component.dateFilter()).toBe('last7Days');
    expect(component.filtersForm.controls.businessUnit.value).toBe('all');
    expect(fixture.nativeElement.textContent).toContain('Operational report (by payments) - Paid in full');
    expect(fixture.nativeElement.textContent).not.toContain('Operational report (by enforcement) - CLAMPO - Detailed');
  });

  it('should refresh route-backed state when the route uses reportId instead of reportTypeId', async () => {
    const { component, fixture } = await setup(
      paymentsReportId,
      mockReportInstances,
      undefined,
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      { parentParamName: 'reportId' },
    );

    fixture.detectChanges();

    expect(component.pageHeading).toBe('Operational reports (by payments)');
    expect(component.filtersForm.controls.businessUnit.value).toBe('all');
  });

  it('should read report id from the current route when there is no parent route', async () => {
    const { component } = await setup(
      paymentsReportId,
      mockReportInstances,
      undefined,
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      { useParentRoute: false, childParamName: 'reportId' },
    );

    expect(component.pageHeading).toBe('Operational reports (by payments)');
  });

  it('should use an empty report id when neither current nor parent route has report params', async () => {
    const { component } = await setup(
      reportId,
      mockReportInstances,
      undefined,
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      { omitRouteParams: true },
    );

    expect(component['reportId']()).toBe('');
    expect(component.pageHeading).toBe('');
  });

  it('should clear report instances when route data has no report instances', async () => {
    const { fixture, activatedRoute } = await setup(reportId, mockReportInstances);

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - CLAMPO - Detailed');

    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: mockReportMetadata,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No reports found');
    expect(fixture.nativeElement.textContent).not.toContain('Operational report (by enforcement) - CLAMPO - Detailed');
  });

  it('should initialise with no reports when snapshot route data has no report instances', async () => {
    const { fixture } = await setup(reportId, undefined, undefined, OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK, {
      omitReportInstances: true,
    });

    expect(fixture.nativeElement.textContent).toContain('No reports found');
  });

  it('should render the load error state when the initial report instances resolver fails', async () => {
    const { component, fixture } = await setup(reportId, {
      report_instances: [],
      count: 0,
      loadError: true,
    });

    expect(component.loadError()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Reports could not be loaded. Try again.');
    expect(fixture.nativeElement.textContent).not.toContain('No reports found');
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
    expect(fixture.nativeElement.textContent).not.toContain('Operational report (by enforcement) - CLAMPO - Detailed');
  });

  it('should keep handling refreshes after a report instances request error', async () => {
    const refreshedReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 10,
          report_id: reportId,
          created_at: '2026-06-09T10:30:00Z',
          name: 'Operational report (by enforcement) - Recovered',
          business_unit: 'London East',
          created_by: 'Ava Wilson',
          status: 'READY',
          number_of_records: 15,
        },
      ],
      count: 1,
    };
    const { component, fixture } = await setup();

    mockOpalFines.getReportInstances
      .mockReturnValueOnce(throwError(() => new Error('Report instances request failed')))
      .mockReturnValueOnce(of(refreshedReportInstances));

    component.onRefresh();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Reports could not be loaded. Try again.');

    component.onRefresh();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - Recovered');
    expect(fixture.nativeElement.textContent).not.toContain('Reports could not be loaded. Try again.');
    expect(mockOpalFines.getReportInstances).toHaveBeenCalledTimes(2);
  });

  it('should ignore stale refresh responses after a newer refresh has completed', async () => {
    const olderRefresh$ = new Subject<IOpalFinesReportInstancesResponse>();
    const newerRefresh$ = new Subject<IOpalFinesReportInstancesResponse>();
    const olderRefreshReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 6,
          report_id: reportId,
          created_at: '2026-06-09T10:30:00Z',
          name: 'Operational report (by enforcement) - Older refresh',
          business_unit: 'London East',
          created_by: 'Ava Wilson',
          status: 'READY',
          number_of_records: 15,
        },
      ],
      count: 1,
    };
    const newerRefreshReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 7,
          report_id: reportId,
          created_at: '2026-06-10T10:30:00Z',
          name: 'Operational report (by enforcement) - Newer refresh',
          business_unit: 'London East',
          created_by: 'Ava Wilson',
          status: 'READY',
          number_of_records: 16,
        },
      ],
      count: 1,
    };
    const { component, fixture } = await setup();

    mockOpalFines.getReportInstances
      .mockReturnValueOnce(olderRefresh$.asObservable())
      .mockReturnValueOnce(newerRefresh$.asObservable());

    component.onRefresh();
    component.onRefresh();

    newerRefresh$.next(newerRefreshReportInstances);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - Newer refresh');

    olderRefresh$.next(olderRefreshReportInstances);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by enforcement) - Newer refresh');
    expect(fixture.nativeElement.textContent).not.toContain('Operational report (by enforcement) - Older refresh');
  });

  it('should ignore stale refresh responses after the report type changes', async () => {
    const staleRefresh$ = new Subject<IOpalFinesReportInstancesResponse>();
    const staleRefreshReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 8,
          report_id: reportId,
          created_at: '2026-06-09T10:30:00Z',
          name: 'Operational report (by enforcement) - Stale refresh',
          business_unit: 'London East',
          created_by: 'Ava Wilson',
          status: 'READY',
          number_of_records: 15,
        },
      ],
      count: 1,
    };
    const paymentsReportInstances: IOpalFinesReportInstancesResponse = {
      report_instances: [
        {
          instance_id: 9,
          report_id: paymentsReportId,
          created_at: '2026-06-10T10:30:00Z',
          name: 'Operational report (by payments) - Current route',
          business_unit: 'London East',
          created_by: 'Ava Wilson',
          status: 'READY',
          number_of_records: 16,
        },
      ],
      count: 1,
    };
    const { component, fixture, activatedRoute } = await setup();

    mockOpalFines.getReportInstances.mockReturnValueOnce(staleRefresh$.asObservable());
    component.onRefresh();

    activatedRoute.parent?.paramMap.next(convertToParamMap({ reportTypeId: paymentsReportId }));
    activatedRoute.data.next({
      businessUnits: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK,
      reportMetadata: mockPaymentsReportMetadata,
      reportInstances: paymentsReportInstances,
    });
    fixture.detectChanges();

    staleRefresh$.next(staleRefreshReportInstances);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operational report (by payments) - Current route');
    expect(fixture.nativeElement.textContent).not.toContain('Operational report (by enforcement) - Stale refresh');
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

  it('should store date picker changes in the matching form control', async () => {
    const { component } = await setup();

    component.onDateChange('dateFrom', '01/06/2026');
    component.onDateChange('dateTo', '08/06/2026');

    expect(component.filtersForm.controls.dateFrom.value).toBe('01/06/2026');
    expect(component.filtersForm.controls.dateTo.value).toBe('08/06/2026');
  });

  it('should focus the field selected from the error summary', async () => {
    const { component, fixture } = await setup();
    const input = document.createElement('input');
    const focusSpy = vi.spyOn(input, 'focus');
    input.id = 'reports-summary-list-date-from';
    fixture.nativeElement.appendChild(input);

    component.onErrorClick('reports-summary-list-date-from');

    expect(focusSpy).toHaveBeenCalled();
  });
});
