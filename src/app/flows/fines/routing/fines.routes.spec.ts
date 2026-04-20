import { describe, expect, it } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from './constants/fines-routing-paths.constant';
import { finesRouting } from './fines.routes';
import { finesSectionPermissionsGuard } from './guards/fines-section-permissions/fines-section-permissions.guard';

describe('fines routes', () => {
  const childRoutes =
    finesRouting.find((route) => route.path === FINES_ROUTING_PATHS.root && route.children)?.children ?? [];

  it('should guard the draft root as an Accounts section entry route', () => {
    const draftRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.draft.root);

    expect(draftRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(draftRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    });
  });

  it('should guard the consolidation root as an Accounts section entry route', () => {
    const consolidationRoute = childRoutes.find((route) => route.path === FINES_ROUTING_PATHS.children.con.root);

    expect(consolidationRoute?.canActivate).toContain(finesSectionPermissionsGuard);
    expect(consolidationRoute?.data).toEqual({
      sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    });
  });
});
