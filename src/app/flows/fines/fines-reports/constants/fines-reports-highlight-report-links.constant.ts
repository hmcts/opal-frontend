import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_DEFINITIONS } from './fines-reports-definitions.constant';

export const FINES_REPORTS_HIGHLIGHT_REPORT_LINKS: IDashboardPageConfigurationLink[] = FINES_REPORTS_DEFINITIONS.filter(
  (report) => !!report.highlightLinkId,
).map((report) => ({
  id: report.highlightLinkId!,
  text: report.highlightLinkText ?? report.heading,
  routerLink: [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_REPORTS_ROUTING_PATHS.root,
    report.id,
    FINES_REPORTS_ROUTING_PATHS.children.summaryList,
  ],
  fragment: null,
  permissionIds: report.permissionIds,
  newTab: false,
  style: 'guidance-panel-blue',
}));
