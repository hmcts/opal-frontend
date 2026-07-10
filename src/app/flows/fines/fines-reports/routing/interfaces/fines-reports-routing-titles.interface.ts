import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesReportsRoutingTitles extends IChildRoutingPaths {
  children: {
    summaryList: string;
    selectBusinessUnits: string;
    businessUnitWarning: string;
  };
}
