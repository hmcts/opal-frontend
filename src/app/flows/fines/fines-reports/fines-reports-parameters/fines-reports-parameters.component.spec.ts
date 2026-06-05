import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FinesReportsParametersComponent } from './fines-reports-parameters.component';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

describe('FinesReportsParametersComponent', () => {
  const createRouterMock = (selectedBusinessUnitIds: number[] = [], useCurrentNavigation = true) => ({
    navigate: vi.fn(),
    currentNavigation: vi.fn(() =>
      useCurrentNavigation && selectedBusinessUnitIds.length > 0
        ? { extras: { state: { selectedBusinessUnitIds } } }
        : null,
    ),
  });

  const createLocationMock = (selectedBusinessUnitIds: number[]) => ({
    getState: vi.fn(() => (selectedBusinessUnitIds.length > 0 ? { selectedBusinessUnitIds } : {})),
  });

  const setup = async (
    reportId: string,
    selectedBusinessUnitIds: number[],
    businessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData,
    useCurrentNavigation = true,
  ) => {
    const router = createRouterMock(selectedBusinessUnitIds, useCurrentNavigation);
    const location = createLocationMock(selectedBusinessUnitIds);

    await TestBed.configureTestingModule({
      imports: [FinesReportsParametersComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
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
          },
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

    const fixture = TestBed.createComponent(FinesReportsParametersComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return { component, fixture, router };
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render the current report heading and selected business units', async () => {
    const { component, fixture } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      [68, 61],
    );

    expect(component.reportHeading).toBe('Operational reports (by enforcement)');
    expect(fixture.nativeElement.querySelector('.govuk-caption-l')?.textContent?.trim()).toBe('Create report');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Operational reports (by enforcement)');
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('Parameters');
    expect(fixture.nativeElement.textContent).toContain('Historical Debt');
    expect(fixture.nativeElement.textContent).toContain('London Confiscation Orders');
  });

  it('should redirect back to select business units when there is no stored selection', async () => {
    const { router } = await setup(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments, []);

    expect(router.navigate).toHaveBeenCalledWith(['..', FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: expect.any(Object),
    });
  });

  it('should load selected business units from location state when current navigation is unavailable', async () => {
    const { fixture } = await setup(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      [68, 61],
      OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData,
      false,
    );

    expect(fixture.nativeElement.textContent).toContain('Historical Debt');
    expect(fixture.nativeElement.textContent).toContain('London Confiscation Orders');
  });
});
