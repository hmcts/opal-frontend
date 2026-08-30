import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { finesReportsCreateStateGuard } from './fines-reports-create-state.guard';

describe('finesReportsCreateStateGuard', () => {
  const reportTypeId = 'operational_report_enforcement';
  const mockRouter = createSpyObj('Router', ['createUrlTree']);
  const mockCreateUrlTree = mockRouter['createUrlTree'];

  const runGuard = (requiresSelectedBusinessUnits = false, routeReportTypeId: string | null = reportTypeId) => {
    const parent = {
      paramMap: convertToParamMap(routeReportTypeId ? { reportTypeId: routeReportTypeId } : {}),
      parent: null,
    } as unknown as ActivatedRouteSnapshot;
    const route = {
      data: { requiresSelectedBusinessUnits },
      paramMap: convertToParamMap({}),
      parent,
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => finesReportsCreateStateGuard(route, state));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateUrlTree.mockReturnValue(new UrlTree());

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }, FinesReportsStore],
    });
  });

  it('should allow a route that does not require selected business units', () => {
    const result = runGuard();

    expect(result).toBe(true);
  });

  it('should redirect warning and parameters routes without a stored selection to Select business units', () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);

    const result = runGuard(true);

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
    ]);
  });

  it('should allow warning and parameters routes with a stored selection', () => {
    TestBed.inject(FinesReportsStore).setSelectedBusinessUnitIds(reportTypeId, [61]);

    const result = runGuard(true);

    expect(result).toBe(true);
  });

  it('should redirect a route with no report type id to the reports dashboard', () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);

    const result = runGuard(false, null);

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  });
});
