import { IFinesMacOffenceDetailsSearchOffencesRoutingPaths } from '../interfaces/fines-mac-offence-details-search-offences-routing-paths.interface';

export const FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS: IFinesMacOffenceDetailsSearchOffencesRoutingPaths =
  {
    root: 'search-offences',
    children: {
      searchOffences: 'search-offences',
      searchOffencesResults: 'search-offences-results',
    },
  };
