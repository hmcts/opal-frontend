import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesApiSummaryReport } from '../../fines-api-summary-report/interfaces/fines-api-summary-report.interface';
import { mapSummaryReport } from '../../services/utils/fines-api-payload-map-summary-report.utils';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../constants/fines-api-routing-paths.constant';

/**
 * Retrieves each report afresh; HTTP failures propagate to the established error handling.
 * @param route The route containing an interface-job identifier, never a till or file identifier.
 * @returns The report model, or a safe flow-entry redirect for invalid identifiers.
 */
export const finesApiSummaryReportResolver: ResolveFn<IFinesApiSummaryReport> = (route) => {
  const service = inject(OpalFines);
  const router = inject(Router);
  const id = route.paramMap.get('interfaceJobId');
  if (!id || !/^\d+$/.test(id) || BigInt(id) <= 0n || BigInt(id) > 9223372036854775807n) {
    return new RedirectCommand(
      router.createUrlTree([
        FINES_ROUTING_PATHS.root,
        FINES_API_ROUTING_PATHS.root,
        FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
      ]),
    );
  }
  return forkJoin({
    report: service.getInterfaceJobProcessedFileSummary(id),
    sources: service.getSourceMappings(),
  }).pipe(
    map(({ report, sources }) =>
      mapSummaryReport(
        report,
        new Map(sources.map((source) => [source.code.trim().toUpperCase(), source.display_name])),
      ),
    ),
  );
};
