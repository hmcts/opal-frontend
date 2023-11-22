import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@guards';

const routes: Routes = [
  { path: '', redirectTo: 'test-page', pathMatch: 'full' },
  {
    path: 'test-page',
    loadComponent: () => import('./pages/test-page/test-page.component').then((c) => c.TestPageComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent),
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
