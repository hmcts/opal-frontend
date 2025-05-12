import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from '../../routing/constants/fines-draft-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { IFinesDraftCheckAndManageRoutingPermissions } from './interfaces/fines-draft-check-and-manage-routing-permissions.interface';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PERMISSIONS } from './constants/fines-draft-check-and-manage-routing-permissions.constant';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from './constants/fines-draft-check-and-manage-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_TITLES } from './constants/fines-draft-check-and-manage-routing-titles.constant';
import { finesDraftCheckAndManageTabResolver } from './resolvers/fines-draft-check-and-manage-tab.resolver';
import { finesDraftCheckAndManageRejectedCountResolver } from './resolvers/fines-draft-check-and-manage-rejected-count.resolver';

const draftCreateAndManageRootPath = FINES_DRAFT_ROUTING_PATHS.children.createAndManage;
const draftCreateAndManagePermissionId =
  FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PERMISSIONS[
    draftCreateAndManageRootPath as keyof IFinesDraftCheckAndManageRoutingPermissions
  ];

export const routing: Routes = [
  {
    path: FINES_DRAFT_ROUTING_PATHS.root,
    redirectTo: FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS.children.tabs,
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS.children.tabs,
    loadComponent: () =>
      import('../fines-draft-check-and-manage-tabs/fines-draft-check-and-manage-tabs.component').then(
        (c) => c.FinesDraftCheckAndManageTabsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftCreateAndManagePermissionId],
      title: FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_TITLES.children.tabs,
    },
    resolve: {
      title: TitleResolver,
      draftAccounts: finesDraftCheckAndManageTabResolver,
      rejectedCount: finesDraftCheckAndManageRejectedCountResolver,
    },
  },
  {
    path: FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS.children.viewAllRejected,
    loadComponent: () =>
      import('../fines-draft-view-all-rejected/fines-draft-view-all-rejected.component').then(
        (c) => c.FinesDraftViewAllRejectedComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftCreateAndManagePermissionId],
      title: FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_TITLES.children.viewAllRejected,
    },
    resolve: { title: TitleResolver },
  },
];
