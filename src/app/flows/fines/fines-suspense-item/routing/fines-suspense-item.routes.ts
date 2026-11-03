import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { finesSuspenseBusinessUnitsResolver } from './resolvers/fines-suspense-business-units.resolver';
import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from './constants/fines-suspense-item-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_TITLES } from './constants/fines-suspense-item-routing-titles.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    pathMatch: 'full',
  },
  {
    path: FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    loadComponent: () =>
      import('../fines-suspense-item-search/fines-suspense-item-search.component').then(
        (c) => c.FinesSuspenseItemSearchComponent,
      ),
    canActivate: [routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_SUSPENSE_ITEM_ROUTING_TITLES.children.search,
      routePermissionId: [FINES_PERMISSIONS['view-suspense-items'], FINES_PERMISSIONS['manage-suspense-items']],
    },
    resolve: {
      title: TitleResolver,
      businessUnits: finesSuspenseBusinessUnitsResolver,
    },
  },
];
