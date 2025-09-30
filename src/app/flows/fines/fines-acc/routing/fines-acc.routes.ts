import { Routes } from '@angular/router';
import { FINES_ACC_ROUTING_PATHS } from './constants/fines-acc-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constants';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { defendantAccountHeadingResolver } from './resolvers/defendant-account-heading.resolver';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from './constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_TITLES } from './constants/fines-acc-defendant-routing-titles.constant';
import { defendantAccountDefendantTabResolver } from './resolvers/defendant-account-defendant-tab.resolver';

const accRootPermissionIds = FINES_PERMISSIONS;

export const routing: Routes = [
  {
    path: FINES_ACC_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`,
    canActivateChild: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [accRootPermissionIds['search-and-view-accounts']],
    },
    children: [
      {
        path: FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,

        loadComponent: () =>
          import('../fines-acc-defendant-details/fines-acc-defendant-details.component').then(
            (c) => c.FinesAccDefendantDetailsComponent,
          ),
        data: {
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.details,
        },
        resolve: { title: TitleResolver, defendantAccountHeadingData: defendantAccountHeadingResolver },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`,

        loadComponent: () =>
          import('../fines-acc-note-add/fines-acc-note-add.component').then((c) => c.FinesAccNoteAddComponent),
        canActivate: [routePermissionsGuard],
        data: {
          routePermissionId: [accRootPermissionIds['add-account-activity-notes']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.note,
        },
        resolve: { title: TitleResolver },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`,

        loadComponent: () =>
          import('../fines-acc-comments-add/fines-acc-comments-add.component').then(
            (c) => c.FinesAccCommentsAddComponent,
          ),
        canActivate: [routePermissionsGuard],
        data: {
          routePermissionId: [accRootPermissionIds['account-maintenance']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.comments,
        },
        resolve: { title: TitleResolver },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.debtor}/:partyType/amend`,

        loadComponent: () =>
          import('../fines-acc-debtor-add-amend/fines-acc-debtor-add-amend.component').then(
            (c) => c.FinesAccDebtorAddAmend,
          ),
        canActivate: [routePermissionsGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [accRootPermissionIds['account-maintenance']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.debtor,
        },
        resolve: {
          title: TitleResolver,
          debtorAmendFormData: defendantAccountDefendantTabResolver,
        },
      },
    ],
  },
];
