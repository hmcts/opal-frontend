import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsSelectBusinessUnitsComponent } from './fines-reports-select-business-units.component';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FinesReportsStore } from '../stores/fines-reports.store';

describe('FinesReportsSelectBusinessUnitsComponent', () => {
  const DEFAULT_BUSINESS_UNITS = [
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[2],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1],
  ];
  const DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD = 10;

  const createRouterMock = () => ({
    navigate: vi.fn(),
  });

  const createConsoleLogSpy = () => vi.spyOn(console, 'log').mockImplementation(() => undefined);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createBusinessUnits = (count: number): IOpalFinesBusinessUnit[] =>
    Array.from({ length: count }, (_, index) => ({
      ...OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
      business_unit_id: 100 + index,
      business_unit_name: `Business unit ${String(index + 1).padStart(2, '0')}`,
    }));

  const createBusinessUnitFormData = (businessUnits: IOpalFinesBusinessUnit[], selectedCount: number) => ({
    formData: {
      fines_reports_select_business_unit_ids: businessUnits.reduce<Record<string, boolean>>(
        (businessUnitSelections, businessUnit, index) => {
          businessUnitSelections[businessUnit.business_unit_id.toString()] = index < selectedCount;
          return businessUnitSelections;
        },
        {},
      ),
      fines_reports_select_business_unit_ids_select_all: selectedCount === businessUnits.length,
    },
    nestedFlow: false,
  });

  const setup = async (
    reportTypeId: string,
    businessUnits = DEFAULT_BUSINESS_UNITS,
    selectedBusinessUnitIds: number[] = [],
    businessUnitWarningThreshold: number | null = DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD,
  ) => {
    const router = createRouterMock();
    const reportHeading =
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((report) => report.id === reportTypeId)?.heading ?? '';
    const reportParameters =
      businessUnitWarningThreshold === null ? {} : { business_unit_warning_threshold: businessUnitWarningThreshold };

    const report: IOpalFinesReport = {
      report_id: reportTypeId,
      report_title: reportHeading,
      report_group: 'Operational Reports',
      supported_file_types: ['CSV', 'PDF'],
      audited_report: false,
      report_parameters: reportParameters,
      supports_multiple_business_units: true,
      is_bespoke_journey: true,
      shown_as_worklist: false,
      retention_period: 'P14D',
      permission: 'SEARCH_AND_VIEW_ACCOUNTS',
      can_manually_create: true,
    };
    const activatedRoute = {
      snapshot: {
        data: {
          businessUnits: {
            refData: businessUnits,
          },
          report,
          reportHeading,
        },
        paramMap: convertToParamMap({}),
      },
      parent: {
        snapshot: {
          paramMap: convertToParamMap({ reportTypeId }),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [FinesReportsSelectBusinessUnitsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: Router,
          useValue: router,
        },
        FinesReportsStore,
      ],
    }).compileComponents();

    const finesReportsStore = TestBed.inject(FinesReportsStore);
    finesReportsStore.setSelectedBusinessUnitIds(reportTypeId, selectedBusinessUnitIds);

    const fixture = TestBed.createComponent(FinesReportsSelectBusinessUnitsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture, router, finesReportsStore };
  };

  it.each([
    [
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      'Operational reports (by enforcement)',
    ],
    [
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      'Operational reports (by payments)',
    ],
  ])('should render the report heading for %s', async (reportTypeId, reportHeading) => {
    const { component, fixture } = await setup(reportTypeId);

    expect(component.pageHeading).toBe('Select business units');
    expect(component.reportHeading).toBe(reportHeading);
    expect(fixture.nativeElement.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('Create report');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(reportHeading);
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('Select business units');
  });

  it('should render business units in alphabetical order', async () => {
    const { component, fixture } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    expect(component.businessUnits.map((businessUnit) => businessUnit.business_unit_name)).toEqual([
      'Historical Debt',
      'London Central & South East',
      'London Confiscation Orders',
    ]);
    const pageText = fixture.nativeElement.textContent;
    expect(pageText.indexOf('Historical Debt')).toBeLessThan(pageText.indexOf('London Central & South East'));
    expect(pageText.indexOf('London Central & South East')).toBeLessThan(
      pageText.indexOf('London Confiscation Orders'),
    );
  });

  it('should navigate back to the summary list when cancel is selected', async () => {
    const { component, finesReportsStore, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    component.handleCancel();

    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith([`../../${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`], {
      relativeTo: expect.any(Object),
    });
  });

  it('should handle submitted business unit selections', async () => {
    const { component, finesReportsStore, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );
    const consoleLogSpy = createConsoleLogSpy();

    component.handleContinue({
      formData: {
        fines_reports_select_business_unit_ids: {
          '61': true,
          '67': false,
          '68': true,
        },
        fines_reports_select_business_unit_ids_select_all: false,
      },
      nestedFlow: false,
    });

    expect(component.selectedBusinessUnitIds()).toEqual([61, 68]);
    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([61, 68]);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('PO-2305 selected business unit ids', [61, 68]);
  });

  it('should handle submitted single business unit selections', async () => {
    const { fixture, finesReportsStore, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );
    const component = fixture.componentInstance;
    const consoleLogSpy = createConsoleLogSpy();

    component.businessUnits = [component.businessUnits[0]];
    component.handleContinue({
      formData: {
        fines_reports_select_business_unit_ids: {},
        fines_reports_select_business_unit_ids_select_all: false,
      },
      nestedFlow: false,
    });

    expect(component.selectedBusinessUnitIds()).toEqual([61]);
    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([61]);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('PO-2305 selected business unit ids', [61]);
  });

  it('should log selected business units when the selection does not exceed the warning threshold', async () => {
    const businessUnits = createBusinessUnits(DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD);
    const { component, finesReportsStore, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      businessUnits,
    );
    const consoleLogSpy = createConsoleLogSpy();

    component.handleContinue(createBusinessUnitFormData(businessUnits, DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD));

    expect(component.selectedBusinessUnitIds()).toEqual(
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual(
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'PO-2305 selected business unit ids',
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
  });

  it('should navigate to the warning route when selected business units exceed the threshold', async () => {
    const businessUnits = createBusinessUnits(DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD + 1);
    const { component, finesReportsStore, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      businessUnits,
    );

    component.handleContinue(createBusinessUnitFormData(businessUnits, DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD + 1));

    expect(component.selectedBusinessUnitIds()).toEqual(
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual(
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning}`],
      {
        relativeTo: expect.any(Object),
      },
    );
  });

  it('should not show the warning when the report has no business unit warning threshold', async () => {
    const businessUnits = createBusinessUnits(DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD + 1);
    const { component, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      businessUnits,
      [],
      null,
    );
    const consoleLogSpy = createConsoleLogSpy();

    component.handleContinue(createBusinessUnitFormData(businessUnits, DEFAULT_BUSINESS_UNIT_WARNING_THRESHOLD + 1));

    expect(router.navigate).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'PO-2305 selected business unit ids',
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
  });

  it('should restore selected business unit ids from the reports store', async () => {
    const selectedBusinessUnitIds = [61, 68];
    const { component } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      DEFAULT_BUSINESS_UNITS,
      selectedBusinessUnitIds,
    );

    expect(component.selectedBusinessUnitIds()).toEqual(selectedBusinessUnitIds);
  });

  it('should update canDeactivate state from child unsaved changes', async () => {
    const { component } = await setup(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    component.handleUnsavedChanges(true);
    expect(component['canDeactivate']()).toBe(false);

    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(true);
  });
});
