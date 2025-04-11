import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesDraftCheckAndManageRoutingPaths extends IChildRoutingPaths {
  children: {
    tabs: string;
    viewAllRejected: string;
  };
}
