import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, of, switchMap } from 'rxjs';
import { FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS } from '../../../fines-reports-report-summary/constants/fines-reports-report-summary-parameter-keys.constant';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';

/**
 * Loads the action reference data when a report uses it, then maps the instance for the summary page.
 */
const resolveReportSummaryViewModel = (
  reportInstance: IOpalFinesReportInstanceDetail,
  reportTitle: string,
  opalFinesService: OpalFines,
  dateService: DateService,
) => {
  // The instance contains only the action code. Reference data supplies the readable action title for the summary.
  const enforcementAction =
    reportInstance.report_parameters?.[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementAction];

  // Reports without an action criterion can be mapped without an additional API call.
  if (typeof enforcementAction !== 'string' || enforcementAction.trim().length === 0) {
    return of(mapFinesReportsReportInstanceToViewModel(reportInstance, null, reportTitle, dateService));
  }

  // Let a failed lookup stop navigation: the Enforcement criterion could not otherwise be rendered accurately.
  return opalFinesService
    .getResult(enforcementAction)
    .pipe(map((result) => mapFinesReportsReportInstanceToViewModel(reportInstance, result, reportTitle, dateService)));
};

export const finesReportsReportInstanceResolver: ResolveFn<IFinesReportsReportSummaryViewModel | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const dateService = inject(DateService);
  const reportInstanceId = route.paramMap.get('reportInstanceId') ?? '';
  const reportTypeId = route.parent?.paramMap.get('reportTypeId') ?? route.paramMap.get('reportTypeId') ?? '';

  // Load the permission-gated definition first. It validates the report type in the URL and supplies the page heading.
  return opalFinesService.getReport(reportTypeId).pipe(
    switchMap((reportDefinition) =>
      opalFinesService.getReportInstance(reportInstanceId).pipe(
        switchMap((reportInstance) => {
          // Do not allow an instance to be displayed under a different report type's URL.
          if (reportDefinition.report_id.toString() !== reportInstance.report.id.toString()) {
            return of(
              new RedirectCommand(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`])),
            );
          }

          return resolveReportSummaryViewModel(
            reportInstance,
            reportDefinition.report_title,
            opalFinesService,
            dateService,
          );
        }),
      ),
    ),
  );
};
