import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINANCE_LINKS } from './finance-links.constant';

export const FINANCE_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Finance',
  highlights: [],
  groups: [
    {
      id: 'payments-in',
      title: 'Payments in',
      links: FINANCE_LINKS,
    },
  ],
};
