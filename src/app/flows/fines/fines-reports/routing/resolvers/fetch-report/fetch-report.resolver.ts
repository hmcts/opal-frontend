import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { catchError, of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

const REPORT_TYPE_IDS_WITH_PENDING_GET_REPORT_PERMISSION_SUPPORT = [
  FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
  FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
];
const REPORT_METADATA_FALLBACKS: Partial<Record<string, Pick<IOpalFinesReport, 'report_title'>>> = {
  [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement]: {
    report_title: 'Operational report (by enforcement)',
  },
  [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments]: {
    report_title: 'Operational report (by payments)',
  },
};

const buildFallbackReport = (reportTypeId: string): IOpalFinesReport | null => {
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

  if (!report?.permissionIds.length) {
    return null;
  }

  return {
    report_id: report.id,
    report_title: REPORT_METADATA_FALLBACKS[reportTypeId]?.report_title ?? report.heading,
    report_group: 'Operational Reports',
    supported_file_types: [],
    audited_report: false,
    report_parameters: {},
    supports_multiple_business_units: true,
    is_bespoke_journey: true,
    shown_as_worklist: false,
    permission: null,
    can_manually_create: true,
  };
};

export const fetchReportResolver: ResolveFn<IOpalFinesReport | null> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId') ?? '';
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

  if (!report?.permissionIds.length) {
    return of(null);
  }

  // TODO PO-2305/PO-2250: remove this fallback once opal-fines-service supports
  // operational report permissions on GET /reports/{reportTypeId}. The current backend
  // report rows have null permissions and return 403. The common HTTP error
  // interceptor redirects 403 responses to permission-denied before route fallback
  // recovery can complete, so these report types temporarily bypass the API call.
  if (REPORT_TYPE_IDS_WITH_PENDING_GET_REPORT_PERMISSION_SUPPORT.includes(reportTypeId)) {
    return of(buildFallbackReport(reportTypeId));
  }

  return opalFinesService.getReport(reportTypeId).pipe(catchError(() => of(null)));
};
