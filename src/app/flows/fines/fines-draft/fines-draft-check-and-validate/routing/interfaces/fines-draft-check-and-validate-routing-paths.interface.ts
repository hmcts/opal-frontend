import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesDraftCheckAndValidateRoutingPaths extends IChildRoutingPaths {
  children: {
    tabs: string;
  };
}
