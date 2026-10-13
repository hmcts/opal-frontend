import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, expect, it, vi } from 'vitest';
import { BehaviorSubject } from 'rxjs';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesReportParameters } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-parameters.interface';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';
import { FinesReportsSelectBusinessUnitsComponent } from './fines-reports-select-business-units.component';
import { FinesReportsSelectBusinessUnitsFormComponent } from './fines-reports-select-business-units-form/fines-reports-select-business-units-form.component';

describe('FinesReportsSelectBusinessUnitsComponent', () => {
  const reportTypeId = 'operational_report_enforcement';
  const reportHeading = 'Operational reports (by enforcement)';
  const businessUnits = [
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[2],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1],
  ];
  const businessUnitWarningThreshold = 3;
  const paymentReportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments;
  const paymentReportHeading = 'Operational report (by payments)';
  const paymentBusinessUnits: IOpalFinesBusinessUnit[] = [
    {
      ...businessUnits[0],
      business_unit_id: 92,
      business_unit_name: 'Payments South',
    },
    {
      ...businessUnits[1],
      business_unit_id: 91,
      business_unit_name: 'Payments North',
    },
  ];

  const createRouteData = (
    resolvedBusinessUnits: IOpalFinesBusinessUnit[],
    resolvedReportTypeId: string,
    resolvedReportHeading: string,
    reportParameters: Partial<IOpalFinesReportParameters>,
  ) => {
    const report = {
      report_id: resolvedReportTypeId,
      report_title: resolvedReportHeading,
      report_parameters: reportParameters,
    };

    return {
      businessUnits: {
        refData: resolvedBusinessUnits,
      },
      report,
      reportHeading: resolvedReportHeading,
    };
  };

  const setup = async (
    resolvedBusinessUnits = businessUnits,
    selectedBusinessUnitIds: number[] = [],
    reportParameters: Partial<IOpalFinesReportParameters> = {
      business_unit_warning_threshold: businessUnitWarningThreshold,
    },
  ) => {
    const router = { navigate: vi.fn().mockResolvedValue(true) };
    const routeData = createRouteData(resolvedBusinessUnits, reportTypeId, reportHeading, reportParameters);
    const activatedRoute = {
      snapshot: {
        data: routeData,
        paramMap: convertToParamMap({}),
        parent: {
          paramMap: convertToParamMap({ reportTypeId }),
          parent: null,
        },
      },
      data: new BehaviorSubject(routeData),
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

    return { activatedRoute, component, fixture, finesReportsStore, router };
  };

  it('should render the report heading', async () => {
    const { fixture } = await setup();

    expect(fixture.nativeElement.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('Create report');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(reportHeading);
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('Select business units');
  });

  it('should render business units in alphabetical order', async () => {
    const { component } = await setup();

    expect(component.businessUnits.map((businessUnit) => businessUnit.business_unit_name)).toEqual([
      'Historical Debt',
      'London Central & South East',
      'London Confiscation Orders',
    ]);
  });

  it('should store submitted business unit selections and continue to report parameters', async () => {
    const { component, finesReportsStore, router } = await setup();

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
    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`],
      { relativeTo: expect.any(Object) },
    );
  });

  it('should store the only eligible business unit without requiring a checkbox value', async () => {
    const singleBusinessUnit: IOpalFinesBusinessUnit[] = [businessUnits[0]];
    const { component, finesReportsStore, router } = await setup(singleBusinessUnit);

    component.handleContinue({
      formData: {
        fines_reports_select_business_unit_ids: {},
        fines_reports_select_business_unit_ids_select_all: false,
      },
      nestedFlow: false,
    });

    expect(component.selectedBusinessUnitIds()).toEqual([businessUnits[0].business_unit_id]);
    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([businessUnits[0].business_unit_id]);
    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`],
      { relativeTo: expect.any(Object) },
    );
  });

  it('should show the warning when the API warning threshold is exceeded', async () => {
    const { component, router } = await setup(businessUnits, [], { business_unit_warning_threshold: 1 });

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

    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning}`],
      { relativeTo: expect.any(Object) },
    );
  });

  it.each([
    { scenario: 'omitted', reportParameters: {} },
    { scenario: 'null', reportParameters: { business_unit_warning_threshold: null } },
  ])('should continue to report parameters when the warning threshold is $scenario', async ({ reportParameters }) => {
    const { activatedRoute, component, router } = await setup(businessUnits, [], reportParameters);

    expect(activatedRoute.snapshot.data.report.report_parameters).toEqual(reportParameters);
    expect(component.businessUnitWarningThreshold).toBeNull();

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

    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`],
      { relativeTo: expect.any(Object) },
    );
  });

  it('should clear the stored selection and return to the summary list when cancelled', async () => {
    const { component, finesReportsStore, router } = await setup(businessUnits, [61, 68]);

    await component.handleCancel();

    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith([`../../${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`], {
      relativeTo: expect.any(Object),
    });
  });

  it('should retain the stored selection when cancelling navigation is rejected', async () => {
    const { component, finesReportsStore, router } = await setup(businessUnits, [61, 68]);
    router.navigate.mockResolvedValue(false);

    await component.handleCancel();

    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([61, 68]);
  });

  it('should restore selected business unit ids from the reports store and require cancellation confirmation', async () => {
    const { component } = await setup(businessUnits, [61, 68]);

    expect(component.selectedBusinessUnitIds()).toEqual([61, 68]);
    expect(component['canDeactivate']()).toBe(false);
  });

  it('should update canDeactivate state from child unsaved changes', async () => {
    const { component } = await setup();

    component.handleUnsavedChanges(true);
    expect(component['canDeactivate']()).toBe(false);

    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(true);
  });

  it.each([
    ['an individual business unit', '#business-unit-61'],
    ['all business units', '#fines_reports_select_business_unit_ids'],
  ])('should allow cancellation without confirmation after selecting and deselecting %s', async (_, selector) => {
    const { component, fixture } = await setup();
    const checkbox = fixture.nativeElement.querySelector(selector) as HTMLInputElement;

    expect(component['canDeactivate']()).toBe(true);

    checkbox.click();
    expect(component['canDeactivate']()).toBe(false);

    checkbox.click();
    expect(component['canDeactivate']()).toBe(true);
  });

  it('should allow cancellation without confirmation after clearing restored selections', async () => {
    const { component, fixture } = await setup(businessUnits, [61, 68]);
    const firstCheckbox = fixture.nativeElement.querySelector('#business-unit-61') as HTMLInputElement;
    const secondCheckbox = fixture.nativeElement.querySelector('#business-unit-68') as HTMLInputElement;

    expect(component['canDeactivate']()).toBe(false);

    firstCheckbox.click();
    expect(component['canDeactivate']()).toBe(false);

    secondCheckbox.click();
    expect(component['canDeactivate']()).toBe(true);
  });

  it('should continue with a selected business unit without requiring cancellation confirmation', async () => {
    const { component, fixture, finesReportsStore, router } = await setup();
    const checkbox = fixture.nativeElement.querySelector('#business-unit-61') as HTMLInputElement;
    const continueButton = fixture.nativeElement.querySelector('#continue-create-report') as HTMLButtonElement;

    checkbox.click();
    expect(component['canDeactivate']()).toBe(false);

    continueButton.click();

    expect(component['canDeactivate']()).toBe(true);
    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([61]);
    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters}`],
      { relativeTo: expect.any(Object) },
    );
  });

  it('should allow cancellation without confirmation for a read-only business unit', async () => {
    const { component, fixture } = await setup([businessUnits[0]]);

    expect(fixture.nativeElement.querySelector('input[type="checkbox"]')).toBeNull();
    expect(component['canDeactivate']()).toBe(true);
  });

  it('should rebuild the form with the new report data when the route is reused', async () => {
    const { activatedRoute, component, fixture, finesReportsStore, router } = await setup();
    const enforcementForm = fixture.debugElement.query(
      By.directive(FinesReportsSelectBusinessUnitsFormComponent),
    ).componentInstance;
    const paymentRouteData = createRouteData(paymentBusinessUnits, paymentReportTypeId, paymentReportHeading, {
      business_unit_warning_threshold: 1,
    });

    component.handleUnsavedChanges(true);
    activatedRoute.snapshot.parent.paramMap = convertToParamMap({ reportTypeId: paymentReportTypeId });
    activatedRoute.snapshot.data = paymentRouteData;
    activatedRoute.data.next(paymentRouteData);
    fixture.detectChanges();

    const paymentsForm = fixture.debugElement.query(
      By.directive(FinesReportsSelectBusinessUnitsFormComponent),
    ).componentInstance;

    expect(paymentsForm).not.toBe(enforcementForm);
    expect(component.businessUnits.map((businessUnit) => businessUnit.business_unit_name)).toEqual([
      'Payments North',
      'Payments South',
    ]);
    expect(component['canDeactivate']()).toBe(true);
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(paymentReportHeading);

    component.handleContinue({
      formData: {
        fines_reports_select_business_unit_ids: {
          '91': true,
          '92': true,
        },
        fines_reports_select_business_unit_ids_select_all: false,
      },
      nestedFlow: false,
    });

    expect(finesReportsStore.getSelectedBusinessUnitIdsForReport(paymentReportTypeId)).toEqual([91, 92]);
    expect(finesReportsStore.getSelectedBusinessUnitIdsForReport(reportTypeId)).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith(
      [`../${FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning}`],
      { relativeTo: expect.any(Object) },
    );
  });
});
