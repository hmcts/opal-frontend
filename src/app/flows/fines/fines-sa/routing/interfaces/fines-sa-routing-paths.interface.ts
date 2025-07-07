import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesSaRoutingPaths extends IChildRoutingPaths {
  children: {
    search: string;
    results: string;
  };
}
