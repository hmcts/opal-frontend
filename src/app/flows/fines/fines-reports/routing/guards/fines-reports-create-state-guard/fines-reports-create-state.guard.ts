import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, of, switchMap } from 'rxjs';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';

const getReportTypeId = (route: ActivatedRouteSnapshot): string | null => {
  let currentRoute: ActivatedRouteSnapshot | null = route;

  while (currentRoute) {
    const reportTypeId = currentRoute.paramMap.get('reportTypeId');

    if (reportTypeId) {
      return reportTypeId;
    }

    currentRoute = currentRoute.parent;
  }

  return null;
};

export const finesReportsCreateStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const finesReportsStore = inject(FinesReportsStore);
  const opalFinesService = inject(OpalFines);
  const reportTypeId = getReportTypeId(route);

  if (!reportTypeId) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  return opalFinesService.getReport(reportTypeId).pipe(
    switchMap((report) => {
      if (!report.can_manually_create) {
        return of(
          router.createUrlTree([
            `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`,
          ]),
        );
      }

      const permission = report.report_permission ?? report.permission;

      if (!permission) {
        return of(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]));
      }

      return opalFinesService.getBusinessUnitsByPermission(permission).pipe(
        map((businessUnits) => {
          if (businessUnits.refData.length === 0) {
            return router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
          }

          if (
            route.data['requiresSelectedBusinessUnits'] === true &&
            !finesReportsStore.hasSelectedBusinessUnitsForReport(reportTypeId)
          ) {
            return router.createUrlTree([
              `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
            ]);
          }

          return true;
        }),
      );
    }),
  );
};
