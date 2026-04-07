import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesReportsSummaryListComponent } from './fines-reports-summary-list.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from './routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';
import { BehaviorSubject } from 'rxjs';

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
  const setup = async (
    url: string,
  ): Promise<{
    component: FinesReportsSummaryListComponent;
    fixture: ComponentFixture<FinesReportsSummaryListComponent>;
    activatedRoute: MockActivatedRoute;
  }> => {
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
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FinesReportsSummaryListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { component, fixture, activatedRoute };
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
