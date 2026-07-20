import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { catchError, map, of, switchMap } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

/**
 * Checks that a report route exists and that the user can access it in at least one business unit.
 */
export const finesReportsAccessGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);
  const reportTypeId = route.paramMap.get('reportTypeId');
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

  // Reject unknown report ids before using them to load metadata or navigate within the report journey.
  if (!report) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  // Your reports is a frontend-only page, so it has no report metadata or business-unit access policy to check.
  if (!report.requiresReportMetadata) {
    return true;
  }

  // The reports API is the source of truth for the permission required by this operational report.
  return opalFinesService.getReport(report.id).pipe(
    switchMap((reportMetadata) => {
      if (!reportMetadata.permission) {
        return of(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]));
      }

      // A user may open the report only when the API returns at least one business unit for that permission.
      return opalFinesService
        .getBusinessUnitsByPermission(reportMetadata.permission)
        .pipe(
          map((businessUnits) =>
            businessUnits.refData.length > 0
              ? true
              : router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]),
          ),
        );
    }),
    // Access cannot be established if either API request fails, so cancel navigation rather than allowing it.
    catchError(() => of(false)),
  );
};
