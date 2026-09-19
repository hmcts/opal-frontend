import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, of, switchMap } from 'rxjs';
import { FINES_REPORTS_REPORT_SUMMARY_LAST_ACTION_MODE } from '../../../fines-reports-report-summary/constants/fines-reports-report-summary-last-action-mode.constant';
import { FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS } from '../../../fines-reports-report-summary/constants/fines-reports-report-summary-parameter-keys.constant';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';

/**
 * Loads action reference data only for last-action enforcement mode, then maps the instance for the summary page.
 *
 * @param reportInstance - The report instance returned by the API.
 * @param reportTitle - The report title supplied by the report definition.
 * @param opalFinesService - The fines API service used to resolve an action required by last-action enforcement mode.
 * @param dateService - The shared service used to parse and format dates.
 * @returns An observable emitting the mapped report summary; enforcement-action lookup failures propagate to the resolver.
 */
const resolveReportSummaryViewModel = (
  reportInstance: IOpalFinesReportInstanceDetail,
  reportTitle: string,
  opalFinesService: OpalFines,
  dateService: DateService,
) => {
  const enforcementMode =
    reportInstance.report_parameters?.[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportEnforcementMode];
  // The instance contains only the action code. Last-action mode needs its readable reference-data title.
  const enforcementAction =
    reportInstance.report_parameters?.[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementAction];

  // Other enforcement modes do not use an action title, even if a stale action code is present.
  if (
    enforcementMode !== FINES_REPORTS_REPORT_SUMMARY_LAST_ACTION_MODE ||
    typeof enforcementAction !== 'string' ||
    enforcementAction.trim().length === 0
  ) {
    return of(mapFinesReportsReportInstanceToViewModel(reportInstance, null, reportTitle, dateService));
  }

  // Let a failed lookup stop navigation: the Enforcement criterion could not otherwise be rendered accurately.
  return opalFinesService
    .getResult(enforcementAction)
    .pipe(map((result) => mapFinesReportsReportInstanceToViewModel(reportInstance, result, reportTitle, dateService)));
};

/**
 * Loads the report definition and instance, checks that they match, and resolves the summary page data.
 *
 * @param route - The activated route snapshot containing the instance ID and the current or parent report type ID.
 * @returns An observable emitting the summary view model or an access-denied RedirectCommand for a report-type mismatch; API failures propagate.
 */
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
