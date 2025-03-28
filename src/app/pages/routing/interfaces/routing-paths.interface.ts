import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/core/interfaces';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    dashboard: string;
  };
}
