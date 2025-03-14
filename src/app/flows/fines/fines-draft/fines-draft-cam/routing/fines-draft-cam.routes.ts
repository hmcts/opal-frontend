import { Routes } from '@angular/router';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from './constants/fines-draft-cam-routing-paths.constant';
import { FINES_DRAFT_CAM_ROUTING_TITLES } from './constants/fines-draft-cam-routing-titles.constant';
import { authGuard, TitleResolver } from 'opal-frontend-common';

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
    data: { title: FINES_DRAFT_CAM_ROUTING_TITLES.children.inputter },
    resolve: { title: TitleResolver },
  },
];
