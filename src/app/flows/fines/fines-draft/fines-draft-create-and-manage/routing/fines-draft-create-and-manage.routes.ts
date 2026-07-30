import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from '../../routing/constants/fines-draft-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from './constants/fines-draft-create-and-manage-routing-paths.constant';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_TITLES } from './constants/fines-draft-create-and-manage-routing-titles.constant';
import { finesDraftCreateAndManageViewAllRejectedResolver } from './resolvers/fines-draft-create-and-manage-view-all-rejected.resolver';
import { finesDraftTabResolver } from '../../routing/resolvers/fines-draft-tab.resolver';
import { FINES_PERMISSIONS } from '../../../../../constants/fines-permissions.constant';
import { FINES_DRAFT_TAB_FRAGMENT } from '../../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../../constants/fines-draft-route-data-keys.constant';
import { finesDraftCountResolver } from '../../routing/resolvers/fines-draft-count.resolver';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';

const draftRootPermissionIds = FINES_PERMISSIONS;

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
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: finesDraftTabResolver({
        useFragmentForStatuses: true,
        defaultTab: FINES_DRAFT_TAB_FRAGMENT.review,
        includeSubmittedBy: true,
      }),
      [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: finesDraftCountResolver({
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        includeSubmittedBy: true,
      }),
    },
  },
  {
    path: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.viewAllRejected,
    loadComponent: () =>
      import('../fines-draft-create-and-manage-view-all-rejected/fines-draft-create-and-manage-view-all-rejected.component').then(
        (c) => c.FinesDraftCreateAndManageViewAllRejectedComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_TITLES.children.viewAllRejected,
    },
    resolve: {
      title: TitleResolver,
      [FINES_DRAFT_ROUTE_DATA_KEYS.allRejectedAccounts]: finesDraftCreateAndManageViewAllRejectedResolver,
    },
  },
];
