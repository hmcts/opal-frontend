import { Routes } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from './constants/fines-routing-paths.constant';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';

const featureFlagRedirectGuardMock = vi.fn();
const release1aFeatureFlagGuardMock = vi.fn();
const release1bFeatureFlagGuardMock = vi.fn();
const release1cWriteOffFeatureFlagGuardMock = vi.fn();
const release1cEnforcementOperationalReportingFeatureFlagGuardMock = vi.fn();
const release1cPaymentFeatureFlagGuardMock = vi.fn();
const release1aFeatureFlagName = 'release-1a';
const release1bFeatureFlagName = 'release-1b';
const release1cWriteOffFeatureFlagName = 'release-1c-write-off';
const release1cPaymentFeatureFlagName = 'release-1c-payment';

const mockFeatureFlagRedirectGuard = (): void => {
  featureFlagRedirectGuardMock.mockImplementation((featureFlagName: string) => {
    if (featureFlagName === release1aFeatureFlagName) {
      return release1aFeatureFlagGuardMock;
    }

    if (featureFlagName === release1bFeatureFlagName) {
      return release1bFeatureFlagGuardMock;
    }

    if (featureFlagName === release1cWriteOffFeatureFlagName) {
      return release1cWriteOffFeatureFlagGuardMock;
    }

    if (featureFlagName === release1cPaymentFeatureFlagName) {
      return release1cPaymentFeatureFlagGuardMock;
    }

    return release1cEnforcementOperationalReportingFeatureFlagGuardMock;
  });

  vi.doMock('@hmcts/opal-frontend-common/guards/feature-flag', () => ({
    featureFlagRedirectGuard: featureFlagRedirectGuardMock,
  }));
};

describe('fines routes', () => {
  type FinesRoutesModule = typeof import('./fines.routes');

  let finesRouting: FinesRoutesModule['finesRouting'];
  let release1aFeatureFlagGuard: FinesRoutesModule['release1aFeatureFlagGuard'];
  let release1bFeatureFlagGuard: FinesRoutesModule['release1bFeatureFlagGuard'];
  let release1cWriteOffFeatureFlagGuard: FinesRoutesModule['release1cWriteOffFeatureFlagGuard'];
  let release1cEnforcementOperationalReportingFeatureFlagGuard: FinesRoutesModule['release1cEnforcementOperationalReportingFeatureFlagGuard'];
  let release1cPaymentFeatureFlagGuard: FinesRoutesModule['release1cPaymentFeatureFlagGuard'];
  let finesSectionPermissionsGuard: unknown;
  let dashboardTypeGuard: unknown;
  let finesFinanceRouting: Routes;
  let authGuard: unknown;
  let canDeactivateGuard: unknown;
  let aecRouting: Routes;
  let autoPaymentInRouting: Routes;
  let childRoutes: Routes;

  beforeEach(async () => {
    vi.resetModules();
    featureFlagRedirectGuardMock.mockReset();
    mockFeatureFlagRedirectGuard();

    const [
      finesRoutes,
      finesSectionPermissionsGuardModule,
      dashboardTypeGuardModule,
      finesFinanceRoutingModule,
      authGuardModule,
      canDeactivateGuardModule,
      aecRoutingModule,
      autoPaymentInRoutingModule,
    ] = await Promise.all([
      import('./fines.routes'),
      import('./guards/fines-section-permissions/fines-section-permissions.guard'),
      import('./guards/dashboard-type/dashboard-type.guard'),
      import('../fines-finance/routing/fines-finance.routes'),
      import('@hmcts/opal-frontend-common/guards/auth'),
      import('@hmcts/opal-frontend-common/guards/can-deactivate'),
      import('../fines-aec/routing/fines-aec.routes'),
      import('../fines-api/routing/fines-api.routes'),
    ]);

    finesRouting = finesRoutes.finesRouting;
    release1aFeatureFlagGuard = finesRoutes.release1aFeatureFlagGuard;
    release1bFeatureFlagGuard = finesRoutes.release1bFeatureFlagGuard;
    release1cWriteOffFeatureFlagGuard = finesRoutes.release1cWriteOffFeatureFlagGuard;
    release1cEnforcementOperationalReportingFeatureFlagGuard =
      finesRoutes.release1cEnforcementOperationalReportingFeatureFlagGuard;
    release1cPaymentFeatureFlagGuard = finesRoutes.release1cPaymentFeatureFlagGuard;
    finesSectionPermissionsGuard = finesSectionPermissionsGuardModule.finesSectionPermissionsGuard;
    dashboardTypeGuard = dashboardTypeGuardModule.dashboardTypeGuard;
    finesFinanceRouting = finesFinanceRoutingModule.routing;
    authGuard = authGuardModule.authGuard;
    canDeactivateGuard = canDeactivateGuardModule.canDeactivateGuard;
    aecRouting = aecRoutingModule.routing;
    autoPaymentInRouting = autoPaymentInRoutingModule.routing;
    childRoutes =
      finesRouting.find((route) => route.path === FINES_ROUTING_PATHS.root && route.children)?.children ?? [];
  });

  it('should create the release-1a feature flag guard from the common redirect guard', () => {
    expect(release1aFeatureFlagGuard).toBe(release1aFeatureFlagGuardMock);
  });

  it('should create the release-1b feature flag guard from the common redirect guard', () => {
    expect(release1bFeatureFlagGuard).toBe(release1bFeatureFlagGuardMock);
  });

  it('should create the release-1c-write-off feature flag guard from the common redirect guard', () => {
    expect(release1cWriteOffFeatureFlagGuard).toBe(release1cWriteOffFeatureFlagGuardMock);
  });

  it('should create the release-1c enforcement operational reporting feature flag guard from the common redirect guard', () => {
    expect(release1cEnforcementOperationalReportingFeatureFlagGuard).toBe(
      release1cEnforcementOperationalReportingFeatureFlagGuardMock,
    );
  });

  it('should create the release-1c payment feature flag guard from the common redirect guard', () => {
    expect(release1cPaymentFeatureFlagGuard).toBe(release1cPaymentFeatureFlagGuardMock);
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
