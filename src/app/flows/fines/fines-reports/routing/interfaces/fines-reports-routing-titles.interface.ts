import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesReportsRoutingTitles extends IChildRoutingPaths {
  children: {
    create: string;
    reportSummary: string;
    summaryList: string;
    selectBusinessUnits: string;
    businessUnitWarning: string;
  };
}
