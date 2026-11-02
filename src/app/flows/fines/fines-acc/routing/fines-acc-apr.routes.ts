import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_ACC_APR_ROUTING_PATHS } from './constants/fines-acc-apr-routing-paths.constant';
import { finesAccAprPageRoute } from './fines-acc-apr-page-route';

export const routing: Routes = [
  finesAccAprPageRoute(FINES_ACC_APR_ROUTING_PATHS.children.list, 'Manage Alternate Payment References', () =>
    import('../fines-acc-apr-list/fines-acc-apr-list.component').then((c) => c.FinesAccAprListComponent),
  ),
  finesAccAprPageRoute(FINES_ACC_APR_ROUTING_PATHS.children.delete, 'Remove Alternate Payment Reference', () =>
    import('../fines-acc-apr-delete/fines-acc-apr-delete.component').then((c) => c.FinesAccAprDeleteComponent),
  ),
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
