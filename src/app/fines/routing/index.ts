import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { routing as macRouting } from '../fines-mac/routing';
import { FinesRoutingPaths } from '../enums/fines-routing-paths';

export const routing: Routes = [
  {
    path: FinesRoutingPaths.fines,
    loadComponent: () => import('../../fines/fines.component').then((c) => c.FinesComponent),
    children: [
      {
        path: '',
        redirectTo: 'manual-account-creation',
        pathMatch: 'full',
      },
      {
        path: FinesRoutingPaths.finesMac,
        loadComponent: () => import('../../fines/fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        canActivate: [authGuard],
        children: macRouting,
      },
    ],
    resolve: { userState: userStateResolver },
    canDeactivate: [canDeactivateGuard],
  },
];
