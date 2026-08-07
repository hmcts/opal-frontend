import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
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
    canActivate: [authGuard],
    data: {
      title: FINES_MCI_ROUTING_TITLES.children.createAllocate,
    },
    resolve: {
      title: TitleResolver,
    },
  },
];
