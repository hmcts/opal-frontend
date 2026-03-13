import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINANCE_LINKS } from './finance-links.constant';

export const FINANCE_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Finance',
  highlights: [],
  groups: [
    {
      id: 'finance-test',
      title: 'Pending development',
      links: FINANCE_LINKS,
    },
  ],
};
