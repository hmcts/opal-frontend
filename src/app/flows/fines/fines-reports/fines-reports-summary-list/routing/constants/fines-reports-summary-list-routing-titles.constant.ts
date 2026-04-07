import { IFinesReportsSummaryListRoutingPaths } from '../interfaces/fines-reports-summary-list-routing-paths.interface';

export const FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES: IFinesReportsSummaryListRoutingPaths = {
  root: 'Reports',
  children: {
    operationalReportsByEnforcement: 'Operational Reports by Enforcement',
    operationalReportsByPayments: 'Operational Reports by Payments',
    yourReports: 'Your Reports',
  },
};
