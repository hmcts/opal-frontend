import { IChildRoutingPaths } from './child-routing-paths.interface';

export interface IParentRoutingPaths {
  root: string;
  children: {
    [key: string]: IChildRoutingPaths;
  };
}
