import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';
import { IParentRoutingPaths } from '@routing/flows/interfaces/parent-routing-paths.interface';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    mac: IChildRoutingPaths;
    draft: IChildRoutingPaths;
  };
}
