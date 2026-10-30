import { IFinesMciRoutingPaths } from '../interfaces/fines-mci-routing-paths.interface';

export const FINES_MCI_ROUTING_PATHS: IFinesMciRoutingPaths = {
  root: 'manual-cash-input',
  children: {
    createAllocate: 'create-allocate',
    paymentCategoryCriminalMatches: 'create/till/payment/category/criminal/matches',
    paymentCategoryCriminalSearch: 'create/till/payment/category/criminal/search',
    create: 'create',
    till: 'till',
    selectBusinessUnit: 'select-bu',
    details: 'details',
    paymentCategory: 'payment-category',
    cancel: 'cancel',
  },
};
