import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { FinesReportsSelectBusinessUnitsComponent } from './fines-reports-select-business-units.component';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { findFinesReportsDefinition } from '../constants/fines-reports-definitions.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';
import { FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD } from '../constants/fines-reports-business-unit-thresholds.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

describe('FinesReportsSelectBusinessUnitsComponent', () => {
  const DEFAULT_BUSINESS_UNITS = [
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[2],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
    OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1],
  ];

  const createRouterMock = (selectedBusinessUnitIds: number[] = []) => ({
    navigate: vi.fn(),
    currentNavigation: vi.fn(() =>
      selectedBusinessUnitIds.length > 0 ? { extras: { state: { selectedBusinessUnitIds } } } : null,
    ),
  });

  const createLocationMock = (selectedBusinessUnitIds: number[] = []) => ({
    getState: vi.fn(() => (selectedBusinessUnitIds.length > 0 ? { selectedBusinessUnitIds } : {})),
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
    reportId: string,
    businessUnits = DEFAULT_BUSINESS_UNITS,
    selectedBusinessUnitIds: number[] = [],
    useCurrentNavigation = true,
  ) => {
    const router = createRouterMock(selectedBusinessUnitIds);
    if (!useCurrentNavigation) {
      router.currentNavigation = vi.fn(() => null);
    }
    const location = createLocationMock(selectedBusinessUnitIds);
    const reportHeading = findFinesReportsDefinition(reportId)?.heading ?? '';
    const activatedRoute = {
      snapshot: {
        data: {
          businessUnits: {
            refData: businessUnits,
          },
          reportHeading,
        },
        paramMap: convertToParamMap({}),
      },
      parent: {
        snapshot: {
          paramMap: convertToParamMap({ reportId }),
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
        {
          provide: Location,
          useValue: location,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsSelectBusinessUnitsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture, router };
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
  ])('should render the report heading for %s', async (reportId, reportHeading) => {
    const { component, fixture } = await setup(reportId);

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
    const { component, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

    component.handleCancel();

    expect(router.navigate).toHaveBeenCalledWith(['..', 'summary-list'], {
      relativeTo: expect.any(Object),
    });
  });

  it('should handle submitted business unit selections', async () => {
    const { component, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );

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

    expect(component.selectedBusinessUnitIds).toEqual([61, 68]);
    expect(router.navigate).toHaveBeenCalledWith([`../${FINES_REPORTS_ROUTING_PATHS.children.parameters}`], {
      relativeTo: expect.any(Object),
      state: { selectedBusinessUnitIds: [61, 68] },
    });
  });

  it('should handle submitted single business unit selections', async () => {
    const { fixture, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );
    const component = fixture.componentInstance;

    component.businessUnits = [component.businessUnits[0]];
    component.handleContinue({
      formData: {
        fines_reports_select_business_unit_ids: {},
        fines_reports_select_business_unit_ids_select_all: false,
      },
      nestedFlow: false,
    });

    expect(component.selectedBusinessUnitIds).toEqual([61]);
    expect(router.navigate).toHaveBeenCalledWith([`../${FINES_REPORTS_ROUTING_PATHS.children.parameters}`], {
      relativeTo: expect.any(Object),
      state: { selectedBusinessUnitIds: [61] },
    });
  });

  it('should continue without warning when selected business units do not exceed the threshold', async () => {
    const businessUnits = createBusinessUnits(FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD);
    const { component, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      businessUnits,
    );

    component.handleContinue(createBusinessUnitFormData(businessUnits, FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD));

    expect(component.selectedBusinessUnitIds).toEqual(
      businessUnits.map((businessUnit) => businessUnit.business_unit_id),
    );
    expect(router.navigate).toHaveBeenCalledWith([`../${FINES_REPORTS_ROUTING_PATHS.children.parameters}`], {
      relativeTo: expect.any(Object),
      state: {
        selectedBusinessUnitIds: businessUnits.map((businessUnit) => businessUnit.business_unit_id),
      },
    });
  });

  it('should navigate to the warning route when selected business units exceed the threshold', async () => {
    const businessUnits = createBusinessUnits(FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD + 1);
    const { component, router } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      businessUnits,
    );

    component.handleContinue(
      createBusinessUnitFormData(businessUnits, FINES_REPORTS_BUSINESS_UNIT_WARNING_THRESHOLD + 1),
    );

    expect(component.selectedBusinessUnitIds).toEqual([]);
    expect(router.navigate).toHaveBeenCalledWith([`../${FINES_REPORTS_ROUTING_PATHS.children.businessUnitWarning}`], {
      relativeTo: expect.any(Object),
      state: {
        selectedBusinessUnitIds: businessUnits.map((businessUnit) => businessUnit.business_unit_id),
      },
    });
  });

  it('should restore selected business unit ids from navigation state', async () => {
    const selectedBusinessUnitIds = [61, 68];
    const { component } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      DEFAULT_BUSINESS_UNITS,
      selectedBusinessUnitIds,
    );

    expect(component.selectedBusinessUnitIds).toEqual(selectedBusinessUnitIds);
  });

  it('should restore selected business unit ids from location state when current navigation is unavailable', async () => {
    const selectedBusinessUnitIds = [61, 68];
    const { component } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      DEFAULT_BUSINESS_UNITS,
      selectedBusinessUnitIds,
      false,
    );

    expect(component.selectedBusinessUnitIds).toEqual(selectedBusinessUnitIds);
  });

  it('should update canDeactivate state from child unsaved changes', async () => {
    const { component } = await setup(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    component.handleUnsavedChanges(true);
    expect(component['canDeactivate']()).toBe(false);

    component.handleUnsavedChanges(false);
    expect(component['canDeactivate']()).toBe(true);
  });
});
