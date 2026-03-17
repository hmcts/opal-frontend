import { IFinesAccDefendantRoutingPaths } from '../interfaces/fines-acc-defendant-routing-paths.interface';

export const FINES_ACC_DEFENDANT_ROUTING_PATHS: IFinesAccDefendantRoutingPaths = {
  root: 'defendant',
  children: {
    details: 'details',
    convert: 'convert',
    note: 'note',
    comments: 'comments',
    debtor: 'debtor',
    'payment-terms': 'payment-terms',
    party: 'party',
    'payment-card': 'payment-card',
  },
};
