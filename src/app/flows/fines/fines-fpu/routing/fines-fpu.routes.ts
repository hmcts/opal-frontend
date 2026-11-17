import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_FPU_ROUTING_TITLES } from './constants/fines-fpu-routing-titles.constant';

export const routing: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('../fines-fpu-tabs/fines-fpu-tabs.component').then((c) => c.FinesFpuTabsComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['publish-fixed-penalty']],
      title: FINES_FPU_ROUTING_TITLES.root,
    },
    resolve: { title: TitleResolver },
  },
];
