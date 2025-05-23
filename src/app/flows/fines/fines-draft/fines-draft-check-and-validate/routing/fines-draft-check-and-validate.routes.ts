import { Routes } from '@angular/router';
import { FINES_DRAFT_ROUTING_PATHS } from '../../routing/constants/fines-draft-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { IFinesDraftCheckAndValidateRoutingPermissions } from './interfaces/fines-draft-check-and-validate-routing-permissions.interface';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PERMISSIONS } from './constants/fines-draft-check-and-validate-routing-permissions.constant';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from './constants/fines-draft-check-and-validate-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_TITLES } from './constants/fines-draft-check-and-validate-routing-titles.constant';
import { finesDraftCheckAndValidateTabResolver } from './resolvers/fines-draft-check-and-validate-tab.resolver';

const draftCreateAndValidateRootPath = FINES_DRAFT_ROUTING_PATHS.children.checkAndValidate;
const draftCreateAndValidatePermissionId =
  FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PERMISSIONS[
    draftCreateAndValidateRootPath as keyof IFinesDraftCheckAndValidateRoutingPermissions
  ];

export const routing: Routes = [
  {
    path: FINES_DRAFT_ROUTING_PATHS.root,
    redirectTo: FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS.children.tabs,
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS.children.tabs,
    loadComponent: () =>
      import('../fines-draft-check-and-validate-tabs/fines-draft-check-and-validate-tabs.component').then(
        (c) => c.FinesDraftCheckAndValidateTabsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftCreateAndValidatePermissionId],
      title: FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_TITLES.children.tabs,
    },
    resolve: {
      title: TitleResolver,
      draftAccounts: finesDraftCheckAndValidateTabResolver,
    },
  },
];
