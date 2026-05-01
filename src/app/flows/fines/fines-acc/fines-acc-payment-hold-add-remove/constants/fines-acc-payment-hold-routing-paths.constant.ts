import { IFinesAccPaymentHoldRoutingPaths } from '../interfaces/fines-acc-payment-hold-routing-paths.interface';

export const FINES_ACC_PAYMENT_HOLD_ROUTING_PATHS: IFinesAccPaymentHoldRoutingPaths = {
  root: 'payment-hold',
  children: {
    add: 'add',
    remove: 'remove',
    denied: 'denied',
  },
};
