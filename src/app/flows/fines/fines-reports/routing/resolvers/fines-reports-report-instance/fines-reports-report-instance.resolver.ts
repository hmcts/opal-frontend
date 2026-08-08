import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { map, of, switchMap } from 'rxjs';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';

export const finesReportsReportInstanceResolver: ResolveFn<IFinesReportsReportSummaryViewModel | RedirectCommand> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const dateService = inject(DateService);
  const reportInstanceId = route.paramMap.get('reportInstanceId') ?? '';
  const reportTypeId = route.parent?.paramMap.get('reportTypeId') ?? route.paramMap.get('reportTypeId') ?? '';

  // First API call: loads the permission-gated report definition for the report type in the URL. Its ID verifies
  // that the returned report instance belongs to this route, and its title supplies the summary page heading.
  return opalFinesService.getReport(reportTypeId).pipe(
    switchMap((reportDefinition) =>
      // Second API call: loads the selected instance after the route's report definition has been retrieved.
      // The comparison below prevents an instance from being viewed under a different report-type URL.
      opalFinesService.getReportInstance(reportInstanceId).pipe(
        switchMap((reportInstance) => {
          const reportDefinitionId = reportDefinition.report_id.toString();

          if (reportDefinitionId !== reportInstance.report.id.toString()) {
            return of(
              new RedirectCommand(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`])),
            );
          }

          // The report-instance response supplies an enforcement-action code, such as BWTD, rather than the
          // readable action title needed for the Enforcement criterion. Reports without this parameter do not
          // need a reference-data lookup and can be mapped immediately.
          const enforcementAction = reportInstance.report_parameters?.['enforcementAction'];

          if (typeof enforcementAction !== 'string' || enforcementAction.trim().length === 0) {
            return of(
              mapFinesReportsReportInstanceToViewModel(
                reportInstance,
                null,
                reportDefinition.report_title,
                dateService,
              ),
            );
          }

          // Additional conditional API call: resolves the action code to reference data containing its readable
          // title. This lets the mapper display, for example, "Last enforcement - Bail Warrant - dated (BWTD)"
          // instead of only "Last enforcement action (BWTD)". API failures deliberately propagate to Opal's
          // global error handling because the agreed readable Enforcement value cannot then be fully resolved.
          return opalFinesService
            .getResult(enforcementAction)
            .pipe(
              map((result) =>
                mapFinesReportsReportInstanceToViewModel(
                  reportInstance,
                  result,
                  reportDefinition.report_title,
                  dateService,
                ),
              ),
            );
        }),
      ),
    ),
  );
};
