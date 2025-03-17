import { IFinesDraftCavRoutingPaths } from '../interfaces/fines-draft-cav-routing-paths.interface';

export const FINES_DRAFT_CAV_ROUTING_PATHS: IFinesDraftCavRoutingPaths = {
  root: 'check-and-validate',
  children: {
    checker: 'checker-accounts',
  },
};
