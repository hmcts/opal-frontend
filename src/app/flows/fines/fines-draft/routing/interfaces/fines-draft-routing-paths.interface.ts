import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/interfaces';

export interface IFinesDraftRoutingPaths extends IChildRoutingPaths {
  children: {
    createAndManage: string;
    checkAndValidate: string;
  };
}
