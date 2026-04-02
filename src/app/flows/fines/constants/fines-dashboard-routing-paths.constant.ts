import { IFinesDashboardRoutingPaths } from '../interfaces/fines-dashboard-routing-paths.interface';

export const FINES_DASHBOARD_ROUTING_PATHS: IFinesDashboardRoutingPaths = {
  root: 'dashboard',
  children: {
    search: 'search',
    accounts: 'accounts',
    finance: 'finance',
    reports: 'reports',
    administration: 'administration',
  },
};
