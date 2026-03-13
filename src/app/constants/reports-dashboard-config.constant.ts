import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { REPORTS_LINKS } from './reports-links.constant';

export const REPORTS_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Reports',
  highlights: [],
  groups: [
    {
      id: 'reports-test',
      title: 'Pending development',
      links: REPORTS_LINKS,
    },
  ],
};
