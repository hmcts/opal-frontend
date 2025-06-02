import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesDraftCreateAndManageRoutingPaths extends IChildRoutingPaths {
  children: {
    tabs: string;
    viewAllRejected: string;
  };
}
