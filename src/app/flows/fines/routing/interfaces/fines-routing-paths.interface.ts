import { IChildRoutingPaths, IParentRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    mac: IChildRoutingPaths;
    draft: IChildRoutingPaths;
    acc: IChildRoutingPaths;
  };
}
