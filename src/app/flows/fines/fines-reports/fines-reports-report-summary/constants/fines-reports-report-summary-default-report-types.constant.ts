import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from './fines-reports-report-summary-report-types.constant';
import { type FinesReportsReportSummaryReportType } from '../types/fines-reports-report-summary-report-type.type';

export const FINES_REPORTS_REPORT_SUMMARY_DEFAULT_REPORT_TYPES = {
  [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement]:
    FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
  [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments]:
    FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
} as const satisfies Record<string, FinesReportsReportSummaryReportType>;
