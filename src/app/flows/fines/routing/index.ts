import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard, routePermissionsGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { routing as macRouting } from '@routing/fines/mac';
import { FinesRoutingPaths } from '@enums/fines';
import { RoutingPaths } from '@enums';
import { FINES_ROUTE_PERMISSIONS } from '@constants/fines';

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
        children: macRouting,
        canActivate: [authGuard, routePermissionsGuard],
        canDeactivate: [canDeactivateGuard],
        data: { routePermissionId: FINES_ROUTE_PERMISSIONS[FinesRoutingPaths.finesMac] },
      },
    ],
    resolve: { userState: userStateResolver },
  },
];
