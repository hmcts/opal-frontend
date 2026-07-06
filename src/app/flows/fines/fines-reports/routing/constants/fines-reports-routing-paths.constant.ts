import { IFinesReportsRoutingPaths } from '../interfaces/fines-reports-routing-paths.interface';

export const FINES_REPORTS_ROUTING_PATHS: IFinesReportsRoutingPaths = {
  root: 'reports',
  children: {
    create: 'create',
    summaryList: 'summary-list',
  },
};
