import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router } from '@angular/router';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { map, of, switchMap } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';

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

export const finesReportsStateGuard: CanActivateChildFn = (route) => {
  const router = inject(Router);
  const permissionsService = inject(PermissionsService);
  const opalUserService = inject(OpalUserService);
  const finesReportsStore = inject(FinesReportsStore);
  const opalFinesService = inject(OpalFines);
  const reportTypeId = getReportTypeId(route);
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

  if (!report) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  const requiresCreateReport = route.data['requiresCreateReport'] === true;
  const requiresSelectedBusinessUnits = route.data['requiresSelectedBusinessUnits'] === true;
  const staticPermissionAccess$ =
    report.permissionIds.length === 0
      ? of(true)
      : opalUserService.getLoggedInUserState().pipe(
          map((userState) => {
            const userPermissionIds = permissionsService.getUniquePermissions(userState);

            return userPermissionIds.some((permissionId) => report.permissionIds.includes(permissionId));
          }),
        );

  return staticPermissionAccess$.pipe(
    switchMap((hasStaticPermission) => {
      if (!hasStaticPermission) {
        return of(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]));
      }

      if (!report.requiresReportMetadata) {
        if (requiresCreateReport) {
          return of(
            router.createUrlTree([
              '/',
              FINES_ROUTING_PATHS.root,
              FINES_ROUTING_PATHS.children.reports.root,
              report.reportTypeId,
              FINES_REPORTS_ROUTING_PATHS.children.summaryList,
            ]),
          );
        }

        return of(true);
      }

      return opalFinesService.getReport(report.reportTypeId).pipe(
        switchMap((reportMetadata) => {
          const permission = reportMetadata.report_permission ?? reportMetadata.permission;

          if (!permission) {
            return of(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]));
          }

          if (requiresCreateReport && !reportMetadata.can_manually_create) {
            return of(
              router.createUrlTree([
                '/',
                FINES_ROUTING_PATHS.root,
                FINES_ROUTING_PATHS.children.reports.root,
                report.reportTypeId,
                FINES_REPORTS_ROUTING_PATHS.children.summaryList,
              ]),
            );
          }

          return opalFinesService.getBusinessUnitsByPermission(permission).pipe(
            map((businessUnits) => {
              if (businessUnits.refData.length === 0) {
                return router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
              }

              if (
                requiresSelectedBusinessUnits &&
                !finesReportsStore.hasSelectedBusinessUnitsForReport(report.reportTypeId)
              ) {
                return router.createUrlTree([
                  `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${report.reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
                ]);
              }

              return true;
            }),
          );
        }),
      );
    }),
  );
};
