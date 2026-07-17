import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';

export const finesReportsReportHeadingResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId');

  return FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((report) => report.id === reportTypeId)?.heading ?? '';
};
