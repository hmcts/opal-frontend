import { fetchSourceMappingsResolver } from '../../routing/resolvers/fetch-source-mappings-resolver/fetch-source-mappings.resolver';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FinesApiSummaryReportComponent } from '../fines-api-summary-report/fines-api-summary-report.component';
import { describe, expect, it } from 'vitest';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FinesApiConfirmProcessComponent } from '../fines-api-confirm-process/fines-api-confirm-process.component';
import { FinesApiProcessAllocateComponent } from '../fines-api-process-allocate/fines-api-process-allocate.component';
import { FinesApiSelectBusComponent } from '../fines-api-select-bus/fines-api-select-bus.component';
import { FINES_API_ROUTING_PATHS } from './constants/fines-api-routing-paths.constant';
import { FINES_API_ROUTING_TITLES } from './constants/fines-api-routing-titles.constant';
import { finesApiFileSelectionGuard } from './guards/fines-api-file-selection.guard';
import { finesApiFlowStateGuard } from './guards/fines-api-flow-state.guard';
import { finesApiBusinessUnitCountsResolver } from './resolvers/fines-api-business-unit-counts.resolver';
import { routing } from './fines-api.routes';

describe('fines API routes', () => {
  it('should redirect the Auto Payment In root to select business units', () => {
    expect(routing[0]).toEqual({
      path: '',
      redirectTo: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
      pathMatch: 'full',
    });
  });

  it('should expose the select business units route as the flow entry point', async () => {
    const selectBusinessUnitsRoute = routing.find(
      (route) => route.path === FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(selectBusinessUnitsRoute).toEqual(
      expect.objectContaining({
        path: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_API_ROUTING_TITLES.children.selectBusinessUnits,
        },
        resolve: {
          title: TitleResolver,
          businessUnitCounts: finesApiBusinessUnitCountsResolver,
        },
      }),
    );
    await expect(selectBusinessUnitsRoute?.loadComponent?.()).resolves.toBe(FinesApiSelectBusComponent);
  });

  it('should protect the process allocate route with the ACI flow state guard', async () => {
    const processAllocateRoute = routing.find(
      (route) => route.path === FINES_API_ROUTING_PATHS.children.processAllocate,
    );

    expect(processAllocateRoute).toEqual(
      expect.objectContaining({
        path: FINES_API_ROUTING_PATHS.children.processAllocate,
        canActivate: [authGuard, routePermissionsGuard, finesApiFlowStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_API_ROUTING_TITLES.children.processAllocate,
        },
        resolve: {
          title: TitleResolver,
          sourceMappings: fetchSourceMappingsResolver,
        },
      }),
    );
    await expect(processAllocateRoute?.loadComponent?.()).resolves.toBe(FinesApiProcessAllocateComponent);
  });

  it('should protect the confirm process route with the ACI flow state and file selection guards', async () => {
    const confirmProcessRoute = routing.find((route) => route.path === FINES_API_ROUTING_PATHS.children.confirmProcess);

    expect(confirmProcessRoute).toEqual(
      expect.objectContaining({
        path: FINES_API_ROUTING_PATHS.children.confirmProcess,
        canActivate: [authGuard, routePermissionsGuard, finesApiFlowStateGuard, finesApiFileSelectionGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_API_ROUTING_TITLES.children.confirmProcess,
        },
        resolve: {
          title: TitleResolver,
        },
      }),
    );
    await expect(confirmProcessRoute?.loadComponent?.()).resolves.toBe(FinesApiConfirmProcessComponent);
  });
  describe.each([
    ['tillSummary', 'tillId'],
    ['fileSummary', 'fileId'],
  ] as const)('%s', (routeKey, parameter) => {
    const summaryPath = `${FINES_API_ROUTING_PATHS.children[routeKey]}/:${parameter}`;
    const summaryRoute = routing.find((route) => route.path === summaryPath)!;

    it('protects the summary route and loads the shared placeholder', async () => {
      expect(summaryRoute.canActivate).toEqual([authGuard, routePermissionsGuard]);
      expect(summaryRoute.data).toEqual({
        routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
        title: FINES_API_ROUTING_TITLES.children[routeKey],
      });
      expect(summaryRoute.resolve).toEqual({ title: TitleResolver });
      await expect(summaryRoute.loadComponent!()).resolves.toBe(FinesApiSummaryReportComponent);
    });

    it('renders the placeholder and preserves the identifier as a route parameter', async () => {
      // Exercise route matching and lazy loading independently of authentication and title resolution.
      TestBed.configureTestingModule({
        providers: [provideRouter([{ path: summaryRoute.path, loadComponent: summaryRoute.loadComponent }])],
      });
      const harness = await RouterTestingHarness.create();
      const id = '99000000031003';
      await harness.navigateByUrl(
        `/${FINES_API_ROUTING_PATHS.children[routeKey]}/${id}`,
        FinesApiSummaryReportComponent,
      );
      const route = harness.routeDebugElement!.injector.get(ActivatedRoute);
      expect(route.snapshot.paramMap.get(parameter)).toBe(id);
      expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toBe('Till/File summary report');
      expect(harness.routeNativeElement!.textContent).toContain('This page is not available yet.');
    });
  });
});
