import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from './constants/fines-routing-paths.constant';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1B_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
  RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG,
  RELEASE_1C_PAYMENT_FEATURE_FLAG,
  RELEASE_1C_SUSPENSE_FEATURE_FLAG,
} from '../constants/release-feature-flags.constant';
import {
  finesRouting,
  release1aFeatureFlagGuard,
  release1bFeatureFlagGuard,
  release1cWriteOffFeatureFlagGuard,
  release1cEnforcementOperationalReportingFeatureFlagGuard,
  release1cFinancialMovementsFeatureFlagGuard,
  release1cPaymentFeatureFlagGuard,
  release1cSuspenseFeatureFlagGuard,
} from './fines.routes';
import { finesSectionPermissionsGuard } from './guards/fines-section-permissions/fines-section-permissions.guard';
import { dashboardTypeGuard } from './guards/dashboard-type/dashboard-type.guard';
import { routing as finesFinanceRouting } from '../fines-finance/routing/fines-finance.routes';
import { routing as aecRouting } from '../fines-aec/routing/fines-aec.routes';
import { routing as autoPaymentInRouting } from '../fines-api/routing/fines-api.routes';
import { routing as suspenseItemRouting } from '../fines-suspense-item/routing/fines-suspense-item.routes';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';

describe('fines routes', () => {
  const childRoutes =
    finesRouting.find((route) => route.path === FINES_ROUTING_PATHS.root && route.children)?.children ?? [];
  const featureGuards = [
    { flag: RELEASE_1A_FEATURE_FLAG, guard: release1aFeatureFlagGuard },
    { flag: RELEASE_1B_FEATURE_FLAG, guard: release1bFeatureFlagGuard },
    { flag: RELEASE_1C_WRITE_OFF_FEATURE_FLAG, guard: release1cWriteOffFeatureFlagGuard },
    {
      flag: RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
      guard: release1cEnforcementOperationalReportingFeatureFlagGuard,
    },
    { flag: RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG, guard: release1cFinancialMovementsFeatureFlagGuard },
    { flag: RELEASE_1C_PAYMENT_FEATURE_FLAG, guard: release1cPaymentFeatureFlagGuard },
    { flag: RELEASE_1C_SUSPENSE_FEATURE_FLAG, guard: release1cSuspenseFeatureFlagGuard },
  ];
  let featureFlags: Record<string, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: GlobalStore, useValue: { featureFlags: () => featureFlags } },
        { provide: LaunchDarklyService, useValue: {} },
      ],
    });
  });

  describe.each(featureGuards)('$flag route guard', ({ flag, guard }) => {
    it.each([true, false])('allows entry only when its own flag is enabled (enabled=%s)', async (enabled) => {
      // Give every other flag the opposite value to detect a guard wired to the wrong flag.
      featureFlags = Object.fromEntries(featureGuards.map((entry) => [entry.flag, !enabled]));
      featureFlags[flag] = enabled;
      const router = TestBed.inject(Router);

      const result = await TestBed.runInInjectionContext(() =>
        guard(new ActivatedRouteSnapshot(), router.routerState.snapshot),
      );

      expect(result).toEqual(enabled ? true : router.createUrlTree(['/access-denied']));
    });
  });

  it('protects Suspense entry with authentication, its feature flag and either Suspense permission', () => {
    const suspenseRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.suspenseItem.root);

    expect(suspenseRoute).toBeDefined();
    expect(suspenseRoute?.children).toBe(suspenseItemRouting);
    expect(suspenseRoute?.canActivate).toEqual([authGuard, release1cSuspenseFeatureFlagGuard, routePermissionsGuard]);
    expect(suspenseRoute?.data?.['routePermissionId']).toEqual([24, 25]);
  });

  it('should guard the draft root as an Accounts section entry route', () => {
    const draftRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.draft.root);

    expect(draftRoute?.canActivate).toContain(release1aFeatureFlagGuard);
    expect(draftRoute?.canActivateChild).toContain(release1aFeatureFlagGuard);
    expect(draftRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(draftRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    });
  });

  it('should guard dashboard section routes by dashboard type and section availability', () => {
    const dashboardRoute = childRoutes.find(
      (route) => route.path === `${FINES_DASHBOARD_ROUTING_PATHS.root}/:dashboardType`,
    );

    expect(dashboardRoute?.canActivate).toContain(dashboardTypeGuard);
    expect(dashboardRoute?.canActivate).toContain(finesSectionPermissionsGuard);
  });

  it('should guard the manual cash input root as a Finance section entry route', () => {
    const manualCashInputRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.mci.root);

    expect(manualCashInputRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(manualCashInputRoute?.canActivate).toContain(release1cFinancialMovementsFeatureFlagGuard);
    expect(manualCashInputRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    });
  });

  it('should add Auto Payment In as a Finance section entry route', () => {
    const autoPaymentInRoute = childRoutes.find(
      (route) => route.path === FINES_ROUTING_PATHS.children.autoPaymentIn.root,
    );

    expect(autoPaymentInRoute?.children).toBe(autoPaymentInRouting);
    expect(autoPaymentInRoute?.canActivate).toEqual([
      authGuard,
      release1cPaymentFeatureFlagGuard,
      release1cFinancialMovementsFeatureFlagGuard,
      finesSectionPermissionsGuard,
    ]);
    expect(autoPaymentInRoute?.canActivateChild).toEqual([release1cPaymentFeatureFlagGuard]);
    expect(autoPaymentInRoute?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(autoPaymentInRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
      ...PRIMARY_NAV_HIDDEN_ROUTE_DATA,
    });
  });

  it('should guard the MAC journey root behind release-1a', () => {
    const macRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.mac.root);

    expect(macRoute?.canActivate).toContain(release1aFeatureFlagGuard);
    expect(macRoute?.canActivateChild).toContain(release1aFeatureFlagGuard);
  });

  it('should guard the Account Enquiry root behind release-1b', () => {
    const accountEnquiryRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.acc.root);

    expect(accountEnquiryRoute?.canActivate).toContain(release1bFeatureFlagGuard);
    expect(accountEnquiryRoute?.canActivateChild).toContain(release1bFeatureFlagGuard);
  });

  it('should guard the consolidation root as an Accounts section entry route', () => {
    const consolidationRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.con.root);

    expect(consolidationRoute?.canActivate).toContain(release1cWriteOffFeatureFlagGuard);
    expect(consolidationRoute?.canActivateChild).toContain(release1cWriteOffFeatureFlagGuard);
    expect(consolidationRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(consolidationRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
      ...PRIMARY_NAV_HIDDEN_ROUTE_DATA,
    });
  });

  it('should hide the primary navigation for the MAC journey root', () => {
    const macRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.mac.root);

    expect(macRoute?.data).toEqual(PRIMARY_NAV_HIDDEN_ROUTE_DATA);
  });

  it('should guard Reports routes behind release-1c enforcement operational reporting and Reports permissions', () => {
    const reportsRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.reports.root);

    expect(reportsRoute?.canActivate).toContain(release1cEnforcementOperationalReportingFeatureFlagGuard);
    expect(reportsRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(reportsRoute?.canActivateChild).toContain(release1cEnforcementOperationalReportingFeatureFlagGuard);
    expect(reportsRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    });
  });

  it('should add Auto-Enforcement as an Administration section route', () => {
    const autoEnforcementRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.aec.root);

    expect(autoEnforcementRoute?.children).toBe(aecRouting);
    expect(autoEnforcementRoute?.canActivate).toContain(authGuard);
    expect(autoEnforcementRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(autoEnforcementRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.administration,
    });
  });

  it('should add Finance as a Finance section entry route', () => {
    const financeRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.finance.root);

    expect(financeRoute?.children).toBe(finesFinanceRouting);
    expect(financeRoute?.canActivate).toEqual([authGuard, finesSectionPermissionsGuard]);
    expect(financeRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    });
  });
});
