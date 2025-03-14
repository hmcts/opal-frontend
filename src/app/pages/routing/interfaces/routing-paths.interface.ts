import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    dashboard: string;
  };
}
