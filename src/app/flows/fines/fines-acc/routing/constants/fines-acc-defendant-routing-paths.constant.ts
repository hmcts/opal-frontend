import { IFinesAccDefendantRoutingPaths } from '../interfaces/fines-acc-defendant-routing-paths.interface';

export const FINES_ACC_DEFENDANT_ROUTING_PATHS: IFinesAccDefendantRoutingPaths = {
  root: 'defendant',
  children: {
    details: 'details',
    note: 'note',
    comments: 'comments',
    debtor: 'debtor',
  },
};
