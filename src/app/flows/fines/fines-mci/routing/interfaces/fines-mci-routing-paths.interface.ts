import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesMciRoutingPaths extends IChildRoutingPaths {
  children: {
    createAllocate: string;
    createTillSelectBusinessUnit: string;
    createTillDetails: string;
    createTillPaymentCategory: string;
    createTillCancel: string;
  };
}
