import { IFinesMciRoutingPaths } from '../interfaces/fines-mci-routing-paths.interface';

export const FINES_MCI_ROUTING_PATHS: IFinesMciRoutingPaths = {
  root: 'manual-cash-input',
  children: {
    createAllocate: 'create-allocate',
    create: 'create',
    till: 'till',
    selectBusinessUnit: 'select-bu',
    details: 'details',
    paymentCategory: 'payment-category',
    suspenseDetails: 'suspense-details',
    courtFeeDetails: 'court-fee-details',
    searchAccount: 'search-account',
    cancel: 'cancel',
  },
};
