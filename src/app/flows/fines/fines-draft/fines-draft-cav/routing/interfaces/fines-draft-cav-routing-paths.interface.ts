import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesDraftCavRoutingPaths extends IChildRoutingPaths {
  children: {
    checker: string;
  };
}
