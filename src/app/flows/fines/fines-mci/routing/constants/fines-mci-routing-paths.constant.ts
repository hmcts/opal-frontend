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
    payment: 'payment',
    category: 'category',
    criminal: 'criminal',
    search: 'search',
    matches: 'matches',
    searchAccount: 'search-account',
    cancel: 'cancel',
  },
};
