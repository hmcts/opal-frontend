import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth.guard';
import { FINES_DRAFT_CAV_ROUTING_PATHS } from './constants/fines-draft-cav-routing-paths.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_DRAFT_CAV_ROUTING_PATHS.children.checker,
    pathMatch: 'full',
  },
  {
    path: FINES_DRAFT_CAV_ROUTING_PATHS.children.checker,
    loadComponent: () =>
      import('../fines-draft-cav-checker/fines-draft-cav-checker.component').then(
        (c) => c.FinesDraftCavCheckerComponent,
      ),
    canActivate: [authGuard],
  },
];
