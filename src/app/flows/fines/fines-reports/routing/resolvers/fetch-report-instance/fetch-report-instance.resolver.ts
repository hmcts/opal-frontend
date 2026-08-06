import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';

/** Validates the numeric report-instance IDs accepted by the report-instance API. */
const REPORT_INSTANCE_ID_API_PATTERN = /^\d+$/;

export const fetchReportInstanceResolver: ResolveFn<IFinesReportsReportSummaryViewModel | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const reportInstanceId = route.paramMap.get('reportInstanceId') ?? '';
  const reportTypeId = route.parent?.paramMap.get('reportTypeId') ?? route.paramMap.get('reportTypeId') ?? '';

  if (!reportInstanceId || !REPORT_INSTANCE_ID_API_PATTERN.test(reportInstanceId)) {
    return of(
      new RedirectCommand(
        router.createUrlTree([
          '/',
          FINES_ROUTING_PATHS.root,
          FINES_REPORTS_ROUTING_PATHS.root,
          reportTypeId,
          FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        ]),
      ),
    );
  }

  return opalFinesService.getReport(reportTypeId).pipe(
    switchMap((reportDefinition) =>
      opalFinesService.getReportInstance(reportInstanceId).pipe(
        switchMap((reportInstance) => {
          const reportDefinitionId = reportDefinition.report_id.toString();

          if (reportDefinitionId !== reportInstance.report.id.toString()) {
            return of(
              new RedirectCommand(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`])),
            );
          }

          const enforcementAction = reportInstance.report_parameters?.['enforcementAction'];

          if (typeof enforcementAction !== 'string' || enforcementAction.trim().length === 0) {
            return of(mapFinesReportsReportInstanceToViewModel(reportInstance, null, reportDefinition.report_title));
          }

          return opalFinesService.getResult(enforcementAction).pipe(
            map((result) =>
              mapFinesReportsReportInstanceToViewModel(reportInstance, result, reportDefinition.report_title),
            ),
            catchError(() =>
              of(mapFinesReportsReportInstanceToViewModel(reportInstance, null, reportDefinition.report_title)),
            ),
          );
        }),
      ),
    ),
  );
};
