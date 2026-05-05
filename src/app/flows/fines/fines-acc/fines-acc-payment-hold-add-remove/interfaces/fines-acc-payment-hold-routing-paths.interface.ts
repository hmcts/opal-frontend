import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesAccPaymentHoldRoutingPaths extends IChildRoutingPaths {
  root: string;
  children: {
    add: string;
    remove: string;
    denied: string;
  };
}
