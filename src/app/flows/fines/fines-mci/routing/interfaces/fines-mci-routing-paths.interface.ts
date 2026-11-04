import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesMciRoutingPaths extends IChildRoutingPaths {
  children: {
    createAllocate: string;
    create: string;
    till: string;
    selectBusinessUnit: string;
    details: string;
    paymentCategory: string;
    payment: string;
    category: string;
    criminal: string;
    search: string;
    matches: string;
    suspenseDetails: string;
    courtFeeDetails: string;
    searchAccount: string;
    cancel: string;
  };
}
