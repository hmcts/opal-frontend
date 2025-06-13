import { Routes } from '@angular/router';
import { FINES_ACC_ROUTING_PATHS } from './constants/fines-acc-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_ACC_ROUTING_PERMISSIONS } from './constants/fines-acc-routing-permissions.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_ACC_ROUTING_TITLES } from './constants/fines-acc-routing-titles.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

const accRootPermissionIds = FINES_ACC_ROUTING_PERMISSIONS;

export const routing: Routes = [
  {
    path: FINES_ACC_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: ':accountId',
    children: [
      {
        path: FINES_ACC_ROUTING_PATHS.children.details,

        loadComponent: () =>
          import('../fines-acc-details/fines-acc-details.component').then((c) => c.FinesAccDetailsComponent),
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          routePermissionId: [accRootPermissionIds['account-enquiry']],
          title: FINES_ACC_ROUTING_TITLES.children.details,
        },
        resolve: { title: TitleResolver },
      },
    ],
  },
];
