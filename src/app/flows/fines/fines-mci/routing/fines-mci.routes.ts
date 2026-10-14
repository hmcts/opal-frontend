import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { HIDE_PRIMARY_NAV_ROUTE_DATA_KEY } from '@app/constants/route-data.constant';
import { fetchBusinessUnitsResolver } from '@app/flows/fines/routing/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_MCI_ROUTING_PATHS } from './constants/fines-mci-routing-paths.constant';
import { FINES_MCI_ROUTING_TITLES } from './constants/fines-mci-routing-titles.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_MCI_ROUTING_PATHS.children.createAllocate,
    pathMatch: 'full',
  },
  {
    path: FINES_MCI_ROUTING_PATHS.children.createAllocate,
    loadComponent: () =>
      import('../fines-mci-create-allocate/fines-mci-create-allocate.component').then(
        (c) => c.FinesMciCreateAllocateComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
      title: FINES_MCI_ROUTING_TITLES.children.createAllocate,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_MCI_ROUTING_PATHS.children.create,
    children: [
      {
        path: FINES_MCI_ROUTING_PATHS.children.till,
        children: [
          {
            path: FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
            loadComponent: () =>
              import('../fines-mci-create-till/fines-mci-create-till-select-bu/fines-mci-create-till-select-bu.component').then(
                (c) => c.FinesMciCreateTillSelectBuComponent,
              ),
            canActivate: [authGuard, routePermissionsGuard],
            data: {
              permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
              routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
              title: FINES_MCI_ROUTING_TITLES.children.createTillSelectBusinessUnit,
              [HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]: true,
            },
            resolve: {
              businessUnits: fetchBusinessUnitsResolver,
              title: TitleResolver,
            },
          },
        ],
      },
    ],
  },
];
