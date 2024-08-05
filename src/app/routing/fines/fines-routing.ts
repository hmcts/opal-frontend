import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { macRouting } from './mac-routing';

export const finesRouting: Routes = [
  {
    path: 'fines',
    loadComponent: () => import('../../pages/fines/fines.component').then((c) => c.FinesComponent),
    children: [
      {
        path: '',
        redirectTo: 'manual-account-creation',
        pathMatch: 'full',
      },
      {
        path: 'manual-account-creation',
        loadComponent: () => import('../../pages/fines/fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        canActivate: [authGuard],
        children: macRouting,
      },
    ],
    resolve: { userState: userStateResolver },
    canDeactivate: [canDeactivateGuard],
  },
];
