import { IFinesAccRemoveNonPayingPgRoutingPaths } from '../interfaces/fines-acc-remove-non-paying-pg-routing-paths.interface';

export const FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS: IFinesAccRemoveNonPayingPgRoutingPaths = {
  root: 'non-paying',
  children: {
    parentGuardian: 'parent-guardian',
  },
};
