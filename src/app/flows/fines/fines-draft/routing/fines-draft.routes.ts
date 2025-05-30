import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from './constants/fines-draft-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_DRAFT_ROUTING_PERMISSIONS } from './constants/fines-draft-routing-permissions.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_DRAFT_ROUTING_TITLES } from './constants/fines-draft-routing-titles.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { routing as createAndManageRouting } from '../fines-draft-create-and-manage/routing/fines-draft-create-and-manage.routes';
import { routing as checkAndValidateRouting } from '../fines-draft-check-and-validate/routing/fines-draft-check-and-validate.routes';

const draftRootPermissionIds = FINES_DRAFT_ROUTING_PERMISSIONS;

export const routing: Routes = [
  {
    path: FINES_DRAFT_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.createAndManage,

    loadComponent: () =>
      import('../fines-draft-create-and-manage/fines-draft-create-and-manage.component').then(
        (c) => c.FinesDraftCreateAndManageComponent,
      ),
    children: createAndManageRouting,
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
      title: FINES_DRAFT_ROUTING_TITLES.children.createAndManage,
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_DRAFT_ROUTING_PATHS.children.checkAndValidate,
    loadComponent: () =>
      import('../fines-draft-check-and-validate/fines-draft-check-and-validate.component').then(
        (c) => c.FinesDraftCheckAndValidateComponent,
      ),
    children: checkAndValidateRouting,
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['check-and-validate']],
      title: FINES_DRAFT_ROUTING_TITLES.children.checkAndValidate,
    },
    resolve: { title: TitleResolver },
  },
];
