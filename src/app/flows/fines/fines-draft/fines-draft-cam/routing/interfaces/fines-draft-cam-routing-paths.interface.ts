import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesDraftCamRoutingPaths extends IChildRoutingPaths {
  children: {
    inputter: string;
  };
}
