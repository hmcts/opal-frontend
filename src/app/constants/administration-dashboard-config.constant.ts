import { type IFinesDashboardConfiguration } from '@app/interfaces/fines-dashboard-configuration.interface';
import { ADMINISTRATION_LINKS } from './administration-links.constant';

export const ADMINISTRATION_DASHBOARD_CONFIG: IFinesDashboardConfiguration = {
  title: 'Administration',
  highlights: [],
  groups: [
    {
      id: 'administration-placeholder',
      title: 'Pending development',
      links: ADMINISTRATION_LINKS,
    },
  ],
};
