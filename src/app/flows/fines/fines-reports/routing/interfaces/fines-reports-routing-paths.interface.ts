import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesReportsRoutingPaths extends IChildRoutingPaths {
  children: {
    create: string;
    summaryList: string;
  };
}
