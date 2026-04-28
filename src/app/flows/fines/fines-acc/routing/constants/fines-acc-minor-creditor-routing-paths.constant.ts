import { IFinesAccMinorCreditorRoutingPaths } from '../interfaces/fines-acc-minor-creditor-routing-paths.interface';

export const FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS: IFinesAccMinorCreditorRoutingPaths = {
  root: 'minor-creditor',
  children: {
    details: 'details',
    note: 'note',
    'payment-hold': 'payment-hold',
  },
};
