import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, of, switchMap } from 'rxjs';
import { FINES_REPORTS_REPORT_SUMMARY_LAST_ACTION_MODE } from '../../../fines-reports-report-summary/constants/fines-reports-report-summary-last-action-mode.constant';
import { FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS } from '../../../fines-reports-report-summary/constants/fines-reports-report-summary-parameter-keys.constant';
import { FINES_REPORTS_REPORT_SUMMARY_SINCE_LAST_ENFORCEMENT_MODE } from '../../../fines-reports-report-summary/constants/fines-reports-report-summary-since-last-enforcement-mode.constant';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

/**
 * Loads action reference data for enforcement or payment modes that require it, then maps the summary page.
 *
 * @param reportInstance - The report instance returned by the API.
 * @param reportTitle - The report title supplied by the report definition.
 * @param opalFinesService - The fines API service used to resolve the selected mode's enforcement action.
 * @param dateService - The shared service used to parse and format dates.
 * @returns An observable emitting the mapped report summary; enforcement-action lookup failures propagate to the resolver.
 */
const resolveReportSummaryViewModel = (
  reportInstance: IOpalFinesReportInstanceDetail,
  reportTitle: string,
  opalFinesService: OpalFines,
  dateService: DateService,
) => {
  const parameters = reportInstance.report_parameters;
  let enforcementAction: unknown;

  // Each report mode stores its selected action code under a different parameter.
  if (
    parameters?.[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportEnforcementMode] ===
    FINES_REPORTS_REPORT_SUMMARY_LAST_ACTION_MODE
  ) {
    enforcementAction = parameters[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementAction];
  } else if (
    parameters?.[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportMode] ===
    FINES_REPORTS_REPORT_SUMMARY_SINCE_LAST_ENFORCEMENT_MODE
  ) {
    enforcementAction = parameters[FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.sinceLastEnforcementAction];
  }

  // Other modes do not need an action title, even if a stale action code is present.
  if (typeof enforcementAction !== 'string' || enforcementAction.trim().length === 0) {
    return of(mapFinesReportsReportInstanceToViewModel(reportInstance, null, reportTitle, dateService));
  }

  // Let a failed lookup stop navigation because the selected action's title could not be resolved.
  return opalFinesService
    .getResult(enforcementAction)
    .pipe(map((result) => mapFinesReportsReportInstanceToViewModel(reportInstance, result, reportTitle, dateService)));
};

/**
 * Loads the report definition and instance and resolves the summary page data.
 * Your reports loads the instance first to identify its report definition. Report-specific routes load
 * the definition first and check that the instance belongs to that report type.
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

  // Your reports uses a list identifier, so resolve the actual report definition from the selected instance.
  if (reportTypeId === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports) {
    return opalFinesService
      .getReportInstance(reportInstanceId)
      .pipe(
        switchMap((reportInstance) =>
          opalFinesService
            .getReport(reportInstance.report.id)
            .pipe(
              switchMap((reportDefinition) =>
                resolveReportSummaryViewModel(
                  reportInstance,
                  reportDefinition.report_title,
                  opalFinesService,
                  dateService,
                ),
              ),
            ),
        ),
      );
  }

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
