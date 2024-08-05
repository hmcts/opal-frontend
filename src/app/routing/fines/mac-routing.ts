import { Routes } from '@angular/router';
import { authGuard } from '@guards';

export const macRouting: Routes = [
  {
    path: '',
    redirectTo: 'account-details',
    pathMatch: 'full',
  },
  {
    path: 'account-details',
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard],
  },
];
