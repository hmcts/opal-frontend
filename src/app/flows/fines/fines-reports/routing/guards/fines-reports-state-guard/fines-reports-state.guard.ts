import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { catchError, map, of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';

interface IFinesReportsNavigationState {
  selectedBusinessUnitIds?: number[];
}

const getSelectedBusinessUnitIdsFromNavigationState = (router: Router, location: Location): number[] => {
  const navigationState = router.currentNavigation()?.extras.state as IFinesReportsNavigationState | undefined;
  const locationState = location.getState() as IFinesReportsNavigationState | undefined;
  const selectedBusinessUnitIds = navigationState?.selectedBusinessUnitIds ?? locationState?.selectedBusinessUnitIds;

  return Array.isArray(selectedBusinessUnitIds) ? selectedBusinessUnitIds : [];
};

export const finesReportsStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const location = inject(Location);
  const permissionsService = inject(PermissionsService);
  const opalUserService = inject(OpalUserService);
  const reportId = route.paramMap.get('reportId') ?? route.parent?.paramMap.get('reportId');

  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId);

  if (!report) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  const routePermissionIds = report.permissionIds;
  const requiresCreateReport = route.data['requiresCreateReport'] === true;
  const requiresSelectedBusinessUnits = route.data['requiresSelectedBusinessUnits'] === true;

  if (routePermissionIds.length === 0) {
    if (requiresCreateReport) {
      return router.createUrlTree([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_ROUTING_PATHS.children.reports.root,
        report.id,
        FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      ]);
    }

    return true;
  }

  return opalUserService.getLoggedInUserState().pipe(
    map((resp) => {
      const uniquePermissionIds = permissionsService.getUniquePermissions(resp);

      if (!uniquePermissionIds.some((id) => routePermissionIds.includes(id))) {
        return router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
      }

      if (
        requiresSelectedBusinessUnits &&
        getSelectedBusinessUnitIdsFromNavigationState(router, location).length === 0
      ) {
        return router.createUrlTree([
          '/',
          FINES_ROUTING_PATHS.root,
          FINES_ROUTING_PATHS.children.reports.root,
          report.id,
          FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits,
        ]);
      }

      return true;
    }),
    catchError(() => of(false)),
  );
};
