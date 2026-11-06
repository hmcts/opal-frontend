import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAutoEnforcementConfigRoutingPaths extends IChildRoutingPaths {
  children: {
    config: string;
  };
}
