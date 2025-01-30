import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IFinesDraftRoutingPaths extends IChildRoutingPaths {
  children: {
    createAndManage: string;
    checkAndValidate: string;
    viewAllRejected: string;
  };
}
