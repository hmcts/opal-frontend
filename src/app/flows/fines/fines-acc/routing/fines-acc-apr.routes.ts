import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_ACC_APR_ROUTING_PATHS } from '../fines-acc-apr-manage/constants/fines-acc-apr-routing-paths.constant';

export const routing: Routes = [
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
