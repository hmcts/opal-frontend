import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map } from 'rxjs';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';

/**
 * Checks whether the report supports manual creation.
 *
 * @param route - The target route snapshot identifying the report.
 * @returns True when this check allows access, or an observable emitting true or a redirect to the report summary list.
 */
export const finesReportsManualCreationGuard: CanActivateFn = (route) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);

  if (
    !reportConfiguration ||
    reportConfiguration.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports
  ) {
    return true;
  }

  return opalFinesService.getReport(reportConfiguration.reportTypeId).pipe(
    map((report) => {
      if (report.can_manually_create === false) {
        return router.createUrlTree([
          `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportConfiguration.reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`,
        ]);
      }

      return true;
    }),
  );
};
