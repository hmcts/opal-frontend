import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard, routePermissionsGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { routing as macRouting } from '../fines-mac/routing';
import { RoutingPaths } from '@enums';

import { IFinesRoutingPermissions } from './interfaces';
import { FINES_ROUTING_PATHS, FINES_ROUTING_PERMISSIONS } from './constants';

const macRootPath = FINES_ROUTING_PATHS.children.mac.root;
const macRootPermissionId = FINES_ROUTING_PERMISSIONS[macRootPath as keyof IFinesRoutingPermissions];

export const routing: Routes = [
  {
    path: FINES_ROUTING_PATHS.root,
    redirectTo: RoutingPaths.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FINES_ROUTING_PATHS.root,
    loadComponent: () => import('../fines.component').then((c) => c.FinesComponent),
    children: [
      {
        path: FINES_ROUTING_PATHS.children.mac.root,
        loadComponent: () => import('../../fines/fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        children: macRouting,
        canActivate: [authGuard, routePermissionsGuard],
        canDeactivate: [canDeactivateGuard],
        data: { routePermissionId: macRootPermissionId },
      },
    ],
    resolve: { userState: userStateResolver },
  },
];
