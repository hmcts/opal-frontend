import { Routes } from '@angular/router';
import { PAGES_ROUTING_TITLES } from './constants/routing-titles.constant';
import { PAGES_ROUTING_PATHS } from './constants/routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards';
import { TitleResolver, userStateResolver } from '@hmcts/opal-frontend-common/resolvers';

export const routing: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: PAGES_ROUTING_PATHS.children.dashboard,
    loadComponent: () => import('../dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [authGuard],
    data: { title: PAGES_ROUTING_TITLES.children.dashboard },
    resolve: { userState: userStateResolver, title: TitleResolver },
  },
];
