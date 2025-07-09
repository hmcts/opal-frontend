import { IFinesSaSearchRoutingPaths } from '../interfaces/fines-sa-search-routing-paths.interface';

export const FINES_SA_SEARCH_ROUTING_PATHS: IFinesSaSearchRoutingPaths = {
  root: 'search',
  children: {
    filterBusinessUnit: 'filter-business-units',
    problem: 'problem',
  },
};
