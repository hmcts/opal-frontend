import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesConsolidationRoutingPaths extends IChildRoutingPaths {
  children: {
    selectBusinessUnit: string;
  };
}
