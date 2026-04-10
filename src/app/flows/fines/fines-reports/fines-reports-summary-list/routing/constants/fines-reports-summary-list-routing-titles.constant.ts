import { IFinesReportsSummaryListRoutingPaths } from '../interfaces/fines-reports-summary-list-routing-paths.interface';

export const FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES: IFinesReportsSummaryListRoutingPaths = {
  root: 'Reports',
  children: {
    operationalReportsByEnforcement: 'Operational reports (by enforcement)',
    operationalReportsByPayments: 'Operational reports (by payments)',
    yourReports: 'Your reports',
  },
};
