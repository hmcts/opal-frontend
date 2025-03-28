import { Routes } from '@angular/router';
import { routing as macRouting } from '../fines-mac/routing/fines-mac.routes';
import { routing as draftCamRouting } from '../fines-draft/fines-draft-cam/routing/fines-draft-cam.routes';
import { IFinesRoutingPermissions } from '@routing/fines/interfaces/fines-routing-permissions.interface';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ROUTING_PERMISSIONS } from '@routing/fines/constants/fines-routing-permissions.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { authGuard, canDeactivateGuard, routePermissionsGuard } from '@hmcts/opal-frontend-common/guards';
import { userStateResolver } from '@hmcts/opal-frontend-common/resolvers';

const macRootPath = FINES_ROUTING_PATHS.children.mac.root;
const macRootPermissionId = FINES_ROUTING_PERMISSIONS[macRootPath as keyof IFinesRoutingPermissions];
const draftCamRootPath = FINES_ROUTING_PATHS.children.draftCam.root;
const draftCamPermissionId = FINES_ROUTING_PERMISSIONS[draftCamRootPath as keyof IFinesRoutingPermissions];

export const finesRouting: Routes = [
  {
    path: FINES_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
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
        path: FINES_ROUTING_PATHS.children.draftCam.root,
        loadComponent: () =>
          import('../fines-draft/fines-draft-cam/fines-draft-cam.component').then((c) => c.FinesDraftCamComponent),
        children: draftCamRouting,
        canActivate: [authGuard, routePermissionsGuard],
        data: { routePermissionId: draftCamPermissionId },
      },
    ],
    resolve: { userState: userStateResolver },
  },
];
