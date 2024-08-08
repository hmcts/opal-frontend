import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { routing as macRouting } from '@routing/fines/mac';
import { FinesRoutingPaths } from '@enums/fines';
import { RoutingPaths } from '@enums';

export const routing: Routes = [
  {
    path: FinesRoutingPaths.fines,
    redirectTo: RoutingPaths.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FinesRoutingPaths.fines,
    loadComponent: () => import('../fines.component').then((c) => c.FinesComponent),
    children: [
      {
        path: FinesRoutingPaths.finesMac,
        loadComponent: () => import('../../fines/fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
        children: macRouting,
      },
    ],
    resolve: { userState: userStateResolver },
  },
];
