import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routing as pagesRouting } from '@routing/pages';
import { routing as flowsRouting } from '@routing/flows/flows.routes';

const routes: Routes = [...pagesRouting, ...flowsRouting];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      canceledNavigationResolution: 'computed',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
