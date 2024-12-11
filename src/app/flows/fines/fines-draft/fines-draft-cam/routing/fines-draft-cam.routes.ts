import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth.guard';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from './constants/fines-draft-cam-routing-paths.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_DRAFT_CAM_ROUTING_PATHS.children.inputter,
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_CAM_ROUTING_PATHS.children.inputter,
    loadComponent: () =>
      import('../fines-draft-cam-inputter/fines-draft-cam-inputter.component').then(
        (c) => c.FinesDraftCamInputterComponent,
      ),
    canActivate: [authGuard],
  },
];
