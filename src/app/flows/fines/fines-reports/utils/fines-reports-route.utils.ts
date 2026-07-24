import { ActivatedRouteSnapshot } from '@angular/router';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { IFinesReportSummaryListReportConfiguration } from '../fines-reports-summary-list/interfaces/fines-report-summary-list-report-configuration.interface';

/**
 * Gets the report type ID from a fines reports route.
 *
 * The current route is checked first, followed by the parent route, so child routes can reuse the report type from
 * the parent `:reportTypeId` or `:reportId` route parameter.
 *
 * @param route - The activated route snapshot to read the report ID from.
 * @returns The report type ID, or null when no report ID exists on the route tree.
 */
export const getFinesReportsRouteReportTypeId = (route: ActivatedRouteSnapshot): string | null => {
  return (
    route.paramMap.get('reportTypeId') ??
    route.paramMap.get('reportId') ??
    route.parent?.paramMap.get('reportTypeId') ??
    route.parent?.paramMap.get('reportId') ??
    null
  );
};

/**
 * Gets the configured report summary list route metadata for a fines reports route.
 *
 * The configuration is resolved by matching the route report type ID against the report summary list configuration.
 *
 * @param route - The activated route snapshot used to resolve the report type ID.
 * @returns The matching report configuration, or null when the route does not map to a configured report.
 */
export const getFinesReportsRouteConfiguration = (
  route: ActivatedRouteSnapshot,
): IFinesReportSummaryListReportConfiguration | null => {
  const reportTypeId = getFinesReportsRouteReportTypeId(route);

  return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId) ?? null;
};
