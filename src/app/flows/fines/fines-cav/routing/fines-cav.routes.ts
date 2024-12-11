import { Routes } from '@angular/router';
import { FINES_CAV_ROUTING_PATHS } from './constants/fines-cav-routing-path';
import { authGuard } from '@guards/auth/auth.guard';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_CAV_ROUTING_PATHS.children.accounts,
    pathMatch: 'full',
  },
  {
    path: FINES_CAV_ROUTING_PATHS.children.accounts,
    loadComponent: () =>
      import('../fines-cav-accounts/fines-cav-accounts.component').then((c) => c.FinesCavAccountsComponent),
    canActivate: [authGuard],
  },
];
