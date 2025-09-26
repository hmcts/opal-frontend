import { Routes } from '@angular/router';
import { FINES_SA_SEARCH_ROUTING_PATHS } from './constants/fines-sa-search-routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_SA_SEARCH_ROUTING_TITLES } from './constants/fines-sa-search-routing-titles.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constants';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { finesSaFlowStateGuard } from '../../guards/fines-sa-flow-state/fines-sa-flow-state.guard';

const finesPermissions = FINES_PERMISSIONS;

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
      routePermissionId: [finesPermissions['search-and-view-accounts']],
    },
    resolve: {
      title: TitleResolver,
      businessUnits: fetchBusinessUnitsResolver,
    },
  },
  {
    path: FINES_SA_SEARCH_ROUTING_PATHS.children.filterBusinessUnit,
    loadComponent: () =>
      import('../fines-sa-search-filter-business-unit/fines-sa-search-filter-business-unit.component').then(
        (c) => c.FinesSaSearchFilterBusinessUnitComponent,
      ),
    canActivate: [authGuard, finesSaFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_SA_SEARCH_ROUTING_TITLES.children.filterBusinessUnit,
      routePermissionId: [finesPermissions['search-and-view-accounts']],
    },
    resolve: {
      title: TitleResolver,
      businessUnits: fetchBusinessUnitsResolver,
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
