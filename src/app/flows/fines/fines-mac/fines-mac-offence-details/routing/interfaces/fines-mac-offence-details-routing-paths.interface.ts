import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesMacOffenceDetailsRoutingPaths extends IChildRoutingPaths {
  children: {
    reviewOffences: string;
    addOffence: string;
    searchOffences: string;
    removeImposition: string;
  };
}
