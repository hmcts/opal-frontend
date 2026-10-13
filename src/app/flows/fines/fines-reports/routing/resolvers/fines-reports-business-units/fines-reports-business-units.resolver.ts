import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { of, switchMap } from 'rxjs';
import {
  getFinesReportsRouteConfiguration,
  getFinesReportsRouteReportTypeId,
} from '../../../utils/fines-reports-route.utils';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

/**
 * Resolves available business units using the report metadata permission.
 *
 * @param route - The route snapshot identifying the report.
 * @returns An observable emitting business unit reference data, or a redirect to access denied
 * when no report permission exists.
 */
export const finesReportsBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData | RedirectCommand> = (
  route,
) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);

  if (
    !reportConfiguration ||
    getFinesReportsRouteReportTypeId(route) === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports
  ) {
    return opalFinesService.getBusinessUnits();
  }

  return opalFinesService.getReport(reportConfiguration.reportTypeId).pipe(
    switchMap((report) => {
      const permission = report.report_permission ?? report.permission;

      if (!permission) {
        return of(new RedirectCommand(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`])));
      }

      return opalFinesService.getBusinessUnitsByPermission(permission);
    }),
  );
};
