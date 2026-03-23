import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccEnfOverrideAddChangeRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    add: string;
    remove: string;
    change: string;
  };
}
