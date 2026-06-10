import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccEnfActionRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    add: string;
    denied: string;
    select: string;
  };
}
