import { Routes } from '@angular/router';
import { FINES_SA_SEARCH_ROUTING_PATHS } from './constants/fines-sa-search-routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_SA_SEARCH_ROUTING_TITLES } from './constants/fines-sa-search-routing-titles.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';

export const routing: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../fines-sa-search-account/fines-sa-search-account.component').then(
        (c) => c.FinesSaSearchAccountComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: FINES_SA_SEARCH_ROUTING_TITLES.root,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_SA_SEARCH_ROUTING_PATHS.children.filterBusinessUnit,
    loadComponent: () =>
      import('../fines-sa-search-filter-business-unit/fines-sa-search-filter-business-unit.component').then(
        (c) => c.FinesSaSearchFilterBusinessUnitComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: FINES_SA_SEARCH_ROUTING_TITLES.children.filterBusinessUnit,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_SA_SEARCH_ROUTING_PATHS.children.problem,
    loadComponent: () =>
      import('../fines-sa-search-problem/fines-sa-search-problem.component').then(
        (c) => c.FinesSaSearchProblemComponent,
      ),
    canActivate: [authGuard],
    data: {
      title: FINES_SA_SEARCH_ROUTING_TITLES.children.problem,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
