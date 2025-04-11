import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IPagesRoutingPaths extends IChildRoutingPaths {
  children: {
    dashboard: string;
  };
}
