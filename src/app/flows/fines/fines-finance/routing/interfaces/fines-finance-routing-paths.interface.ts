import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesFinanceRoutingPaths extends IChildRoutingPaths {
  children: {
    inbound: string;
    outbound: string;
    upload: string;
  };
}
