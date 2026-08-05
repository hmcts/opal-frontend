import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINANCE_LINKS } from './finance-links.constant';
import {FINES_EXTERNAL_BANKING_LINKS} from 'src/app/flows/fines/fines-finance/constants/fines-finance-links.constant'

export const FINANCE_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Finance',
  highlights: [],
  groups: [
    {
      id: 'finance-placeholder',
      title: 'Pending development',
      links: FINANCE_LINKS,
    },
    {
      id: 'banking-placeholder',
      title: 'External banking interface',
      links: [... FINES_EXTERNAL_BANKING_LINKS],
    },
  ],
};
