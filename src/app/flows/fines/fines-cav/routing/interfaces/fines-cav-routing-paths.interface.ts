import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesCavRoutingPaths extends IChildRoutingPaths {
  children: {
    accounts: string;
  };
}
