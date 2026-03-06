import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesConRoutingPaths extends IChildRoutingPaths {
  children: {
    selectBusinessUnit: string;
    consolidateAcc: string;
  };
}
