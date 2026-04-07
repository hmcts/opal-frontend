import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

export const FINES_REPORTS_OPERATIONAL_REPORT_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesReportsOperationalReportsByEnforcementLink',
    text: 'Operational Reports (by enforcement)',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      FINES_ROUTING_PATHS.children.reports.children['summaryList'],
    ],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-enforcement']],
    newTab: false,
    style: 'guidance-panel-blue',
  },
  {
    id: 'finesReportsOperationalReportsByPaymentLink',
    text: 'Operational Reports (by payment)',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      FINES_ROUTING_PATHS.children.reports.children['summaryList'],
    ],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-payments']],
    newTab: false,
    style: 'guidance-panel-blue',
  },
];
