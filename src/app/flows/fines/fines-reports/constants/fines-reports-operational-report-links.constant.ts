import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-titles.constant';

export const FINES_REPORTS_OPERATIONAL_REPORT_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesReportsOperationalReportsByEnforcementLink',
    text: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      FINES_ROUTING_PATHS.children.reports.children['summaryList'],
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
  {
    id: 'finesReportsOperationalReportsByPaymentLink',
    text: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      FINES_ROUTING_PATHS.children.reports.children['summaryList'],
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
];
