import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesReportsSummaryListComponent } from './fines-reports-summary-list.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { describe, it, expect, vi } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from './routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { BehaviorSubject } from 'rxjs';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

type MockActivatedRoute = {
  snapshot: {
    paramMap: ReturnType<typeof convertToParamMap>;
  };
  paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  parent: {
    snapshot: {
      paramMap: ReturnType<typeof convertToParamMap>;
    };
    paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  } | null;
};

describe('FinesReportsSummaryListComponent', () => {
  const createRouterMock = () => ({
    navigate: vi.fn(),
  });

  const setup = async (
    url: string,
  ): Promise<{
    component: FinesReportsSummaryListComponent;
    fixture: ComponentFixture<FinesReportsSummaryListComponent>;
    activatedRoute: MockActivatedRoute;
    router: ReturnType<typeof createRouterMock>;
  }> => {
    const router = createRouterMock();
    const activatedRoute: MockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({}),
      },
      paramMap: new BehaviorSubject(convertToParamMap({})),
      parent: {
        snapshot: {
          paramMap: convertToParamMap({ reportId: url.split('/').at(-2) ?? '' }),
        },
        paramMap: new BehaviorSubject(convertToParamMap({ reportId: url.split('/').at(-2) ?? '' })),
      },
    };

    await TestBed.configureTestingModule({
      imports: [FinesReportsSummaryListComponent],
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

    const fixture = TestBed.createComponent(FinesReportsSummaryListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { component, fixture, activatedRoute, router };
  };

  it('should create', async () => {
    const { component } = await setup(
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports}/summary-list`,
    );

    expect(component).toBeTruthy();
  });

  it.each([
    [
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports}/summary-list`,
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
      )?.heading,
    ],
    [
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement}/summary-list`,
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      )?.heading,
    ],
    [
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments}/summary-list`,
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      )?.heading,
    ],
  ])('should derive the page heading from the current url', async (url, heading) => {
    const { component, fixture } = await setup(url);

    expect(component['reportId']()).toBe(url.split('/').at(-2));
    expect(component.pageHeading).toBe(heading);
    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe(heading);
  });

  it('should render the static reports summary list content', async () => {
    const { fixture } = await setup(
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports}/summary-list`,
    );

    expect(fixture.nativeElement.textContent).toContain('Your reports');
  });

  it.each([
    FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
  ])('should render a create report button for operational report summary lists', async (reportId) => {
    const { component, fixture } = await setup(`/fines/reports/${reportId}/summary-list`);
    const header = fixture.nativeElement.querySelector('.fines-reports-summary-list__header');
    const createReportButton = fixture.nativeElement.querySelector('button.govuk-button');

    expect(component.canCreateReport).toBe(true);
    expect(header).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fines-reports-summary-list__heading')?.textContent?.trim()).toBe(
      component.pageHeading,
    );
    expect(createReportButton?.textContent?.trim()).toBe('Create report');
    expect(createReportButton?.classList.contains('fines-reports-summary-list__create-button')).toBe(true);
  });

  it('should not render a create report button for your reports', async () => {
    const { component, fixture } = await setup(
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports}/summary-list`,
    );

    expect(component.canCreateReport).toBe(false);
    expect(fixture.nativeElement.querySelector('button.govuk-button')).toBeNull();
  });

  it('should navigate to the select business units route when create report is selected', async () => {
    const { component, fixture, router } = await setup(
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement}/summary-list`,
    );
    const createReportButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.govuk-button');

    createReportButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['..', FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits], {
      relativeTo: component['activatedRoute'],
    });
  });

  it('should update the page heading when the parent report id changes', async () => {
    const { component, fixture, activatedRoute } = await setup(
      `/fines/reports/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports}/summary-list`,
    );

    const updatedParamMap = convertToParamMap({
      reportId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    });
    activatedRoute.parent!.snapshot.paramMap = updatedParamMap;
    activatedRoute.parent!.paramMap.next(updatedParamMap);
    fixture.detectChanges();

    expect(component['reportId']()).toBe(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );
    expect(component.pageHeading).toBe(
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      )?.heading,
    );
    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe(
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      )?.heading,
    );
  });

  it('should fall back to the current route params when no parent route exists', async () => {
    const router = createRouterMock();

    await TestBed.configureTestingModule({
      imports: [FinesReportsSummaryListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                reportId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
              }),
            },
            paramMap: new BehaviorSubject(
              convertToParamMap({
                reportId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
              }),
            ),
            parent: null,
          },
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsSummaryListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['reportId']()).toBe(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );
    expect(component.pageHeading).toBe(
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      )?.heading,
    );
  });

  it('should default to an empty report id and heading when the parent route has no report id', async () => {
    const router = createRouterMock();

    await TestBed.configureTestingModule({
      imports: [FinesReportsSummaryListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
            paramMap: new BehaviorSubject(convertToParamMap({})),
            parent: {
              snapshot: {
                paramMap: convertToParamMap({}),
              },
              paramMap: new BehaviorSubject(convertToParamMap({})),
            },
          } satisfies MockActivatedRoute,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsSummaryListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component['reportId']()).toBe('');
    expect(component.pageHeading).toBe('');
    expect(fixture.nativeElement.querySelector('h1')?.textContent?.trim()).toBe('');
  });
});
