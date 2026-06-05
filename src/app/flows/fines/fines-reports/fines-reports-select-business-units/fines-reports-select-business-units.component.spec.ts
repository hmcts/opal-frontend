import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { FinesReportsSelectBusinessUnitsComponent } from './fines-reports-select-business-units.component';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

describe('FinesReportsSelectBusinessUnitsComponent', () => {
  const createRouterMock = () => ({
    navigate: vi.fn(),
  });

  const setup = async (reportId: string) => {
    const router = createRouterMock();
    const businessUnits = [
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[2],
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[1],
    ];
    const activatedRoute = {
      snapshot: {
        data: {
          businessUnits: {
            refData: businessUnits,
          },
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
    const { component } = await setup(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

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
  });

  it('should handle submitted single business unit selections', async () => {
    const { fixture } = await setup(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);
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
  });
});
