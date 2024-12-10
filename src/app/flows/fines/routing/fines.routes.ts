import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth.guard';
import { canDeactivateGuard } from '@guards/can-deactivate/can-deactivate.guard';
import { routePermissionsGuard } from '@guards/route-permissions/route-permissions.guard';
import { userStateResolver } from '@resolvers/user-state/user-state.resolver';
import { routing as macRouting } from '../fines-mac/routing/fines-mac.routes';
import { routing as cavRouting } from '../fines-cav/routing/fines-cav.routes';
import { RoutingPaths } from '@routing/enums/routing-paths';

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
        loadComponent: () => import('../fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        children: macRouting,
        canActivate: [authGuard, routePermissionsGuard],
        canDeactivate: [canDeactivateGuard],
        data: { routePermissionId: macRootPermissionId },
      },
      {
        path: FINES_ROUTING_PATHS.children.cav.root,
        loadComponent: () => import('../fines-cav/fines-cav.component').then((c) => c.FinesCavComponent),
        children: cavRouting,
        canActivate: [authGuard, routePermissionsGuard],
        data: { routePermissionId: macRootPermissionId },
      },
    ],
    resolve: { userState: userStateResolver },
  },
];
