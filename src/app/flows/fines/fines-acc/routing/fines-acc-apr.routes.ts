import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';
import { businessUnitRoutePermissionsGuard } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { finesAccAprResolver } from './resolvers/fines-acc-apr/fines-acc-apr.resolver';

export const routing: Routes = [
  {
    path: FINES_ACC_APR_ROUTING_PATHS.children.delete,
    loadComponent: () =>
      import('../fines-acc-apr-delete/fines-acc-apr-delete.component').then((c) => c.FinesAccAprDeleteComponent),
    canActivate: [businessUnitRoutePermissionsGuard],
    runGuardsAndResolvers: 'always',
    data: {
      title: 'Remove Alternate Payment Reference',
      routePermissionId: [FINES_PERMISSIONS['manage-alternate-payment-references']],
      accessDeniedPath: FINES_ACC_APR_ROUTING_PATHS.children.denied,
    },
    resolve: { title: TitleResolver, aprs: finesAccAprResolver },
  },
  {
    path: FINES_ACC_APR_ROUTING_PATHS.children.manage,
    loadComponent: () =>
      import('../fines-acc-apr-manage/fines-acc-apr-manage.component').then((c) => c.FinesAccAprManageComponent),
    canActivate: [businessUnitRoutePermissionsGuard],
    runGuardsAndResolvers: 'always',
    data: {
      title: 'Manage Alternate Payment References',
      routePermissionId: [FINES_PERMISSIONS['manage-alternate-payment-references']],
      accessDeniedPath: FINES_ACC_APR_ROUTING_PATHS.children.denied,
    },
    resolve: { title: TitleResolver, aprs: finesAccAprResolver },
  },
  {
    path: FINES_ACC_APR_ROUTING_PATHS.children.denied,
    loadComponent: () =>
      import('../fines-acc-apr-access-denied/fines-acc-apr-access-denied.component').then(
        (c) => c.FinesAccAprAccessDeniedComponent,
      ),
    data: { title: 'Access Denied' },
    resolve: { title: TitleResolver },
  },
];
