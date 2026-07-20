import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { catchError, map, of, switchMap } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

export const finesReportsStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const finesReportsStore = inject(FinesReportsStore);
  const opalFinesService = inject(OpalFines);
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

  const requiresCreateReport = route.data['requiresCreateReport'] === true;
  const requiresSelectedBusinessUnits = route.data['requiresSelectedBusinessUnits'] === true;

  if (!report.requiresReportMetadata) {
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

  return opalFinesService.getReport(report.id).pipe(
    switchMap((reportMetadata) => {
      if (!reportMetadata.permission) {
        return of(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]));
      }

      if (requiresCreateReport && !reportMetadata.can_manually_create) {
        return of(
          router.createUrlTree([
            '/',
            FINES_ROUTING_PATHS.root,
            FINES_ROUTING_PATHS.children.reports.root,
            report.id,
            FINES_REPORTS_ROUTING_PATHS.children.summaryList,
          ]),
        );
      }

      return opalFinesService.getBusinessUnitsByPermission(reportMetadata.permission).pipe(
        map((businessUnits) => {
          if (businessUnits.refData.length === 0) {
            return router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
          }

          if (requiresSelectedBusinessUnits && !finesReportsStore.hasSelectedBusinessUnitsForReport(report.id)) {
            return router.createUrlTree([
              `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${report.id}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
            ]);
          }

          return true;
        }),
      );
    }),
    catchError(() => of(false)),
  );
};
