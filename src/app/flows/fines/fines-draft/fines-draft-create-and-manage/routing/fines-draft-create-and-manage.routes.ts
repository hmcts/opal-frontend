import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from '../../routing/constants/fines-draft-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from './constants/fines-draft-create-and-manage-routing-paths.constant';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_TITLES } from './constants/fines-draft-create-and-manage-routing-titles.constant';
import { finesDraftCreateAndManageRejectedCountResolver } from './resolvers/fines-draft-create-and-manage-rejected-count.resolver';
import { finesDraftCreateAndManageViewAllRejectedResolver } from './resolvers/fines-draft-create-and-manage-view-all-rejected.resolver';
import { finesDraftTabResolver } from '../../routing/resolvers/fines-draft-tab.resolver';
import { FINES_DRAFT_ROUTING_PERMISSIONS } from '../../routing/constants/fines-draft-routing-permissions.constant';

const draftRootPermissionIds = FINES_DRAFT_ROUTING_PERMISSIONS;

export const routing: Routes = [
  {
    path: FINES_DRAFT_ROUTING_PATHS.root,
    redirectTo: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.tabs,
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.tabs,
    loadComponent: () =>
      import('../fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component').then(
        (c) => c.FinesDraftCreateAndManageTabsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_TITLES.children.tabs,
    },
    resolve: {
      title: TitleResolver,
      draftAccounts: finesDraftTabResolver({
        useFragmentForStatuses: true,
        includeSubmittedBy: true,
      }),
      rejectedCount: finesDraftCreateAndManageRejectedCountResolver,
    },
  },
  {
    path: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.viewAllRejected,
    loadComponent: () =>
      import(
        '../fines-draft-create-and-manage-view-all-rejected/fines-draft-create-and-manage-view-all-rejected.component'
      ).then((c) => c.FinesDraftCreateAndManageViewAllRejectedComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_TITLES.children.viewAllRejected,
    },
    resolve: {
      title: TitleResolver,
      allRejectedAccounts: finesDraftCreateAndManageViewAllRejectedResolver,
    },
  },
];
