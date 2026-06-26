import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_DEFINITIONS } from './fines-reports-definitions.constant';

export const FINES_REPORTS_OPERATIONAL_REPORT_LINKS: IDashboardPageConfigurationLink[] =
  FINES_REPORTS_DEFINITIONS.filter((report) => !!report.operationalLinkId).map((report) => ({
    id: report.operationalLinkId!,
    text: report.heading,
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      report.id,
      FINES_ROUTING_PATHS.children.reports.children['summaryList'],
    ],
    fragment: null,
    permissionIds: report.permissionIds,
    newTab: false,
    style: 'guidance-panel-blue',
  }));
