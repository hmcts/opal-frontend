import { IFinesReportsSummaryListRoutingPaths } from '../interfaces/fines-reports-summary-list-routing-paths.interface';

export const FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS: IFinesReportsSummaryListRoutingPaths = {
  root: 'reports',
  children: {
    operationalReportsByEnforcement: 'operational_report_enforcement',
    operationalReportsByPayments: 'operational_report_payment',
    yourReports: '0',
  },
};
