import { IFinesSaRoutingPaths } from '../interfaces/fines-sa-routing-paths.interface';

export const FINES_SA_ROUTING_PATHS: IFinesSaRoutingPaths = {
  root: 'search-accounts',
  children: {
    search: 'search',
    results: 'results',
  },
};
