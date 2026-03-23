import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { ADMINISTRATION_LINKS } from './administration-links.constant';

export const ADMINISTRATION_DASHBOARD_CONFIG: IDashboardPageConfiguration = {
  title: 'Administration',
  highlights: [],
  groups: [
    {
      id: 'administration-test',
      title: 'Pending development',
      links: ADMINISTRATION_LINKS,
    },
  ],
};
