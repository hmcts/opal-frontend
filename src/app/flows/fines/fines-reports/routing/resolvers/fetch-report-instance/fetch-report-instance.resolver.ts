import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { catchError, map, of, switchMap } from 'rxjs';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

const REPORT_INSTANCE_ID_API_PATTERN = /^\d+$/;

export const fetchReportInstanceResolver: ResolveFn<IFinesReportsReportSummaryViewModel | RedirectCommand | null> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const reportInstanceId = route.paramMap.get('reportInstanceId') ?? '';
  const reportTypeId = route.parent?.paramMap.get('reportTypeId') ?? route.paramMap.get('reportTypeId') ?? '';

  if (!reportInstanceId || !REPORT_INSTANCE_ID_API_PATTERN.test(reportInstanceId)) {
    return of(null);
  }

  return opalFinesService.getReportInstance(reportInstanceId).pipe(
    switchMap((reportInstance) => {
      const reportInstanceReportTypeId = reportInstance.report.id;
      const isYourReportsRoute = reportTypeId === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports;

      // A user can open different report types from "Your reports", so only perform
      // this type check when they came from a list for one specific report type.
      if (!isYourReportsRoute && reportInstanceReportTypeId !== reportTypeId) {
        return of(new RedirectCommand(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`])));
      }

      const enforcementAction = reportInstance.report_parameters?.['enforcementAction'];

      if (typeof enforcementAction !== 'string' || enforcementAction.trim().length === 0) {
        return of(mapFinesReportsReportInstanceToViewModel(reportInstance, reportInstanceReportTypeId));
      }

      return opalFinesService.getResult(enforcementAction).pipe(
        map((result) => mapFinesReportsReportInstanceToViewModel(reportInstance, reportInstanceReportTypeId, result)),
        catchError(() => of(mapFinesReportsReportInstanceToViewModel(reportInstance, reportInstanceReportTypeId))),
      );
    }),
  );
};
