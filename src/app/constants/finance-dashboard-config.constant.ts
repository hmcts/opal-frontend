import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_EXTERNAL_BANKING_LINKS } from '@app/flows/fines/fines-finance/constants/fines-finance-links.constant';
import { FINANCE_LINKS } from './finance-links.constant';

export const FINANCE_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Finance',
  highlights: [],
  groups: [
    {
      id: 'cash',
      title: 'Cash',
      links: FINANCE_LINKS,
    },
    {
      id: 'banking-placeholder',
      title: 'External banking interface',
      links: [...FINES_EXTERNAL_BANKING_LINKS],
    },
  ],
};
