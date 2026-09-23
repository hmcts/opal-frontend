import { IFinesMciRoutingPaths } from '../interfaces/fines-mci-routing-paths.interface';

export const FINES_MCI_ROUTING_PATHS: IFinesMciRoutingPaths = {
  root: 'manual-cash-input',
  children: {
    createAllocate: 'create-allocate',
    createTillSelectBusinessUnit: 'create/till/select-bu',
    createTillDetails: 'create/till/details',
    createTillPaymentCategory: 'create/till/payment-category',
    createTillCancel: 'create/till/cancel',
  },
};
