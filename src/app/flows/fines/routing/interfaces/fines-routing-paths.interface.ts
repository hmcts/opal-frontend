import { IChildRoutingPaths, IParentRoutingPaths } from '@interfaces/flows/routing';

export interface IFinesRoutingPaths extends IParentRoutingPaths {
  children: {
    mac: IChildRoutingPaths;
  };
}
