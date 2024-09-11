import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard, routePermissionsGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { routing as macRouting } from '../fines-mac/routing';
import { RoutingPaths } from '@enums';

import { IFinesRoutingPermissions } from '@routing/fines/interfaces/fines-routing-permissions.interface';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ROUTING_PERMISSIONS } from '@routing/fines/constants/fines-routing-permissions.constant';

const macRootPath = FINES_ROUTING_PATHS.children.mac.root;
const macRootPermissionId = FINES_ROUTING_PERMISSIONS[macRootPath as keyof IFinesRoutingPermissions];

export const finesRouting: Routes = [
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
