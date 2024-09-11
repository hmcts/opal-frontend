import { IChildRoutingPaths } from '@interfaces/flows/routing';
import { IParentRoutingPaths } from '@interfaces/flows/routing';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    mac: IChildRoutingPaths;
  };
}
