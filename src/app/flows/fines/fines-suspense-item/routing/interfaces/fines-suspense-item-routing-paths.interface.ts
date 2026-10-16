import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesSuspenseItemRoutingPaths extends IChildRoutingPaths {
  children: {
    search: string;
  };
}
