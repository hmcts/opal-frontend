import { IFinesReportsRoutingPaths } from '../interfaces/fines-reports-routing-paths.interface';

export const FINES_REPORTS_ROUTING_PATHS: IFinesReportsRoutingPaths = {
  root: 'reports',
  children: {
    summaryList: 'summary-list',
    selectBusinessUnits: 'create/select-business-unit',
    businessUnitWarning: 'create/business-unit-warning',
    parameters: 'create/report-parameters',
  },
};
