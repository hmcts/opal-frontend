import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS } from './constants/fines-mac-offence-details-search-offences-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES } from './constants/fines-mac-offence-details-search-offences-routing-titles.constant';
import { finesMacOffenceDetailsSearchOffencesFlowStateGuard } from '../guards/fines-mac-offence-details-search-offences-flow-state.guard';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { finesMacOffenceDetailsSearchOffencesResolver } from './resolvers/fines-mac-offence-details-search-offences.resolver';

export const routing: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-search-offences-search/fines-mac-offence-details-search-offences-search.component'
      ).then((c) => c.FinesMacOffenceDetailsSearchOffencesSearchComponent),
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES.children.searchOffences },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.children.searchOffencesResults,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-search-offences-results/fines-mac-offence-details-search-offences-results.component'
      ).then((c) => c.FinesMacOffenceDetailsSearchOffencesResultsComponent),
    canActivate: [finesMacOffenceDetailsSearchOffencesFlowStateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES.children.searchOffencesResults },
    resolve: { 
      title: TitleResolver,
      searchResults: finesMacOffenceDetailsSearchOffencesResolver,
    },
  },
];
