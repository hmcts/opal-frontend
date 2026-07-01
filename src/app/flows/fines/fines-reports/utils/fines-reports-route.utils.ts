import { ActivatedRouteSnapshot } from '@angular/router';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { IFinesReportSummaryListReportConfiguration } from '../fines-reports-summary-list/interfaces/fines-report-summary-list-report-configuration.interface';

export const getFinesReportsRouteReportTypeId = (route: ActivatedRouteSnapshot): string | null => {
  return (
    route.paramMap.get('reportTypeId') ??
    route.paramMap.get('reportId') ??
    route.parent?.paramMap.get('reportTypeId') ??
    route.parent?.paramMap.get('reportId') ??
    null
  );
};

export const getFinesReportsRouteConfiguration = (
  route: ActivatedRouteSnapshot,
): IFinesReportSummaryListReportConfiguration | null => {
  const reportTypeId = getFinesReportsRouteReportTypeId(route);

  return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId) ?? null;
};
