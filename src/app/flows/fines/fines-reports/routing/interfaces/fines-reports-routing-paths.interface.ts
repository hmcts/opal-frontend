import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesReportsRoutingPaths extends IChildRoutingPaths {
  children: {
    summaryList: string;
    selectBusinessUnits: string;
    businessUnitWarning: string;
    parameters: string;
  };
}
