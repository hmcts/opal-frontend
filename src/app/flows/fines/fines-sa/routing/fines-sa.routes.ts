import { Routes } from '@angular/router';
import { FINES_SA_ROUTING_PATHS } from './constants/fines-sa-routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_SA_ROUTING_TITLES } from './constants/fines-sa-routing-titles.constant';
import { routing as searchRouting } from '../fines-sa-search/routing/fines-sa-search.routes';
import { finesSaFlowStateGuard } from '../guards/fines-sa-flow-state/fines-sa-flow-state.guard';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { finesSaIndividualAccountsResolver } from './resolvers/fines-sa-individual-accounts.resolver';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';

export const routing: Routes = [
  {
    path: FINES_SA_ROUTING_PATHS.children.search,
    loadComponent: () => import('../fines-sa-search/fines-sa-search.component').then((c) => c.FinesSaSearchComponent),
    children: searchRouting,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_SA_ROUTING_TITLES.children.search,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_SA_ROUTING_PATHS.children.results,
    loadComponent: () =>
      import('../fines-sa-results/fines-sa-results.component').then((c) => c.FinesSaResultsComponent),
    canActivate: [authGuard, finesSaFlowStateGuard],
    data: {
      title: FINES_SA_ROUTING_TITLES.children.results,
    },
    resolve: {
      title: TitleResolver,
      individualAccounts: finesSaIndividualAccountsResolver,
    },
  },
  {
    path: '',
    redirectTo: FINES_SA_ROUTING_PATHS.children.search,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: FINES_SA_ROUTING_TITLES.children.search,
    pathMatch: 'full',
  },
];
