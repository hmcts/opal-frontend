import { IChildRoutingPaths, IParentRoutingPaths } from '@hmcts/opal-frontend-common/interfaces';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    mac: IChildRoutingPaths;
    draft: IChildRoutingPaths;
  };
}
