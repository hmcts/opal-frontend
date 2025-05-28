import { Routes } from '@angular/router';
import { routing as macRouting } from '../fines-mac/routing/fines-mac.routes';
import { routing as draftRouting } from '../fines-draft/routing/fines-draft.routes';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { userStateResolver } from '@hmcts/opal-frontend-common/resolvers/user-state';

export const finesRouting: Routes = [
  {
    path: FINES_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FINES_ROUTING_PATHS.root,
    loadComponent: () => import('../fines.component').then((c) => c.FinesComponent),
    children: [
      {
        path: FINES_ROUTING_PATHS.children.mac.root,
        loadComponent: () => import('../fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        children: macRouting,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: FINES_ROUTING_PATHS.children.draft.root,
        loadComponent: () => import('../fines-draft/fines-draft.component').then((c) => c.FinesDraftComponent),
        children: draftRouting,
        canActivate: [authGuard],
      },
    ],
    resolve: { userState: userStateResolver },
  },
];
