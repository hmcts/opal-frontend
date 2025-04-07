import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/interfaces';

export interface IFinesDraftCheckAndManageRoutingPaths extends IChildRoutingPaths {
  children: {
    tabs: string;
    viewAllRejected: string;
  };
}
