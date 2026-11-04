import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_FINANCE_ROUTING_PATHS } from './fines-finance-routing-paths.constant';
import { FinesFinanceInboundFilesComponent } from '../fines-finance-inbound-files/fines-finance-inbound-files.component';
import { FinesFinanceOutboundFilesComponent } from '../fines-finance-outbound-files/fines-finance-outbound-files.component';
import { FinesFinanceUploadVariantBankingFilesComponent } from '../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { release1cBankingInterfacesFeatureFlagGuard, routing } from './fines-finance.routes';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';

describe('fines finance routes', () => {
  it('should redirect the Finance root to the dashboard', () => {
    const rootRoute = routing.find((route) => route.path === '');
    expect(rootRoute?.redirectTo).toBe(PAGES_ROUTING_PATHS.children.dashboard);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it.each([
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
      routePermissionId: FINES_PERMISSIONS['view-interface-files'],
      component: FinesFinanceInboundFilesComponent,
      expectedResolvers: { title: TitleResolver, businessUnits: fetchBusinessUnitsResolver },
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.outbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
      routePermissionId: FINES_PERMISSIONS['view-interface-files'],
      component: FinesFinanceOutboundFilesComponent,
      expectedResolvers: { title: TitleResolver },
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
      routePermissionId: FINES_PERMISSIONS['create-interface-files'],
      component: FinesFinanceUploadVariantBankingFilesComponent,
      expectedResolvers: { title: TitleResolver },
    },
  ])(
    'should title and lazy-load the $title route',
    async ({ path, title, routePermissionId, component, expectedResolvers }) => {
      const route = routing.find((routeItem) => routeItem.path === path);

      expect(route?.data).toEqual({ title, routePermissionId: [routePermissionId] });
      expect(route?.resolve).toEqual(expectedResolvers);
      expect(route?.canActivate).toEqual([
        authGuard,
        routePermissionsGuard,
        release1cBankingInterfacesFeatureFlagGuard,
      ]);
      await expect(route?.loadComponent?.()).resolves.toBe(component);
    },
  );
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
