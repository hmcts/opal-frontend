import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_FINANCE_ROUTING_PATHS } from './fines-finance-routing-paths.constant';
import { FinesFinanceComponent } from '../fines-finance.component';
import { FinesFinanceInboundFilesComponent } from '../fines-finance-inbound-files/fines-finance-inbound-files.component';
import { FinesFinanceOutboundFilesComponent } from '../fines-finance-outbound-files/fines-finance-outbound-files.component';
import { FinesFinanceUploadVariantBankingFilesComponent } from '../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { release1cBankingInterfacesFeatureFlagGuard, routing } from './fines-finance.routes';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';

@Component({
  selector: 'app-interface-files-route-stub',
  template: '<p>{{ route.snapshot.data["title"] }}</p>',
})
class InterfaceFilesRouteStubComponent {
  public readonly route = inject(ActivatedRoute);
}

describe('fines finance routes', () => {
  const interfaceFilesRoutes = [
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
      component: FinesFinanceInboundFilesComponent,
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.outbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
      component: FinesFinanceOutboundFilesComponent,
    },
  ];

  it('should redirect the Finance root to the dashboard', () => {
    const rootRoute = routing.find((route) => route.redirectTo);

    expect(rootRoute?.path).toBe('');
    expect(rootRoute?.redirectTo).toBe(PAGES_ROUTING_PATHS.children.dashboard);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it.each(interfaceFilesRoutes)(
    'should define the guarded, resolved $path route directly beneath Finance',
    async ({ path, title, component }) => {
      const route = routing.find((routeItem) => routeItem.path === path);

      expect(route?.data).toEqual({ title, routePermissionId: [FINES_PERMISSIONS['view-interface-files']] });
      expect(route?.resolve).toEqual({ title: TitleResolver, businessUnits: fetchBusinessUnitsResolver });
      expect(route?.canActivate).toEqual([
        authGuard,
        routePermissionsGuard,
        release1cBankingInterfacesFeatureFlagGuard,
      ]);
      await expect(route?.loadComponent?.()).resolves.toBe(component);
    },
  );

  it.each(interfaceFilesRoutes)(
    'should navigate through the Finance shell to $path with resolved data on the leaf route',
    async ({ path, title }) => {
      const authGuardStub = vi.fn(() => true);
      const permissionsGuardStub = vi.fn(() => true);
      const businessUnits = [{ business_unit_id: 46, business_unit_name: 'Business unit' }];
      const businessUnitsResolverStub = vi.fn(() => businessUnits);
      const titleResolverStub = vi.fn(() => title);
      const url = `/${FINES_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.root}/${path}`;

      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            {
              path: `${FINES_ROUTING_PATHS.root}/${FINES_FINANCE_ROUTING_PATHS.root}`,
              component: FinesFinanceComponent,
              children: routing.map((route) =>
                route.path === path
                  ? {
                      ...route,
                      loadComponent: () => Promise.resolve(InterfaceFilesRouteStubComponent),
                      canActivate: [authGuardStub, permissionsGuardStub],
                      resolve: { title: titleResolverStub, businessUnits: businessUnitsResolverStub },
                    }
                  : route,
              ),
            },
          ]),
        ],
      });

      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(url, FinesFinanceComponent);
      const child = harness.routeDebugElement?.query(By.directive(InterfaceFilesRouteStubComponent))
        .componentInstance as InterfaceFilesRouteStubComponent;

      expect(TestBed.inject(Router).url).toBe(url);
      expect(harness.routeNativeElement?.textContent).toContain(title);
      expect(child.route.parent?.component).toBe(FinesFinanceComponent);
      expect(child.route.snapshot.routeConfig?.path).toBe(path);
      expect(child.route.snapshot.data).toEqual({
        title,
        routePermissionId: [FINES_PERMISSIONS['view-interface-files']],
        businessUnits,
      });
      expect(authGuardStub).toHaveBeenCalledOnce();
      expect(permissionsGuardStub).toHaveBeenCalledOnce();
      expect(titleResolverStub).toHaveBeenCalledOnce();
      expect(businessUnitsResolverStub).toHaveBeenCalledOnce();
    },
  );

  it('should preserve the guarded variant banking upload route', async () => {
    const uploadRoute = routing.find(
      (route) =>
        route.path ===
        `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
    );

    expect(uploadRoute?.data).toEqual({
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
      routePermissionId: [FINES_PERMISSIONS['create-interface-files']],
    });
    expect(uploadRoute?.resolve).toEqual({ title: TitleResolver });
    expect(uploadRoute?.canActivate).toEqual([
      authGuard,
      routePermissionsGuard,
      release1cBankingInterfacesFeatureFlagGuard,
    ]);
    await expect(uploadRoute?.loadComponent?.()).resolves.toBe(FinesFinanceUploadVariantBankingFilesComponent);
  });
});

describe('finance banking interfaces feature flag', () => {
  let featureFlags: Record<string, boolean>;

  beforeEach(() => {
    featureFlags = {};
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: GlobalStore, useValue: { featureFlags: () => featureFlags } },
        {
          provide: LaunchDarklyService,
          useValue: { initializeLaunchDarklyFlags: vi.fn(), initializeLaunchDarklyClient: vi.fn() },
        },
      ],
    });
  });

  it.each([false, undefined])('uses the shared access-denied redirect when the flag is %s', async (enabled) => {
    if (enabled !== undefined) featureFlags[RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG] = enabled;

    const result = await TestBed.runInInjectionContext(() =>
      release1cBankingInterfacesFeatureFlagGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/access-denied');
  });

  it('allows the Finance journey when banking interfaces is enabled', async () => {
    featureFlags[RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG] = true;

    const result = await TestBed.runInInjectionContext(() =>
      release1cBankingInterfacesFeatureFlagGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });
});
