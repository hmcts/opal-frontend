import { Routes } from '@angular/router';
import { PAGES_ROUTING_TITLES } from './constants/routing-titles.constant';
import { PAGES_ROUTING_PATHS } from './constants/routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { accountGuard } from '@hmcts/opal-frontend-common/guards/account';

export const routing: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: PAGES_ROUTING_PATHS.children.dashboard,
    loadComponent: () => import('../dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [accountGuard, authGuard, routePermissionsGuard],
    data: { title: PAGES_ROUTING_TITLES.children.dashboard },
    resolve: { title: TitleResolver },
  },
];
