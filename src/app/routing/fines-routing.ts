import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';
import { userStateResolver } from '@resolvers';

export const finesRouting: Routes = [
  {
    path: 'fines',
    loadComponent: () => import('../pages/fines/fines.component').then((c) => c.FinesComponent),
    children: [
      {
        path: '',
        redirectTo: 'fines-test',
        pathMatch: 'full',
      },
      {
        path: 'fines-test',
        loadComponent: () => import('../pages/fines/fines-test/fines-test.component').then((c) => c.FinesTestComponent),
        canActivate: [authGuard],
        children: [
          {
            path: '',
            redirectTo: 'fines-nested-test',
            pathMatch: 'full',
          },
          {
            path: 'fines-nested-test',
            loadComponent: () =>
              import('../pages/fines/fines-test/fines-nested-test/fines-nested-test.component').then(
                (c) => c.FinesNestedTestComponent,
              ),
            canActivate: [authGuard],
          },
        ],
      },
    ],
    resolve: { userState: userStateResolver },
    canDeactivate: [canDeactivateGuard],
  },
];
