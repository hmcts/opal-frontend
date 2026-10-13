import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { routing } from '../../fines-reports.routes';
import { finesReportsManualCreationGuard } from './fines-reports-manual-creation.guard';

@Component({
  selector: 'app-manual-creation-route-stub',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ManualCreationRouteStubComponent {}

describe('finesReportsManualCreationGuard', () => {
  const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
  const reportsPath = `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}`;
  const summaryUrl = `/${reportsPath}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`;
  const getReport = vi.fn();
  const businessUnitsResolver = vi.fn();
  const createRoute = routing
    .find((route) => route.path === ':reportTypeId')!
    .children!.find((route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create)!;
  const guardedPaths = [
    FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
    FINES_REPORTS_CREATE_ROUTING_PATHS.children.reportParameters,
  ];

  beforeEach(() => {
    getReport.mockReset().mockReturnValue(of({ can_manually_create: true }));
    businessUnitsResolver.mockReset().mockReturnValue({ refData: [] });
    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: { getReport } },
        FinesReportsStore,
        provideRouter([
          {
            path: `${reportsPath}/:reportTypeId`,
            children: [
              {
                path: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
                component: ManualCreationRouteStubComponent,
              },
              {
                path: FINES_REPORTS_ROUTING_PATHS.children.create,
                children: guardedPaths.map((path) => ({
                  path,
                  canActivate: createRoute.children!.find((route) => route.path === path)!.canActivate,
                  component: ManualCreationRouteStubComponent,
                  resolve: { businessUnits: businessUnitsResolver },
                })),
              },
            ],
          },
        ]),
      ],
    });
    TestBed.inject(FinesReportsStore).setSelectedBusinessUnitIds(reportTypeId, [61]);
  });

  it.each(guardedPaths)(
    'should redirect %s before loading business units when manual creation is disabled',
    async (path) => {
      getReport.mockReturnValue(of({ can_manually_create: false }));
      const harness = await RouterTestingHarness.create();

      await harness.navigateByUrl(
        `/${reportsPath}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${path}`,
      );

      expect(TestBed.inject(Router).url).toBe(summaryUrl);
      expect(getReport).toHaveBeenCalledWith(reportTypeId);
      expect(businessUnitsResolver).not.toHaveBeenCalled();
    },
  );

  it.each(guardedPaths)('should load %s when manual creation is enabled', async (path) => {
    const harness = await RouterTestingHarness.create();
    const url = `/${reportsPath}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${path}`;

    await harness.navigateByUrl(url);

    expect(TestBed.inject(Router).url).toBe(url);
    expect(getReport).toHaveBeenCalledWith(reportTypeId);
    expect(businessUnitsResolver).toHaveBeenCalledTimes(1);
  });

  it('should preserve access when the manual creation flag is absent', async () => {
    getReport.mockReturnValue(of({}));
    const harness = await RouterTestingHarness.create();
    const url = `/${reportsPath}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${guardedPaths[0]}`;

    await harness.navigateByUrl(url);

    expect(TestBed.inject(Router).url).toBe(url);
    expect(businessUnitsResolver).toHaveBeenCalledTimes(1);
  });

  it.each(['unknown-report', FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports])(
    'should leave %s to the existing route checks without requesting metadata',
    (routeReportTypeId) => {
      const route = {
        paramMap: convertToParamMap({ reportTypeId: routeReportTypeId }),
        parent: null,
      } as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        finesReportsManualCreationGuard(route, {} as RouterStateSnapshot),
      );

      expect(result).toBe(true);
      expect(getReport).not.toHaveBeenCalled();
    },
  );

  it('should propagate metadata failures without loading business units', async () => {
    const error = new Error('Report metadata request failed');
    getReport.mockReturnValue(throwError(() => error));
    const harness = await RouterTestingHarness.create();

    await expect(
      harness.navigateByUrl(
        `/${reportsPath}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${guardedPaths[0]}`,
      ),
    ).rejects.toThrow(error);
    expect(businessUnitsResolver).not.toHaveBeenCalled();
  });
});
