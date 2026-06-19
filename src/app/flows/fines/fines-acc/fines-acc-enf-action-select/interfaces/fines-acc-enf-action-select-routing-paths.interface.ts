import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccEnfActionRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    add: string;
    'add-new': string;
    denied: string;
    remove: string;
    select: string;
  };
}
