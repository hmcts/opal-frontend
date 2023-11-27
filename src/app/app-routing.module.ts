import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, signedInGuard } from '@guards';

const routes: Routes = [
  { path: '', redirectTo: 'test-page', pathMatch: 'full' },
  {
    path: 'test-page',
    loadComponent: () => import('./pages/test-page/test-page.component').then((c) => c.TestPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
