import { IFinesAccEnfActionRoutingPaths } from '../interfaces/fines-acc-enf-action-select-routing-paths.interface';

export const FINES_ACC_ENF_ACTION_ROUTING_PATHS: IFinesAccEnfActionRoutingPaths = {
  root: 'action',
  children: {
    add: 'add',
    'add-new': 'add-new',
    denied: 'denied',
    remove: 'remove',
    select: 'select',
  },
};
