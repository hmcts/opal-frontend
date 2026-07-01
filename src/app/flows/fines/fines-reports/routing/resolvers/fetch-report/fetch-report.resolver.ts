import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { catchError, of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

const REPORT_IDS_WITH_PENDING_GET_REPORT_PERMISSION_SUPPORT = [
  FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
  FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
];

export const fetchReportResolver: ResolveFn<IOpalFinesReport | null> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const reportId = route.paramMap.get('reportId') ?? route.parent?.paramMap.get('reportId') ?? '';
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId);

  if (!report?.permissionIds.length) {
    return of(null);
  }

  // TODO PO-2305/PO-2250: remove this bypass once opal-fines-service supports
  // operational report permissions on GET /reports/{reportId}. The current backend
  // report rows have null permissions and return 403, so the frontend temporarily
  // falls back to local report configuration for these two report types.
  if (REPORT_IDS_WITH_PENDING_GET_REPORT_PERMISSION_SUPPORT.includes(reportId)) {
    return of(null);
  }

  return opalFinesService.getReport(reportId).pipe(catchError(() => of(null)));
};
