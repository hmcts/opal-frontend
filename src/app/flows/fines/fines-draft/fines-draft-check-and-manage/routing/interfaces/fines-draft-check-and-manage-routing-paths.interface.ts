import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesDraftCheckAndManageRoutingPaths extends IChildRoutingPaths {
  children: {
    tabs: string;
    viewAllRejected: string;
  };
}
