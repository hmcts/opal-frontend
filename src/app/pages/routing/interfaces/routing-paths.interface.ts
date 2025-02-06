import { IChildRoutingPaths } from '@routing/flows/interfaces/child-routing-paths.interface';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    accessDenied: string;
    signIn: string;
    signInStub: string;
    dashboard: string;
  };
}
