import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/interfaces';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    dashboard: string;
  };
}
