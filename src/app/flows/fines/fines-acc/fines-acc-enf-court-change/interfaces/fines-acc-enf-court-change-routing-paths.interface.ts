import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccEnfCourtChangeRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    change: string;
  };
}
