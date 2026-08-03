import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';
import { FinesReportsSelectBusinessUnitsComponent } from './fines-reports-select-business-units.component';

describe('FinesReportsSelectBusinessUnitsComponent', () => {
  const reportTypeId = 'operational_report_enforcement';
  const reportHeading = 'Operational reports (by enforcement)';
  const businessUnits = [
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[2],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1],
  ];
  const businessUnitWarningThreshold = 3;

  const setup = async (
    resolvedBusinessUnits = businessUnits,
    selectedBusinessUnitIds: number[] = [],
    threshold: number | undefined = businessUnitWarningThreshold,
  ) => {
    const router = { navigate: vi.fn() };
    const report: IOpalFinesReport = {
      report_id: reportTypeId,
      report_title: reportHeading,
      report_parameters: threshold === undefined ? {} : { business_unit_warning_threshold: threshold },
    };
    const activatedRoute = {
      snapshot: {
        data: {
          businessUnits: {
            refData: resolvedBusinessUnits,
          },
          report,
          reportHeading,
        },
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

    return { component, fixture, finesReportsStore, router };
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
    const { component, router } = await setup(businessUnits, [], 1);

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

  it('should continue to report parameters when the report has no warning threshold', async () => {
    const { component, router } = await setup(businessUnits, [], undefined);

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

    component.handleCancel();

    expect(finesReportsStore.selectedBusinessUnitIds()).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith([`../../${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`], {
      relativeTo: expect.any(Object),
    });
  });

  it('should restore selected business unit ids from the reports store', async () => {
    const { component } = await setup(businessUnits, [61, 68]);

    expect(component.selectedBusinessUnitIds()).toEqual([61, 68]);
  });

  it('should update canDeactivate state from child unsaved changes', async () => {
    const { component } = await setup();

    component.handleUnsavedChanges(true);
    expect(component['canDeactivate']()).toBe(false);

    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(true);
  });
});
