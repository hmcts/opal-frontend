import { describe, expect, it, vi } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from './constants/fines-routing-paths.constant';
import {
  finesRouting,
  release1aFeatureFlagGuard,
  release1cEnforcementOperationalReportingFeatureFlagGuard,
  release1cWriteOffFeatureFlagGuard,
} from './fines.routes';
import { finesSectionPermissionsGuard } from './guards/fines-section-permissions/fines-section-permissions.guard';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
} from '../constants/release-feature-flags.constant';

const {
  featureFlagRedirectGuardMock,
  release1aFeatureFlagGuardMock,
  release1cWriteOffFeatureFlagGuardMock,
  release1cEnforcementOperationalReportingFeatureFlagGuardMock,
} = vi.hoisted(() => ({
  featureFlagRedirectGuardMock: vi.fn(),
  release1aFeatureFlagGuardMock: vi.fn(),
  release1cWriteOffFeatureFlagGuardMock: vi.fn(),
  release1cEnforcementOperationalReportingFeatureFlagGuardMock: vi.fn(),
}));

vi.mock('@hmcts/opal-frontend-common/guards/feature-flag', () => ({
  featureFlagRedirectGuard: featureFlagRedirectGuardMock.mockImplementation((featureFlagName: string) => {
    if (featureFlagName === RELEASE_1A_FEATURE_FLAG) {
      return release1aFeatureFlagGuardMock;
    }

    if (featureFlagName === RELEASE_1C_WRITE_OFF_FEATURE_FLAG) {
      return release1cWriteOffFeatureFlagGuardMock;
    }

    return release1cEnforcementOperationalReportingFeatureFlagGuardMock;
  }),
}));

describe('fines routes', () => {
  const childRoutes =
    finesRouting.find((route) => route.path === FINES_ROUTING_PATHS.root && route.children)?.children ?? [];

  it('should create the release-1a feature flag guard from the common redirect guard', () => {
    expect(featureFlagRedirectGuardMock).toHaveBeenCalledWith(RELEASE_1A_FEATURE_FLAG);
    expect(release1aFeatureFlagGuard).toBe(release1aFeatureFlagGuardMock);
  });

  it('should create the release-1c write-off feature flag guard from the common redirect guard', () => {
    expect(featureFlagRedirectGuardMock).toHaveBeenCalledWith(RELEASE_1C_WRITE_OFF_FEATURE_FLAG);
    expect(release1cWriteOffFeatureFlagGuard).toBe(release1cWriteOffFeatureFlagGuardMock);
  });

  it('should create the release-1c enforcement operational reporting feature flag guard from the common redirect guard', () => {
    expect(featureFlagRedirectGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
    );
    expect(release1cEnforcementOperationalReportingFeatureFlagGuard).toBe(
      release1cEnforcementOperationalReportingFeatureFlagGuardMock,
    );
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

  it('should guard the MAC journey root behind release-1a', () => {
    const macRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.mac.root);

    expect(macRoute?.canActivate).toContain(release1aFeatureFlagGuard);
    expect(macRoute?.canActivateChild).toContain(release1aFeatureFlagGuard);
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
});
