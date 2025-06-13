import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccRoutingPaths extends IChildRoutingPaths {
  children: {
    details: string;
  };
}
