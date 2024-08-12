import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard, routePermissionsGuard } from '@guards';
import { userStateResolver } from '@resolvers';
import { routing as macRouting } from '@routing/fines/mac';
import { RoutingPaths } from '@enums';
import { FINES_ROUTE_PERMISSIONS, FINES_ROUTING_PATHS } from '@constants/fines';
import { IFinesRoutingPermissions } from '@interfaces/fines';

const macRootPath = FINES_ROUTING_PATHS.children.mac.root;
const macRootPermissionId = FINES_ROUTE_PERMISSIONS[macRootPath as keyof IFinesRoutingPermissions];

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
