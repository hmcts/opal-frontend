import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesDraftRoutingPaths extends IChildRoutingPaths {
  children: {
    createAndManage: string;
    checkAndValidate: string;
  };
}
