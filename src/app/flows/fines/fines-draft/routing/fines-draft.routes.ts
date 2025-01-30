import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from './constants/fines-draft-routing-paths.constant';
import { RoutingPaths } from '@routing/enums/routing-paths';
import { authGuard } from '@guards/auth/auth.guard';
import { routePermissionsGuard } from '@guards/route-permissions/route-permissions.guard';
import { FINES_DRAFT_ROUTING_PERMISSIONS } from './constants/fines-draft-routing-permissions.constant';
import { IFinesDraftRoutingPermissions } from './interfaces/fines-draft-routing-permissions.interface';

const draftCheckAndValidateRootPath = FINES_DRAFT_ROUTING_PATHS.children.checkAndValidate;
const draftCheckAndValidatePermissionId =
  FINES_DRAFT_ROUTING_PERMISSIONS[draftCheckAndValidateRootPath as keyof IFinesDraftRoutingPermissions];
const draftCreateAndManageRootPath = FINES_DRAFT_ROUTING_PATHS.children.createAndManage;
const draftCreateAndManagePermissionId =
  FINES_DRAFT_ROUTING_PERMISSIONS[draftCreateAndManageRootPath as keyof IFinesDraftRoutingPermissions];

export const routing: Routes = [
  {
    path: FINES_DRAFT_ROUTING_PATHS.root,
    redirectTo: RoutingPaths.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.createAndManage,
    loadComponent: () =>
      import('../fines-draft-cam/fines-draft-cam-inputter/fines-draft-cam-inputter.component').then(
        (c) => c.FinesDraftCamInputterComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: { routePermissionId: draftCreateAndManagePermissionId },
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.viewAllRejected,
    loadComponent: () =>
      import('../fines-draft-view-all-rejected/fines-draft-view-all-rejected.component').then(
        (c) => c.FinesDraftViewAllRejectedComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: { routePermissionId: draftCreateAndManagePermissionId },
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.checkAndValidate,
    loadComponent: () =>
      import('../fines-draft-cav/fines-draft-cav-checker/fines-draft-cav-checker.component').then(
        (c) => c.FinesDraftCavCheckerComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: { routePermissionId: draftCheckAndValidatePermissionId },
  },
];
