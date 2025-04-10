import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from './constants/fines-draft-routing-paths.constant';
import { authGuard } from '@guards/auth/auth.guard';
import { routePermissionsGuard } from '@guards/route-permissions/route-permissions.guard';
import { FINES_DRAFT_ROUTING_PERMISSIONS } from './constants/fines-draft-routing-permissions.constant';
import { IFinesDraftRoutingPermissions } from './interfaces/fines-draft-routing-permissions.interface';
import { TitleResolver } from '@resolvers/title/title.resolver';
import { FINES_DRAFT_ROUTING_TITLES } from './constants/fines-draft-routing-titles.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { routing as checkAndManageRouting } from '../fines-draft-check-and-manage/routing/fines-draft-check-and-manage.routes';

const draftCheckAndValidateRootPath = FINES_DRAFT_ROUTING_PATHS.children.checkAndValidate;
const draftCheckAndValidatePermissionId =
  FINES_DRAFT_ROUTING_PERMISSIONS[draftCheckAndValidateRootPath as keyof IFinesDraftRoutingPermissions];
const draftCreateAndManageRootPath = FINES_DRAFT_ROUTING_PATHS.children.createAndManage;
const draftCreateAndManagePermissionId =
  FINES_DRAFT_ROUTING_PERMISSIONS[draftCreateAndManageRootPath as keyof IFinesDraftRoutingPermissions];

export const routing: Routes = [
  {
    path: FINES_DRAFT_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.createAndManage,

    loadComponent: () =>
      import('../fines-draft-check-and-manage/fines-draft-check-and-manage.component').then(
        (c) => c.FinesDraftCheckAndManageComponent,
      ),
    children: checkAndManageRouting,
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftCreateAndManagePermissionId],
      title: FINES_DRAFT_ROUTING_TITLES.children.createAndManage,
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.checkAndValidate,
    loadComponent: () =>
      import(
        '../fines-draft-check-and-validate/fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component'
      ).then((c) => c.FinesDraftCheckAndValidateTabsComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftCheckAndValidatePermissionId],
      title: FINES_DRAFT_ROUTING_TITLES.children.checkAndValidate,
    },
    resolve: { title: TitleResolver },
  },
];
