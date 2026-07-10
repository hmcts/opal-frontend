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
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';

export const finesReportsStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const finesReportsStore = inject(FinesReportsStore);
  const permissionsService = inject(PermissionsService);
  const opalUserService = inject(OpalUserService);
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId');

  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

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

      if (requiresSelectedBusinessUnits && !finesReportsStore.hasSelectedBusinessUnitsForReport(report.id)) {
        return router.createUrlTree([
          `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${report.id}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
        ]);
      }

      return true;
    }),
    catchError(() => of(false)),
  );
};
