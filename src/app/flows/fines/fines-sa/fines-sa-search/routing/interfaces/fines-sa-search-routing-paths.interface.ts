import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesSaSearchRoutingPaths extends IChildRoutingPaths {
  children: {
    filterBusinessUnit: string;
    problem: string;
  };
}
