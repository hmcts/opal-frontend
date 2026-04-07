import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { catchError, map, of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

export const finesReportsStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const permissionsService = inject(PermissionsService);
  const opalUserService = inject(OpalUserService);
  const reportId = route.paramMap.get('reportId');

  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId);

  if (!report) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  const routePermissionIds =
    FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId)?.permissionIds ?? [];

  if (routePermissionIds.length === 0) {
    return true;
  }

  return opalUserService.getLoggedInUserState().pipe(
    map((resp) => {
      const uniquePermissionIds = permissionsService.getUniquePermissions(resp);

      if (uniquePermissionIds.some((id) => routePermissionIds.includes(id))) {
        return true;
      }

      return router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    }),
    catchError(() => of(false)),
  );
};
